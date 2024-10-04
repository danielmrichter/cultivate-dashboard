const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const testingFunctions = require("../modules/testing-functions");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 POST Route to recieve beet data.
 */
router.post("/", async (req, res) => {
  // Need to check if we're in production, or if we're testing.
  // This is because our testing won't have a ticket system
  // integrated, since it's external to this app.
  if (process.env.NODE_ENV === "production") {
    let client;
    try {
      // Since there's multiple entries at a time, we're going to use
      // a sql transaction. This allows us to double check that we're not
      // creating orphan data.
      client = await pool.connect();
      await client.query("BEGIN");
      // Now, let's send our data over.
      const newBeetData = await Promise.all(
        req.body.map((data) => {
          const {
            temperature_time,
            temperature,
            piler_id,
            beetbox_id,
            coordinates,
            ticket_number,
          } = data;
          const sqlText = `
              INSERT INTO "beet_data"
              ("temperature_time", "temperature", "piler_id", "beetbox_id", "updated_at", "ticket_id", "coordinates")
               VALUES
              ($1, $2, $3, $4, $5, $6, $7)
              RETURNING *;`;
          const sqlValues = [
            temperature_time,
            temperature,
            piler_id,
            beetbox_id,
            temperature_time,
            ticket_number,
            testingFunctions.formatCoordinates(coordinates)
          ];
          return client.query(sqlText, sqlValues);
        })
      );
      // Now that that's done, we need to check if we have to create any
      // alerts. First, let's check if there's any that we need to create.
      const newAlertsToCreate = newBeetData.filter(
        (data) => data.rows[0].temperature > 39
      );
      await Promise.all(
        newAlertsToCreate.map((data) => {
          const newAlertToCreate = data.rows[0];
          const newAlertSqlText = `INSERT INTO "alerts"
            ("piler_id", "beet_data_id")
            VALUES
            ($1, $2)`;
          return client.query(newAlertSqlText, [
            newAlertToCreate.piler_id,
            newAlertToCreate.id,
          ]);
        })
      );
      await client.query("COMMIT");
      res.sendStatus(201);
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("Error posting data!".error);
    } finally {
      client.release();
    }
  } else {
    // This is only used for testing and development purposes.
    // Bypasses a few systems so we can make sure everything works.
    let response = await testingFunctions.developmentPostForBeetData(req);
    response ? res.sendStatus(201) : res.sendStatus(500);
  }
});
/**
 * GET /api/beet_data/:siteid
 */
router.get("/:siteid", async (req, res) => {
  let siteId = req.params.siteid;
  try {
    // These are some SQL Queries we'll use later.

    // This first one will get us a list of the pilers at a site, as well as shape some objects that will be our data.
    const sqlPilerText = `
    SELECT "sites"."site" AS "site_name", 
    JSONB_AGG(JSONB_BUILD_OBJECT(
      'temperature', "beet_data"."temperature",
      'beet_data_id', "beet_data"."id",
      'time', "beet_data"."temperature_time")) AS "dayActuals",
    "pilers"."id" AS "piler_id", 
    "pilers"."name" AS "piler_name"
    FROM "pilers"
        JOIN "sites" ON "pilers"."site_id" = "sites"."id"
        JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
        WHERE "sites"."id" = $1
        AND "beet_data"."temperature_time" >= CURRENT_DATE
    	  AND "beet_data"."temperature_time" < CURRENT_DATE + INTERVAL '1 day'
        GROUP BY "sites"."site", "pilers"."id", "pilers"."name";
      `;
    // This will be used to pull monthly averages for a given piler.
    const sqlMonthlyAvgText = `SELECT 
    AVG("beet_data"."temperature") AS "avgTempOfEachDay", 
    DATE_TRUNC('day', "beet_data"."temperature_time") AS "day"
	      FROM "pilers"
        JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
        WHERE "pilers"."id" = $1
        AND "beet_data"."temperature_time" >= NOW() - INTERVAL '1 month'
        GROUP BY "day", "pilers"."id"
        ORDER BY "day";
     `;
    // Now, let's query the database.
    const sqlPilerResponse = await pool.query(sqlPilerText, [siteId]);
    let dataToSend;
    // If there was data, now we can shape it. The front end code
    // Expects it to be in a pretty specific shape to make the data work.
    if (sqlPilerResponse.rows[0]) {
      // Pull the site info out of the first entry that we grabbed.
      dataToSend = {
        site_id: siteId,
        site_name: sqlPilerResponse.rows[0].site_name,
        pilers: [],
      };
      // Now, we can loop through the data. We need to get the monthly averages
      // For each piler.
      for (let i = 0; i < sqlPilerResponse.rows.length; i++) {
        // Now, let's go grab the monthly averages.
        const monthlyAvgResponse = await pool.query(sqlMonthlyAvgText, [
          sqlPilerResponse.rows[i].piler_id,
        ]);

        // Do some object destructuring to only send back the data we need in each object.
        // We had to pull site info during the SQL query, but we only send it back once.
        const { dayActuals, piler_name, piler_id } = sqlPilerResponse.rows[i];

        // We're not getting the datetime in the format we want. So, we need to convert it.
        // These are helper functions to convert it to the format we want.
        const convertedDayActuals = dayActuals.map((day) => {
          return {
            ...day,
            time: testingFunctions.convertDateTimeStringToTimeString(day.time),
          };
        });
        const convertedMonthlyAverages = monthlyAvgResponse.rows.map(
          (month) => {
            return {
              avgTempOfEachDay: Number(month.avgTempOfEachDay),
              day: testingFunctions.convertDateObjectToDateString(month.day),
            };
          }
        );
        const newPilerObj = {
          piler_name,
          piler_id,
          dayActuals: convertedDayActuals,
          monthAvgDaily: convertedMonthlyAverages,
        };
        // Now that we have a piler object, shove it into an array to send back.
        dataToSend.pilers.push(newPilerObj);
      }
    } else {
      // This is to accomodate the edge case where there are no tickets for the day.
      // This will go get the monthly data that should already exist.
      dataToSend = await testingFunctions.getMonthlyData(siteId)
    }
    res.send(dataToSend);
  } catch (error) {
    console.log("Error getting data for a site: ", error);
    res.sendStatus(500);
  }
});

module.exports = router;

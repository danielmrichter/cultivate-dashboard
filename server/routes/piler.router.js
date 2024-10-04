const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const testingFunctions = require("../modules/testing-functions");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/:id", rejectUnauthenticated, async (req, res) => {
  try {
    const pilerId = req.params.id;
    const ticketDataSqlText = `
    SELECT    
      "tickets"."id" AS "ticketId", 
      "tickets"."ticket_number", 
      "beet_data"."temperature",
      "beet_data"."updated_at",
      "tickets"."truck",
      "growers"."field",
      "beet_data"."coordinates",
      "beet_data"."temperature_time",
      "beet_data"."id" AS "beet_data_id"
      FROM "pilers"
      JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
      JOIN "tickets" ON "beet_data"."ticket_id" = "tickets"."id"
      JOIN "growers" ON "tickets"."grower_id" = "growers"."id"
      WHERE "pilers"."id" = $1;`;
    const ticketData = await pool.query(ticketDataSqlText, [pilerId]);

    // One thing to explain about this query:
    // the column "coordinates" on "beet_data" is a point data type.
    // This is used to store the coordinates. Since, for graph, we want the
    // x and y separated, we can target them like they're an array using the
    // [0], and [1]. The [0] will give us latitude, and [1] longitude.
    const heatMapDataSqlText = `SELECT
"beet_data"."coordinates"[0] AS "x",
"beet_data"."coordinates"[1] AS "y",
"beet_data"."temperature",
"beet_data"."id"
FROM "pilers"
JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
WHERE "pilers"."id" = $1;`;
    const heatMatData = await pool.query(heatMapDataSqlText, [pilerId]);

    const barChartDaySqlText = `SELECT
AVG("beet_data"."temperature") AS "temperature",
DATE_TRUNC('hour', "beet_data"."temperature_time") AS "hour"
FROM "pilers"
JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
WHERE "pilers"."id" = $1
AND "beet_data"."temperature_time" >= CURRENT_DATE
AND "beet_data"."temperature_time" < CURRENT_DATE + INTERVAL '1 day'
GROUP BY "hour";`;
    const barChartDayData = await pool.query(barChartDaySqlText, [pilerId]);
    const barChartMonthSqlText = `SELECT
AVG("beet_data"."temperature") AS "temperature",
DATE_TRUNC('day', "beet_data"."temperature_time") AS "day"
FROM "pilers"
JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
WHERE "pilers"."id" = $1
AND "beet_data"."temperature_time" >= NOW() - INTERVAL '1 month'
GROUP BY "day";`;
    const barChartMonthData = await pool.query(barChartMonthSqlText, [pilerId]);
    const formattedBarChartDayData = barChartDayData.rows.map((entry) => {
      return {
        temperature: Number(entry.temperature),
        hour: testingFunctions.convertDateTimeStringToHour(entry.hour),
      };
    });
    const formattedHeatMapData = heatMatData.rows.map((entry) => {
      return {
        ...entry,
        temperature: Number(entry.temperature),
      };
    });
    const formattedBarChartMonthData = barChartMonthData.rows.map((entry) => {
      return {
        temperature: Number(entry.temperature),
        day: testingFunctions.convertDateObjectToDateString(entry.day),
      };
    });
    const siteInfoQuery = `
SELECT 
"sites"."site" AS "site_name", 
"sites"."id",
"pilers"."id" AS "piler_id", 
"pilers"."name" AS "piler_name" FROM "sites"
JOIN "pilers" ON "pilers"."site_id" = "sites"."id"
WHERE "pilers"."id" = $1;`;
    const siteInfo = await pool.query(siteInfoQuery, [pilerId]);
    const dataToSend = {
      barChartDayData: formattedBarChartDayData,
      heatMapData: formattedHeatMapData,
      ticketData: ticketData.rows,
      barChartMonthData: formattedBarChartMonthData,
      siteInfo: siteInfo.rows[0],
    };
    res.send(dataToSend);
  } catch (error) {
    console.log("Error in GET/api/piler/:id: ", error);
    res.sendStatus(500);
  }
});

router.put("/update/:id", rejectUnauthenticated, async (req, res) => {
  const beetDataId = req.params.id;
  const {
    ticket_number,
    temperature,
    truck,
    coordinates,
    temperature_time,
    ticketId
  } = req.body;

  try {
    // Updating ticket table
    const updateTicketSqlText = `
      UPDATE "tickets" 
      SET 
        "ticket_number" = $1,
        "truck" = $2 
      WHERE "id" = $3 
      RETURNING "id";`;

    const ticketResult = await pool.query(updateTicketSqlText, [
      ticket_number,
      truck,
      ticketId,
    ]);

    if (ticketResult.rows.length === 0) {
      return res.sendStatus(404);
    }

    const updatedGrowerId = ticketResult.rows[0].grower_id;

    // Update beet_data table
    const updateBeetDataSqlText = `
      UPDATE "beet_data" 
      SET 
        "temperature" = $1,
        "coordinates" = POINT($2, $3),
        "temperature_time" = $4
      WHERE "id" = $5;`;

    await pool.query(updateBeetDataSqlText, [
      temperature,
      coordinates.x,
      coordinates.y,
      temperature_time,
      beetDataId,
    ]);

    // Fetching the Piler Id to send back to update DOM
    const getPilerIdSqlText = `
      SELECT "beet_data"."piler_id" 
      FROM "beet_data"  
      WHERE "beet_data"."id" = $1;`;

    const pilerResult = await pool.query(getPilerIdSqlText, [beetDataId]);

    if (pilerResult.rows.length === 0) {
      return res.sendStatus(404);
    }
    console.log('beetDataId is:', pilerResult.rows)
    
    const pilerId = pilerResult.rows[0].piler_id;
    console.log('Piler ID is:', pilerId);

    res.send({ pilerId });
  } catch (error) {
    console.log("Error in PUT/api/piler/:id: ", error);
    res.sendStatus(500);
  }
});


router.delete('/ticket/:beet_data_id', async (req, res) => {
  const beetDataId = req.params.beet_data_id;

  // SQL query to delete beet_data, related alerts, and the associated ticket
  const queryText = `
    WITH deleted_beet_data AS (
      DELETE FROM beet_data
      WHERE id = $1
      RETURNING id, piler_id, ticket_id
    ),
    deleted_alerts AS (
      DELETE FROM alerts
      WHERE beet_data_id IN (SELECT id FROM deleted_beet_data)
      RETURNING *
    )
    DELETE FROM tickets WHERE id = (SELECT ticket_id FROM deleted_beet_data LIMIT 1)
    RETURNING (SELECT piler_id FROM deleted_beet_data LIMIT 1);
  `;

  try {
    const result = await pool.query(queryText, [beetDataId]);

    // Extracting piler_id from the result
    const pilerId = result.rows.length > 0 ? result.rows[0].piler_id : null;

    // Sending success response with the piler_id
    res.send({piler_id: pilerId});
  } catch (error) {
    console.error('Error deleting beet data, alerts, and ticket:', error);
    res.sendStatus(500)
  }
});

module.exports = router;

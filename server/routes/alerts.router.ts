import express from "express";
import pool from "../modules/pool";
const router = express.Router();
import { rejectUnauthenticated } from "../modules/authentication-middleware";
import { convertDateTimeStringToDateTime } from "../modules/helper-functions";
import { IAUser } from "../constants/types";

router.get("/mini/:id", rejectUnauthenticated, async (req, res) => {
  try {
    const miniId = Number(req.params.id);
    const sqlText = `
    SELECT 
      "beet_data".temperature, 
      "beet_data".temperature_time, 
      "pilers"."name" AS "piler_name", 
      "sites"."id" AS "site_id",
      "alerts"."id" 
    FROM "alerts"
    JOIN "beet_data" ON "alerts".beet_data_id = "beet_data".id
    JOIN "pilers" ON "alerts"."piler_id" = "pilers"."id"
    JOIN "sites" ON "pilers"."site_id" = "sites"."id"
    WHERE "sites"."id" = $1
    AND "alerts".is_active = true;
  `;
    const dbRes = await pool.query(sqlText, [miniId]);
    let newAlertList = [];

    for (let i = 0; i < dbRes.rows.length; i++) {
      const { temperature_time } = dbRes.rows[i];

      const convertedAlertTime =
        convertDateTimeStringToDateTime(temperature_time);

      const newAlert = {
        ...dbRes.rows[i],
        temperature_time: convertedAlertTime,
      };

      newAlertList.push(newAlert);
    }
    res.send(newAlertList);
  } catch (dbErr) {
    console.log("Error getting alerts from the DB! ", dbErr);
    res.sendStatus(500);
  }
});
router.get("/site/:id", rejectUnauthenticated, async (req: IAUser, res) => {
  try {
    const sqlText = `
    SELECT
      "alerts".id AS "alert_id", 
      "sites"."id", 
      "alerts".is_active, 
      "alerts".updated_at, 
      "pilers"."name" AS "piler_name", 
      "tickets".truck, 
      "tickets".ticket_number, 
      "beet_data".temperature, 
      "beet_data".coordinates, 
      "beet_data".temperature_time, 
      "growers"."field" AS "farm"  
    FROM "alerts"
    JOIN "pilers" ON "alerts"."piler_id" = "pilers"."id"
    JOIN "beet_data" ON "alerts".beet_data_id = "beet_data".id
    JOIN "sites" ON "pilers"."site_id" = "sites"."id"
    JOIN "tickets" ON "beet_data".ticket_id = "tickets".id
    JOIN "growers" ON "tickets".grower_id = "growers".id
    WHERE "sites"."id" = $1;
    `;

    const dbRes = await pool.query(sqlText, [req.params.id]);

    // Sets new arrays for the warnings and for the red alerts
    let warningAlerts = [];
    let redAlerts = [];
    // Loops through the alerts pulled for that site
    for (let i = 0; i < dbRes.rows.length; i++) {
      const { temperature, temperature_time, updated_at } = dbRes.rows[i];

      // Converts the alert time
      const convertedAlertTime =
        convertDateTimeStringToDateTime(temperature_time);

        const convertedUpdatedTime = 
        convertDateTimeStringToDateTime(updated_at)
      // Creates a new alert object with the converted time
      const newAlert = {
        ...dbRes.rows[i],
        temperature_time: convertedAlertTime,
        updated_at: convertedUpdatedTime
      };

      // Separates the alerts based on temperature
      if (temperature < 43) {
        warningAlerts.push(newAlert);
      } else {
        redAlerts.push(newAlert);
      }
    }

    res.send({
      warningAlerts,
      redAlerts,
    });
  } catch (dbErr) {
    console.log("Error getting alerts from the DB! ", dbErr);
    res.sendStatus(500);
  }
});

router.post("/", rejectUnauthenticated, (req: IAUser, res) => {
  const sqlText = `
    INSERT INTO "users_alerts"
    ("user_id", "alert_id")
    VALUES
    ($1, $2);`;
  const sqlValues = [req.user.id, req.body.id];

  pool
    .query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log("dbError posting alert as seen ", error);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `UPDATE "alerts" 
    SET "is_active" = NOT "is_active"
    WHERE "id" = $1;`;
  pool
    .query(sqlText, [req.params.id])
    .then((dbRes) => res.sendStatus(200))
    .catch((dbErr) => {
      console.log("Error updating alerts: ", dbErr);
      res.sendStatus(500);
    });
});

router.get("/", rejectUnauthenticated, (req: IAUser, res) => {
  const queryText = `SELECT
    "pilers"."name" AS "pilerName",
    "beet_data"."temperature",
    "beet_data"."temperature_time",
    "alerts"."id" AS "alert_id",
    "sites"."id" AS "site_id"
    FROM "alerts"
    JOIN "pilers" ON "alerts"."piler_id" = "pilers"."id"
    JOIN "sites" ON "pilers"."site_id" = "sites"."id"
    JOIN "users_sites" ON "sites"."id" = "users_sites"."sites_id"
    JOIN "user" ON "user"."id" = "users_sites"."users_id"
    JOIN "beet_data" ON "alerts"."beet_data_id" = "beet_data"."id"
    WHERE "user"."id" = $1
    AND "alerts"."is_active" = TRUE
    AND ("alerts"."id") NOT IN (
      SELECT "alerts"."id" FROM "alerts"
      JOIN "users_alerts" ON "alerts"."id" = "users_alerts"."alert_id"
      JOIN "user" ON "user"."id" = "users_alerts"."user_id"
      WHERE "user"."id" = $1
    );`;
  const queryValues = [req.user.id];
  pool
    .query(queryText, queryValues)
    .then((result) => {
      const formattedResponseData = result.rows.map((entry) => {
        return {
          ...entry,
          temperature_time: convertDateTimeStringToDateTime(
            entry.temperature_time
          )
        };
      });
      res.send(formattedResponseData);
    })
    .catch((error) => {
      console.log("error getting list of alerts", error);
      res.sendStatus(500);
    });
});

export default router;

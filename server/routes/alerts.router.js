const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const { rejectUnauthenticated } = require("../modules/authentication-middleware");
const { convertDateTimeStringToDateTime } = require("../modules/testing-functions");

router.get("/mini", rejectUnauthenticated, async (req, res) => {
  try {
    const sqlText = `
    SELECT 
      "beet_data".temperature, 
      "beet_data".temperature_time, 
      "pilers"."name" AS "piler_name"  
    FROM "alerts"
    JOIN "beet_data" ON "alerts".beet_data_id = "beet_data".id
    JOIN "pilers" ON "alerts"."piler_id" = "pilers"."id"
    JOIN "sites" ON "pilers"."site_id" = "sites"."id"
    JOIN "users_sites" ON "sites"."id" = "users_sites"."sites_id"
    WHERE "users_sites"."users_id" = $1
    AND "alerts".is_active = true;

  `;
  const dbRes = await pool.query(sqlText, [req.user.id])
    let newAlertList = [];
      
    for (let i=0; i<dbRes.rows.length; i++) {
        const { temperature_time } = dbRes.rows[i]
        
        const convertedAlertTime = convertDateTimeStringToDateTime(temperature_time);

        const newAlert = {
          ...dbRes.rows[i],
          temperature_time: convertedAlertTime,
        }

        newAlertList.push(newAlert);
      }
      
      res.send(newAlertList)
    } catch (dbErr) {
      console.log("Error getting alerts from the DB! ", dbErr);
      res.sendStatus(500);
    };
});

router.get("/site", rejectUnauthenticated, async (req, res) => {
  try {
    const sqlText = `
    SELECT
      "alerts".id AS "alert_id", 
      "users_sites".sites_id, 
      "alerts".is_active, 
      "alerts".updated_at, 
      "pilers"."name" AS "piler_name", 
      "tickets".truck, 
      "tickets".ticket_number, 
      "beet_data".temperature, 
      "beet_data".coordinates, 
      "beet_data".temperature_time, 
      "growers"."name" AS "grower_name"  
    FROM "alerts"
    JOIN "pilers" ON "alerts"."piler_id" = "pilers"."id"
    JOIN "beet_data" ON "alerts".beet_data_id = "beet_data".id
    JOIN "sites" ON "pilers"."site_id" = "sites"."id"
    JOIN "users_sites" ON "sites"."id" = "users_sites"."sites_id"
    JOIN "tickets" ON "beet_data".ticket_id = "tickets".id
    JOIN "growers" ON "tickets".grower_id = "growers".id
    WHERE "users_sites"."users_id" = $1;
    `;
    
    const dbRes = await pool.query(sqlText, [req.user.id]);

    // Sets new arrays for the warnings and for the red alerts
    let warningAlerts = [];
    let redAlerts = [];
    // Loops through the alerts pulled for that site
    for (let i = 0; i < dbRes.rows.length; i++) {
      const { temperature, temperature_time } = dbRes.rows[i];

      // Converts the alert time
      const convertedAlertTime = convertDateTimeStringToDateTime(temperature_time);

      // Creates a new alert object with the converted time
      const newAlert = {
        ...dbRes.rows[i],
        temperature_time: convertedAlertTime,
      };

      // Separates the alerts based on temperature
      if (temperature < 42) {
        warningAlerts.push(newAlert);
      } else {
        redAlerts.push(newAlert);
      }
    }

    res.send({
      warningAlerts,
      redAlerts
    });

  } catch (dbErr) {
    console.log("Error getting alerts from the DB! ", dbErr);
    res.sendStatus(500);
  }
});

router.post("/resolved", rejectUnauthenticated, async (req, res) => {
  const { id } = req.body;

  try {
      // This gets the current is_active status of the alert
      const selectSql = `SELECT "is_active" FROM "alerts" WHERE "id" = $1;`;
      const selectResult = await pool.query(selectSql, [id]);

      const currentStatus = selectResult.rows[0].is_active;

      // This toggles the is_active status
      const updateSql = `UPDATE "alerts" SET "is_active" = $1 WHERE "id" = $2;`;
      await pool.query(updateSql, [!currentStatus, id]);

      res.sendStatus(200);
  } catch (dbErr) {
      console.log("Error updating alert status: ", dbErr);
      res.sendStatus(500);
  }
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

module.exports = router;

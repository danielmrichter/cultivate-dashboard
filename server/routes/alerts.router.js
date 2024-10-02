const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

const { convertDateTimeStringToDateTime } = require("../modules/testing-functions");

router.get("/", rejectUnauthenticated, async (req, res) => {
  try {
    const sqlText = `
    SELECT 
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

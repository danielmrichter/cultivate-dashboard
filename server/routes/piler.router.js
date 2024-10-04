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
    const ticketDataSqlText = `SELECT 
"tickets"."id" AS "ticketd", 
"tickets"."ticket_number", 
"beet_data"."temperature",
"beet_data"."updated_at",
"tickets"."truck",
"growers"."field",
"beet_data"."coordinates",
"beet_data"."temperature_time",
"beet_data"."id"
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
"pilers"."name" AS "piler_name" FROM "sites"
JOIN "pilers" ON "pilers"."site_id" = "sites"."id"
WHERE "pilers"."id" = $1;`;
    const siteInfo = await pool.query(siteInfoQuery, [pilerId]);
    const dataToSend = {
      barChartDayData: formattedBarChartDayData,
      heatMapData: heatMatData.rows,
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

module.exports = router;

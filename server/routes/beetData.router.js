const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const testingFunctions = require("../modules/testing-functions");
const { rejectUnauthenticated } = require("../modules/authentication-middleware");

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
      client = await pool.connect();
      await client.query("BEGIN");
      await Promise.all(
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
      ("temperature_time", "temperature", "piler_id", "beetbox_id", "coordinates", "updated_at", "ticket_id")
      VALUES
      ($1, $2, $3, $4, $5, $6, $7);`;
          const sqlValues = [
            temperature_time,
            temperature,
            piler_id,
            beetbox_id,
            coordinates,
            temperature_time,
            ticket_number,
          ];
          return client.query(sqlText, sqlValues);
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
  }
  // If we're in development, we expect the req to be in a certain shape.
  // We also need to create ticket data for it.
  // So we handle it a bit differently. 
  else {
    let response = await testingFunctions.developmentPostForBeetData(req);
    response ? res.sendStatus(201) : res.sendStatus(500);
  }
});
/**
 * GET /api/beet_data
 */
router.get("/", rejectUnauthenticated, (req, res) => {
// GET ROTUE GOES HERE
});

module.exports = router;

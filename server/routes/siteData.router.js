const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const testingFunctions = require("../modules/testing-functions");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 GET Route to receive a list of pilers for a specific site .
 */
router.get("/:id", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT pilers.id AS piler_id, pilers.name FROM "pilers"
     WHERE pilers.site_id = $1`;
  const queryValues = [req.params.id];

  pool
    .query(queryText, queryValues)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error getting site data", err);
      res.sendStatus(500);
    });
});

module.exports = router;

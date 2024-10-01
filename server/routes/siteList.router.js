const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const testingFunctions = require("../modules/testing-functions");
const { rejectUnauthenticated } = require("../modules/authentication-middleware");

/**
 GET Route to receive piler data for a specific .
 */
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT * FROM "sites"
    `
  pool.query(queryText)
  .then(result => {
    res.send(result.rows)
  })
  .catch(err => {
    console.log('error getting site list', err);
    res.sendStatus(500)
  })

  
});


module.exports = router;

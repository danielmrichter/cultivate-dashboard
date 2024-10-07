const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const testingFunctions = require("../modules/testing-functions");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 GET Route to receive list of all sites with users.
 */
router.get("/", rejectUnauthenticated, (req, res) => {
    console.log('in userList router')
  const queryText = `
    SELECT "user".id, 
           "user".username, 
           CONCAT("user".first_name, ' ', "user".last_name) AS fullname, 
           "user".cell_phone AS phone, 
           "user".email,  
           "sites"."site" AS sitename
    FROM "user"
    FULL JOIN "users_sites" ON "user".id = "users_sites".users_id
    LEFT JOIN "sites" ON "sites".id = "users_sites".sites_id;
    ;`;

  pool
    .query(queryText)
    .then((result) => {
        console.log('result is ',result)
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error getting user details", err);
      res.sendStatus(500);
    });
});

module.exports = router;

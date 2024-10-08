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
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error getting user details", err);
      res.sendStatus(500);
    });
});


router.put("/", async (req, res) => {
    const { userId, newSiteId } = req.body;

    // First, check if the user_id already exists in the users_sites table
    const checkQuery = `
      SELECT * FROM "users_sites"
      WHERE "users_id" = $1;
    `;
    const checkValues = [userId];

    try {
        // Check if the user exists
        const checkResult = await pool.query(checkQuery, checkValues);

        if (checkResult.rows.length > 0) {
            // If the user exists, update their site_id
            const updateQuery = `
              UPDATE "users_sites"
              SET "sites_id" = $1
              WHERE "users_id" = $2;
            `;
            const updateValues = [newSiteId, userId];

            await pool.query(updateQuery, updateValues);
            res.sendStatus(200); // Successfully updated
        } else {
            // If the user doesn't exist, insert a new row
            const insertQuery = `
              INSERT INTO "users_sites" ("users_id", "sites_id")
              VALUES ($1, $2);
            `;
            const insertValues = [userId, newSiteId];

            await pool.query(insertQuery, insertValues);
            res.sendStatus(201); // Successfully inserted
        }
    } catch (dbErr) {
        console.log('db Error updating or inserting new site for user', dbErr);
        res.sendStatus(500); // Internal server error
    }
});

router.delete("/:id", (req,res) => {
    const queryText = `
      DELETE FROM "users_sites"
        WHERE "users_id" = $1;`
    const queryValues = [req.params.id];
    pool.query(queryText, queryValues)
    .then((dbRes) => {
        res.sendStatus(200)
    })
    .catch((dbErr)=> {
        console.log('db Error removing user from site', dbErr)
        res.sendStatus(500)
    })
})

module.exports = router;

import express from "express";
import pool from "../modules/pool";
const router = express.Router();
import { rejectUnauthenticated } from "../modules/authentication-middleware";

/**
 GET Route to receive piler data for a specific .
 */
router.get("/", rejectUnauthenticated, (req, res) => {
  const queryText = `
    SELECT * FROM "sites"
    ORDER BY "sites".id
    `;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error getting site list", err);
      res.sendStatus(500);
    });
});

router.get("/siteManager/:id", (req, res) => {
  console.log("params is ", req.params.id);
  const queryText = `
    SELECT CONCAT("user".first_name, ' ', "user".last_name) AS fullname, 
            "user".cell_phone AS phone
      FROM "user"
      JOIN "users_sites" ON "users_sites".users_id = "user"."id"
      WHERE "users_sites".sites_id = $1
      AND "user".access_level = 1;`;
  const queryValues = [req.params.id];

  pool
    .query(queryText, queryValues)
    .then((result) => {
      console.log("result is ", result);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error getting site list", err);
      res.sendStatus(500);
    });
});

export default router;

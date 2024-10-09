import express from "express";
import pool from "../modules/pool";
const router = express.Router();
import { rejectUnauthenticated } from "../modules/authentication-middleware";

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

export default router;

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

export default router;

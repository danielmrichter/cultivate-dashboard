import express from "express";
import pool from "../modules/pool";
const router = express.Router();
import { rejectUnauthenticated } from "../modules/authentication-middleware";

router.get("/", rejectUnauthenticated, (req, res) => {
  const sqlQuery = `
    SELECT "growers"."id", "growers"."field" from "growers"
    ORDER BY "growers"."field" ASC;
    `;
  pool
    .query(sqlQuery)
    .then((response) => {
      console.log("Growers are:", response.rows);
      res.send(response.rows);
    })
    .catch((dbErr) => {
      console.log("Server error geting growers:", dbErr);
    });
});

export default router;

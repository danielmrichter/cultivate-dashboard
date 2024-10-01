const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/", rejectUnauthenticated, (req, res) => {
  const sqlText = `SELECT * FROM "alerts"
	JOIN "pilers" ON "piler_id" = "pilers"."id"
	JOIN "sites" ON "pilers"."site_id" = "sites"."id"
	JOIN "users_sites" ON "sites"."id" = "users_sites"."sites_id"
	WHERE "users_sites"."users_id" = $1;`;
  pool
    .query(sqlText, [req.user.id])
    .then((dbRes) => res.send(dbRes.rows))
    .catch((dbErr) => {
      console.log("Error getting alerts from the DB! ", dbErr);
      res.sendStatus(500);
    });
});

router.put("/:id", rejectUnauthenticated, (req, res) => {
  const sqlText = `UPDATE "alerts" 
    SET "is_active" = NOT "is_active"
    WHERE "id" = $1;`;
  pool
    .query(sqlText, [req.params.id])
    .then((dbRes) => res.sendStatus(200))
    .catch((dbErr) => {
      console.log("Error updating alerts: ", dbErr);
      res.sendStatus(500);
    });
});

module.exports = router;

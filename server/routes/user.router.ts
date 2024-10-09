import express from 'express';
import { rejectUnauthenticated } from '../modules/authentication-middleware';
import encryptLib from '../modules/encryption';
import pool from '../modules/pool';
import userStrategy from '../strategies/user.strategy';
import { IAUser } from '../constants/types';

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req: IAUser, res) => {
  // Send back user object from the session (previously queried from the database)
  const userId = [req.user.id];
  let userData = {}
    const queryText = `
     SELECT "sites".id AS site_id, "sites".site AS site_name, "sites".location FROM "sites"
      JOIN "users_sites"
        ON "sites".id = "users_sites".sites_id
      JOIN "user"
        ON "user".id="users_sites".users_id
      WHERE "user".id =$1;`
    const queryValues = userId
  pool.query(queryText, queryValues)
  .then((result) => {
    userData = {...req.user, ...result.rows[0]}
    res.send(userData);
  })
  .catch(err => {
    console.log('db error getting user site', err)
    res.sendStatus(500)
  })
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password, access_level, email, cell_phone, first_name, last_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;

    const valueText = [req.body.username, password, req.body.access_level, req.body.email, req.body.cell_phone, req.body.first_name, req.body.last_name]
  pool
    .query(queryText, valueText)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

export default router;

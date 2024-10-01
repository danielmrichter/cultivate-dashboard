const pool = require("./pool");

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// This is to create dummy data for a ticket.
// Since we aren't creating the tickets in the scope of this app,
// This is a way to test that things work as we go along.
async function developmentPostForBeetData(req) {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const newTickets = await Promise.all(
      req.body.map(() => {
        // This just generates a random ticket number. For the sake of making things programatic and easier.
        let ticketNumber =
          getRandomInt(10000, 50000) + getRandomInt(10000, 50000);
        // And assign it to a random grower.
        let growerId = getRandomInt(1, 31);

        // Some random trucks to assign it to. Not sure how this will work later, but here it is.
        let trucks = ["Truck1", "Truck2", "Truck3", "Truck4", "Truck5"];
        let truckId = getRandomInt(0, 5);

        // No, I don't need to sanitize it. I'm creating it. But this is incase this is used
        // Somewhere else in the future.
        let ticketSqlText = `INSERT INTO "tickets"
                              ("ticket_number", "grower_id", "truck")
                              VALUES
                              ($1, $2, $3)
                              RETURNING "id";`;
        return client.query(ticketSqlText, [
          ticketNumber,
          growerId,
          trucks[truckId],
        ]);
      })
    );
    const newBeetData = await Promise.all(
      req.body.map((data, i) => {
        const {
          temperature_time,
          temperature,
          piler_id,
          beetbox_id,
          coordinates,
        } = data;
        const devSqlText = `
          INSERT INTO "beet_data"
          ("temperature_time", "temperature", "piler_id", "beetbox_id", "coordinates", "updated_at", "ticket_id")
          VALUES
          ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;`;
        const devSqlValues = [
          temperature_time,
          temperature,
          piler_id,
          beetbox_id,
          coordinates,
          temperature_time,
          newTickets[i].rows[0].id,
        ];
        return client.query(devSqlText, devSqlValues);
      })
    );
    const newAlertsToCreate = newBeetData.filter(
      (data) => data.rows[0].temperature > 39
    );
    await Promise.all(
      newAlertsToCreate.map((data) => {
        const newAlertToCreate = data.rows[0];
        const newAlertSqlText = `INSERT INTO "alerts"
          ("piler_id", "beet_data_id")
          VALUES
          ($1, $2)`;
        return client.query(newAlertSqlText, [
          newAlertToCreate.piler_id,
          newAlertToCreate.id,
        ]);
      })
    );
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error in POST/beet! ", error);
    return false;
  } finally {
    client.release();
  }
}

module.exports = { getRandomInt, developmentPostForBeetData };

import { Request } from "express";
import pool from "./pool";
import { PoolClient } from "pg";

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// This is to create dummy data for a ticket.
// Since we aren't creating the tickets in the scope of this app,
// This is a way to test that things work as we go along.
async function developmentPostForBeetData(req: Request) {
  let client: PoolClient;
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

        // No, I don't need to escape it. I'm creating it. But this is incase this is used
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
          ($1, $2, $3, $4, $5::point, $6, $7)
          RETURNING *;`;
        const devSqlValues = [
          temperature_time,
          temperature,
          piler_id,
          beetbox_id,
          formatCoordinates(coordinates),
          temperature_time,
          newTickets[i].rows[0].id,
        ];
        return client.query(devSqlText, devSqlValues);
      })
    );
    const newAlertsToCreate = newBeetData.filter(
      (data) => data.rows[0].temperature >= 40
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

const convertDateTimeStringToTimeString = (dateTimeString) => {
  const parsedDate = Date.parse(dateTimeString);
  const dateObject = new Date(parsedDate);
  const convertedToHoursAndMinutes = dateObject.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return convertedToHoursAndMinutes;
};

const convertDateObjectToDateString = (dateObject) => {
  const convertedDateObject = dateObject.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
  });
  return convertedDateObject;
};

const convertDateTimeStringToDateTime = (dateTimeString: Date) => {
  const parsedDate = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateTimeString);
  return parsedDate;
};

function formatCoordinates(string: string) {
  const regex = /[A-Za-z]/gi;
  const filteredString = string.replace(regex, "");
  return filteredString.replace(" ", ",");
}

function convertDateTimeStringToHour(dateTimeString: string) {
  const parsedDate = Date.parse(dateTimeString);
  const dateObject = new Date(parsedDate);
  const convertedToHoursAndMinutes = dateObject.toLocaleTimeString([], {
    hour: "2-digit",
  });
  return convertedToHoursAndMinutes;
}
// This is a helper function to get the monthly data if there is no tickets for a day,
// Like if it's 12:01 and there's nothing that's come in for the day yet.
async function getMonthlyData(siteId: string | number) {
  const sqlGetPilers = `
    SELECT 
    "pilers"."name" AS "piler_name",
     "pilers"."id" AS "piler_id",
     "sites"."site" AS "site_name"
      FROM "sites"
JOIN "pilers" ON "sites"."id" = "pilers"."site_id"
WHERE "sites"."id" = $1;`;
  const pilers = await pool.query(sqlGetPilers, [siteId]);
  const sqlMonthlyAvgText = `SELECT 
    AVG("beet_data"."temperature") AS "avgTempOfEachDay", 
    DATE_TRUNC('day', "beet_data"."temperature_time") AS "day"
	      FROM "pilers"
        JOIN "beet_data" ON "pilers"."id" = "beet_data"."piler_id"
        WHERE "pilers"."id" = $1
        AND "beet_data"."temperature_time" >= NOW() - INTERVAL '1 month'
        GROUP BY "day", "pilers"."id"
        ORDER BY "day";
     `;
  let dataToSend = {
    site_id: siteId,
    site_name: pilers.rows[0].site_name,
    pilers: [],
  };
  for (let piler of pilers.rows) {
    const monthlyAvgResponse = await pool.query(sqlMonthlyAvgText, [
      piler.piler_id,
    ]);

    // Do some object destructuring to only send back the data we need in each object.
    // We had to pull site info during the SQL query, but we only send it back once.
    const { piler_name, piler_id } = piler;

    // We're not getting the datetime in the format we want. So, we need to convert it.

    const convertedMonthlyAverages = monthlyAvgResponse.rows.map((month) => {
      return {
        avgTempOfEachDay: Number(month.avgTempOfEachDay),
        day: convertDateObjectToDateString(month.day),
      };
    });
    const newPilerObj = {
      piler_name,
      piler_id,
      dayActuals: [],
      monthAvgDaily: convertedMonthlyAverages,
    };
    // Now that we have a piler object, shove it into an array to send back.
    dataToSend.pilers.push(newPilerObj);
  }
  return dataToSend;
}

export {
  getRandomInt,
  developmentPostForBeetData,
  convertDateTimeStringToTimeString,
  convertDateObjectToDateString,
  convertDateTimeStringToDateTime,
  formatCoordinates,
  convertDateTimeStringToHour,
  getMonthlyData,
};

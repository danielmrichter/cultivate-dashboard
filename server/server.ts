import express from "express";
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
import sessionMiddleware from "./modules/session-middleware";
import passport from "./strategies/user.strategy";

// Route Includes
import userRouter from "./routes/user.router";
import siteData from "./routes/siteData.router";
import siteList from "./routes/siteList.router";
import beetDataRouter from "./routes/beetData.router";
import alertsRouter from "./routes/alerts.router";
import pilerRouter from "./routes/piler.router";
import userListRouter from "./routes/userList.router";
import growersRouter from "./routes/growers.router";
import addTicketRouter from "./routes/addTicket.router";

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/user", userRouter);
app.use("/api/siteData", siteData);
app.use("/api/siteList", siteList);
app.use("/api/beet_data", beetDataRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/piler", pilerRouter);
app.use("/api/userList", userListRouter);
app.use("/api/growers", growersRouter);
app.use("/api/add_ticket", addTicketRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

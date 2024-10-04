const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route Includes
const userRouter = require("./routes/user.router");
const siteData = require("./routes/siteData.router");
const siteList = require("./routes/siteList.router");
const beetDataRouter = require("./routes/beetData.router");
const alertsRouter = require("./routes/alerts.router");
const pilerRouter = require("./routes/piler.router");

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

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

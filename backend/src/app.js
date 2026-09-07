const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./middleware/requestLogger");

const app = express();

// Register middleware and API routes
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api", routes);

module.exports = app;

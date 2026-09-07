const express = require("express");
const router = express.Router();

const healthRoutes = require("./healthRoutes");
const propertiesRoutes = require("./propertiesRoutes");

// Register application routes
router.use("/health", healthRoutes);
router.use("/properties", propertiesRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();

const healthRoutes = require("./healthRoutes");

// Register application routes
router.use("/health", healthRoutes);

module.exports = router;

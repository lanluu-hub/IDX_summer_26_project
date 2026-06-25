const express = require("express");
const router = express.Router();

const healthController = require("../controllers/healthControllers");

router.get("/", healthController.healthCheck);

module.exports = router;

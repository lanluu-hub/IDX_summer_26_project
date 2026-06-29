const express = require("express");
const router = express.Router();

const propertiesController = require("../controllers/propertiesControllers");

router.get("/", propertiesController.properties);

module.exports = router;

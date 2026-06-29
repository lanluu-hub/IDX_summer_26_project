const express = require("express");
const router = express.Router();

const propertiesController = require("../controllers/propertiesControllers");

router.get("/", propertiesController.propertiesCheck);

module.exports = router;

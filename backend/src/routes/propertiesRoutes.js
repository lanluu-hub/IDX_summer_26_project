const express = require("express");
const router = express.Router();

const propertiesController = require("../controllers/propertiesControllers");

router.get("/", propertiesController.searchProperties);
router.get("/:id/openhouses", propertiesController.openhousesEvent);
router.get("/:id", propertiesController.propertyDetail);

module.exports = router;

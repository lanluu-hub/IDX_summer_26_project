const express = require("express");
const router = express.Router();

const propertiesController = require("../controllers/propertiesControllers");

router.get("/", propertiesController.getProperties);
router.get("/:id/openhouses", propertiesController.getPropertyOpenHouses);
router.get("/:id", propertiesController.getPropertyById);

module.exports = router;

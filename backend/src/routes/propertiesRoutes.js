const express = require("express");
const router = express.Router();

const propertiesController = require("../controllers/propertiesControllers");

router.get("/", propertiesController.searchProperties);
// /api/properties/:id/openhouse should be here
router.get("/:id", propertiesController.propertyDetail);

module.exports = router;

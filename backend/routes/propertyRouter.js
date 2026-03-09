const express = require("express");
const router = express.Router();
const { createProperty } = require("../controllers/propertyControllers");

// POST /api/properties
router.post("/", createProperty);

module.exports = router;

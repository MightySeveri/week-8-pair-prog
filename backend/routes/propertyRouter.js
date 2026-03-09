const express = require("express");
const router = express.Router();
const { getAllProperties, createProperty } = require("../controllers/propertyControllers");

// GET /api/properties
router.get("/", getAllProperties);

// POST /api/properties
router.post("/", createProperty);

module.exports = router;

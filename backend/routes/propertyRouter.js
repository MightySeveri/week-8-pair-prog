const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
} = require("../controllers/propertyControllers");

// GET /api/properties
router.get("/", getAllProperties);

// GET /api/properties/:propertyId
router.get("/:propertyId", getPropertyById);

// POST /api/properties
router.post("/", createProperty);

module.exports = router;

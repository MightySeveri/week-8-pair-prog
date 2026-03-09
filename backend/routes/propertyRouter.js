const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");

// GET /api/properties
router.get("/", getAllProperties);

// GET /api/properties/:propertyId
router.get("/:propertyId", getPropertyById);

// POST /api/properties
router.post("/", createProperty);

// DELETE /api/properties/:propertyId
router.delete("/:propertyId", deleteProperty);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");
const requireAuth = require("../middleware/requireAuth");

// protect all property routes
router.use(requireAuth);

// GET /api/properties
router.get("/", getAllProperties);

// GET /api/properties/:propertyId
router.get("/:propertyId", getPropertyById);

// POST /api/properties
router.post("/", createProperty);

// PUT /api/properties/:propertyId
router.put("/:propertyId", updateProperty);

// DELETE /api/properties/:propertyId
router.delete("/:propertyId", deleteProperty);

module.exports = router;

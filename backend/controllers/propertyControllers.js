const Property = require("../models/propertyModel");

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: "Failed to create property", error: error.message });
  }
};

module.exports = {
  createProperty,
};

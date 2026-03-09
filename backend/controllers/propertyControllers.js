const Property = require("../models/propertyModel");

// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({});
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve properties" });
  }
};

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
  getAllProperties,
  createProperty,
};

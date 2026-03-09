const mongoose = require("mongoose");
const Property = require("../models/propertyModel");

// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve properties" });
  }
};

// GET /api/properties/:propertyId
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve property" });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create({ ...req.body, user_id: req.user._id });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: "Failed to create property", error: error.message });
  }
};

// PUT /api/properties/:propertyId
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const updatedProperty = await Property.findOneAndUpdate(
      { _id: propertyId, user_id: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

// DELETE /api/properties/:propertyId
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const deletedProperty = await Property.findOneAndDelete({
      _id: propertyId,
      user_id: req.user._id,
    });

    if (!deletedProperty) {
      return res.status(404).json({ message: "property not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};

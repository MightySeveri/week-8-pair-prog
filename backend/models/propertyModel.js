const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    squarefeet: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Property", propertySchema);

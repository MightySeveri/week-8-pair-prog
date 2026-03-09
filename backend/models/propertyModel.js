const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const propertySchema = new Schema(
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
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

propertySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Property", propertySchema);

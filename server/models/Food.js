const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodType: { type: String, required: true },
  foodSize: { type: String, enum: ["Regular", "Large"], required: true },
  foodQuantity: { type: Number, required: true },
  foodPrice: { type: Number, required: true },
  foodImage: { type: String },
});

module.exports = mongoose.model("Food", foodSchema);
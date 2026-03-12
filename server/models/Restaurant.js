const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String },
  openTime: { type: String },
  closeTime: { type: String },
  restaurantImage: { type: String },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
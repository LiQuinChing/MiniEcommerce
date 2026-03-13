const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String },
  openTime: { type: String },
  closeTime: { type: String },
  supplierImage: { type: String },
});

module.exports = mongoose.model("Supplier", supplierSchema);
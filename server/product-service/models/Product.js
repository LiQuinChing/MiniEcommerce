const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  supplierName: { type: String, required: true },
  productType: { type: String, required: true },
  productSize: { type: String, enum: ["S","M","L","XL"], required: true },
  productQuantity: { type: Number, required: true },
  productPrice: { type: Number, required: true },
  productImage: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
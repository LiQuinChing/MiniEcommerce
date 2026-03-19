require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const fs = require("fs");
const path = require("path");

const productDir = path.join(__dirname, "uploads/products");
const supplierDir = path.join(__dirname, "uploads/suppliers");

if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

if (!fs.existsSync(supplierDir)) {
  fs.mkdirSync(supplierDir, { recursive: true });
}

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const foodRoutes = require("./routes/foodRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/foods", foodRoutes);
app.use("/api/restaurants", restaurantRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
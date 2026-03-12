const Food = require("../models/Food");

exports.createFood = async (req, res) => {
  try {
    const newFood = new Food({
      ...req.body,
      foodImage: req.file?.filename,
    });

    const saved = await newFood.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getFoods = async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
};

exports.updateFood = async (req, res) => {
  const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(food);
};

exports.deleteFood = async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Food deleted" });
};
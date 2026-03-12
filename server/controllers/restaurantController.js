const Restaurant = require("../models/Restaurant");

exports.createRestaurant = async (req, res) => {
  const restaurant = new Restaurant({
    ...req.body,
    restaurantImage: req.file?.filename,
  });

  const saved = await restaurant.save();
  res.json(saved);
};

exports.getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

exports.updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(restaurant);
};

exports.deleteRestaurant = async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.id);
  res.json({ message: "Restaurant deleted" });
};
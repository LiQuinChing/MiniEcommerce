const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/restaurantController");

router.post("/", upload.single("restaurantImage"), controller.createRestaurant);
router.get("/", controller.getRestaurants);
router.put("/:id", controller.updateRestaurant);
router.delete("/:id", controller.deleteRestaurant);

module.exports = router;
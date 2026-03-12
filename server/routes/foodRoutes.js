const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/foodController");

router.post("/", upload.single("foodImage"), controller.createFood);
router.get("/", controller.getFoods);
router.put("/:id", controller.updateFood);
router.delete("/:id", controller.deleteFood);

module.exports = router;
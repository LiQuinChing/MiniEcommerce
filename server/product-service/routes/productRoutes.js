const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/productController");

router.post("/send-products", controller.sendProductsToOrder);
router.post("/", upload.single("productImage"), controller.createProduct);
router.get("/", controller.getProducts);
router.put("/:id", upload.single("productImage"), controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
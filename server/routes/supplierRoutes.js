const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/supplierController");

router.post("/", upload.single("supplierImage"), controller.createSupplier);
router.get("/", controller.getSuppliers);
router.put("/:id", upload.single("supplierImage"), controller.updateSupplier);
router.delete("/:id", controller.deleteSupplier);

module.exports = router;
const Supplier = require("../models/Supplier");
const fs = require("fs");
const path = require("path");

exports.createSupplier = async (req, res) => {
  const supplier = new Supplier({
    ...req.body,
    supplierImage: req.file?.filename,
  });

  const saved = await supplier.save();
  res.json(saved);
};

exports.getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

exports.updateSupplier = async (req, res) => {

  try {

    const existingSupplier = await Supplier.findById(req.params.id);

    if (!existingSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const updateData = {
      supplierName: req.body.supplierName,
      address: req.body.address,
      type: req.body.type,
      openTime: req.body.openTime,
      closeTime: req.body.closeTime
    };

    const oldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "suppliers",
      existingSupplier.supplierImage || ""
    );

    // CASE 1: Remove image
    if (req.body.removeImage === "true" && !req.file) {

      if (existingSupplier.supplierImage && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.supplierImage = null;

    }

    // CASE 2: Upload new image
    if (req.file) {

      if (existingSupplier.supplierImage && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.supplierImage = req.file.filename;

    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    res.json(supplier);

  } catch (error) {
    res.status(500).json(error);
  }

};

exports.deleteSupplier = async (req, res) => {

  try {

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Delete supplier image
    if (supplier.supplierImage) {

      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "suppliers",
        supplier.supplierImage
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.json({ message: "Supplier deleted" });

  } catch (error) {
    res.status(500).json(error);
  }

};
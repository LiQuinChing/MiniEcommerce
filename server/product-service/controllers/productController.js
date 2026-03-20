const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// exports.sendProductsToOrderConfirmation = async (req, res) => {

//   try {

//     const response = await axios.post(
//       "http://order-service:8080/orders/receive-products",
//       {
//         message: "Products sent to the order"
//       }
//     );

//     res.json(response.data);

//   } catch (err) {

//     res.status(500).json({
//       message: "Order service communication failed"
//     });

//   }

// };

// inter-service communication with Go order service
// exports.sendProductsToOrder = async (req, res) => {

//   try {

//     const { productId, action } = req.body;

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (action === "add") {

//       const response = await axios.post(
//         "http://order-service:8080/api/orders",
//         {
//           cart: [
//             {
//               product_id: product._id,
//               product_name: product.productName,
//               quantity: 1,
//               unit_price: product.productPrice
//             }
//           ]
//         }
//       );

//       return res.json({
//         message: "Product sent to order",
//         order: response.data
//       });

//     }

//     if (action === "remove") {

//       // OPTIONAL: remove (not implemented in Go)
//       return res.json({
//         message: "Product removed from order"
//       });

//     }

//   } catch (err) {

//     res.status(500).json({
//       message: "Order service communication failed"
//     });

//   }

// };

exports.sendProductsToOrder = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🚨 Check stock
    if (product.productQuantity <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    // ✅ Reduce quantity
    product.productQuantity -= 1;
    await product.save();

    // ✅ Send to order-service
    const response = await axios.post(
      "http://order-service:8080/api/orders",
      {
        cart: [
          {
            product_id: product._id,
            product_name: product.productName,
            quantity: 1,
            unit_price: product.productPrice
          }
        ]
      }
    );

    res.json({
      message: "Product sent to order",
      order: response.data
    });

  } catch (err) {
    res.status(500).json({
      message: "Order service communication failed"
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      productImage: req.file?.filename,
    });

    const saved = await newProduct.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.updateProduct = async (req, res) => {

  try {

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {
      productName: req.body.productName,
      supplierName: req.body.supplierName,
      productType: req.body.productType,
      productSize: req.body.productSize,
      productQuantity: Number(req.body.productQuantity),
      productPrice: Number(req.body.productPrice)
    };

    const oldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "products",
      existingProduct.productImage || ""
    );

    // CASE 1: Remove image only
    if (req.body.removeImage === "true" && !req.file) {

      if (existingProduct.productImage && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.productImage = null;

    }

    // CASE 2: Upload new image
    if (req.file) {

      if (existingProduct.productImage && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.productImage = req.file.filename;

    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    res.json(product);

  } catch (error) {
    res.status(500).json(error);
  }

};

exports.deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image file
    if (product.productImage) {

      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "products",
        product.productImage
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json(error);
  }

};
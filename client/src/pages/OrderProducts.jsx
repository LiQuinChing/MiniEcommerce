import React, { useEffect, useState } from "react";
import api from "../api";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

function OrderProducts() {

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    document.title = "SUSARA Clothing | Order Products";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
    loadSuppliers();
  }, []);

  // ✅ SEND PRODUCT
  const sendToOrder = async (productId) => {
    try {
      await api.post("/products/send-products", {
        productId
      });

      toast.success("Product Added to order 🛒", {
        style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
        },
      });

      loadProducts(); // refresh quantity

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to send product", {
        style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
        },
      });
    }
  };

  // GROUP
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.supplierName]) {
      acc[product.supplierName] = [];
    }
    acc[product.supplierName].push(product);
    return acc;
  }, {});

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-10">
          🛒<span className="text-green-600"> SUSARA Clothing</span> - Order Products
        </h1>

        {Object.keys(groupedProducts).map((supplier) => {

          const supplierData = suppliers.find(
            (s) => s.supplierName === supplier
          );

          return (
            <div key={supplier} className="mb-12">

              {/* Supplier */}
              <div className="flex items-center gap-4 mb-6">

                {supplierData?.supplierImage && (
                  <img
                    src={`http://localhost:8888/uploads/suppliers/${supplierData.supplierImage}`}
                    className="w-12 h-12 rounded-full"
                  />
                )}

                <h2 className="text-xl font-semibold">{supplier}</h2>
              </div>

              {/* Products */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

                {groupedProducts[supplier].map((product) => (

                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                  >

                    {/* Image */}
                    <div className="relative">

                        <img
                            src={`http://localhost:8888/uploads/products/${product.productImage}`}
                            className="h-48 w-full object-cover"
                        />

                        {product.productQuantity > 0 ? (
                            <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                            In Stock
                            </span>
                        ) : (
                            <span className="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Out of Stock
                            </span>
                        )}

                    </div>

                    <div className="p-4 space-y-2">

                      <h3 className="font-semibold text-lg">
                        {product.productName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {product.productType} | {product.productSize}
                      </p>

                      <p className="text-green-600 font-bold text-xl">
                        Rs {product.productPrice}.00
                      </p>

                      {/* 🛒 BUTTON */}
                      <button
                        onClick={() => sendToOrder(product._id)}
                        disabled={product.productQuantity <= 0}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white transition font-bold
                          ${product.productQuantity > 0
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"}
                        `}
                      >
                        <FiShoppingCart strokeWidth={3} className="w-4 h-4"/>
                        {product.productQuantity > 0
                          ? "Add to Order"
                          : "Unavailable"}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default OrderProducts;
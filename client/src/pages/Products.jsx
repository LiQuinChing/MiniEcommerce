import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPackage } from "react-icons/fi";
// import toast from "react-hot-toast";

function Products() {

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  // const [selectedProducts, setSelectedProducts] = useState({});
  const navigate = useNavigate();

  // ================= LOAD DATA =================

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  // ================= SYNC WITH ORDER SERVICE =================

  // const syncToggleWithOrders = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8888/api/orders");
  //     const orders = await res.json();

  //     const map = {};

  //     orders.forEach(order => {
  //       order.cart.forEach(item => {
  //         map[item.product_id] = true;
  //       });
  //     });

  //     setSelectedProducts(map);

  //   } catch (err) {
  //     console.error("Failed to sync orders", err);
  //   }
  // };

  useEffect(() => {
    document.title = "SUSARA Clothing | Products";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
    loadSuppliers();
    // syncToggleWithOrders();
  }, []);

  // ================= DELETE PRODUCT =================

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    await api.delete(`/products/${id}`);
    loadProducts();

  };

  // ================= TOGGLE =================

  // const toggleOrder = async (productId) => {

  //   const isSelected = selectedProducts[productId];

  //   try {

  //     await api.post("/products/send-products", {
  //       productId,
  //       action: isSelected ? "remove" : "add"
  //     });

  //     setSelectedProducts(prev => ({
  //       ...prev,
  //       [productId]: !isSelected
  //     }));

  //     toast.success(
  //       isSelected
  //         ? "Product removed from order"
  //         : "Product sent to order"
  //     );

  //   // eslint-disable-next-line no-unused-vars
  //   } catch (error) {
  //     toast.error("Failed to update order");
  //   }

  // };

  // ================= GROUP PRODUCTS =================

  const groupedProducts = products.reduce((acc, product) => {

    if (!acc[product.supplierName]) {
      acc[product.supplierName] = [];
    }

    acc[product.supplierName].push(product);

    return acc;

  }, {});

  // ================= UI =================

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
          <FiPackage />
          <span className="text-green-600"> SUSARA Clothing</span> - Product Management
        </h1>

        {Object.keys(groupedProducts).map((supplier) => {

          const supplierData = suppliers.find(
            (s) => s.supplierName === supplier
          );

          return (

            <div key={supplier} className="mb-12">

              {/* Supplier Header */}
              <div className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6">

                <div className="flex items-center gap-4">

                  {supplierData?.supplierImage && (
                    <img
                      src={`http://localhost:8888/uploads/suppliers/${supplierData.supplierImage}`}
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                  )}

                  <h2 className="text-xl font-semibold text-gray-800">
                    {supplier}
                  </h2>

                </div>

                <p className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  Product count: <span className="font-bold">{groupedProducts[supplier].length}</span>
                </p>

              </div>

              {/* Product Grid */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

                {groupedProducts[supplier].map((product) => (

                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden"
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

                    {/* Content */}
                    <div className="p-4 space-y-2">

                      <h3 className="text-lg font-semibold">
                        {product.productName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Type: {product.productType}
                      </p>

                      <p className="text-sm text-gray-500">
                        Size: {product.productSize}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {product.productQuantity}
                      </p>

                      <p className="text-green-600 font-bold text-xl">
                        Rs {product.productPrice}.00
                      </p>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-2">

                        <button
                          onClick={() => navigate(`/edit-product/${product._id}`)}
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                        >
                          <FiEdit size={16}/>
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          <FiTrash2 size={16}/>
                        </button>

                      </div>

                      {/* Toggle
                      <div className="flex items-center justify-between mt-3">

                        <span className="text-xs text-gray-500">
                          Send to Order
                        </span>

                        <button
                          onClick={() => toggleOrder(product._id)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300
                            ${selectedProducts[product._id] ? "bg-green-500" : "bg-gray-300"}
                          `}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300
                              ${selectedProducts[product._id] ? "translate-x-6" : ""}
                            `}
                          />
                        </button>

                      </div> */}

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

export default Products;
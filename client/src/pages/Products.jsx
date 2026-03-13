import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiPackage } from "react-icons/fi";

function Products() {

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
    loadSuppliers();
  }, []);

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    await api.delete(`/products/${id}`);

    loadProducts();
  };

  // Group products by supplier
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

        <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
          <FiPackage />
          Product Inventory
        </h1>

        {Object.keys(groupedProducts).map((supplier) => {

          const supplierData = suppliers.find(
            (s) => s.supplierName === supplier
          );

          return (

            <div key={supplier} className="mb-12">

              {/* Supplier Header */}

                <div className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6">

                  {/* Left Side */}
                  <div className="flex items-center gap-4">

                    {supplierData?.supplierImage && (
                      <img
                        src={`http://localhost:5000/uploads/suppliers/${supplierData.supplierImage}`}
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                    )}

                    <h2 className="text-xl font-semibold text-gray-800">
                      {supplier}
                    </h2>

                  </div>

                  {/* Right Side */}
                  <p className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                    Product Supplier count: <span className="font-bold">{groupedProducts[supplier].length}</span>
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
                        src={`http://localhost:5000/uploads/products/${product.productImage}`}
                        className="h-48 w-full object-cover"
                      />

                      {product.productQuantity > 0 ? (

                        <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                          In Stock
                        </span>

                      ) : (

                        <span className="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
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
                        Rs {product.productPrice}
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
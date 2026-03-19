import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  FiBox,
  FiTag,
  FiDollarSign,
  FiUpload,
  FiUser,
  FiX
} from "react-icons/fi";
import toast from "react-hot-toast";

function AddProduct() {

  const navigate = useNavigate();

  const [productName,setProductName] = useState("");
  const [supplierName,setSupplierName] = useState("");
  const [productType,setProductType] = useState("");
  const [productSize,setProductSize] = useState("M");
  const [productQuantity,setProductQuantity] = useState(0);
  const [productPrice,setProductPrice] = useState(0);

  const [productImage,setProductImage] = useState(null);
  const [preview,setPreview] = useState(null);
  const [dragActive,setDragActive] = useState(false);
  const [uploadProgress,setUploadProgress] = useState(0);

  const [suppliers,setSuppliers] = useState([]);
  const [loading,setLoading] = useState(false);
  const [errors,setErrors] = useState({});

  useEffect(()=>{

    document.title = "SUSARA Clothing | Add Product";

    const loadSuppliers = async ()=>{

      const res = await api.get("/suppliers");
      setSuppliers(res.data);

    };

    loadSuppliers();

  },[]);

  const validateForm = () => {

    let newErrors = {};

    if(!productName) newErrors.productName = "Product name required";
    if(!supplierName) newErrors.supplierName = "Supplier required";
    if(!productType) newErrors.productType = "Product type required";
    if(productPrice <= 0) newErrors.productPrice = "Invalid price";
    if(productQuantity < 0) newErrors.productQuantity = "Invalid quantity";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if(file){
      setProductImage(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  const removeImage = () => {

    setProductImage(null);
    setPreview(null);
    setUploadProgress(0);

  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {

    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if(file){
      setProductImage(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  const handleSubmit = async (e)=>{

    e.preventDefault();

    if(!validateForm()) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("productName",productName);
    formData.append("supplierName",supplierName);
    formData.append("productType",productType);
    formData.append("productSize",productSize);
    formData.append("productQuantity",productQuantity);
    formData.append("productPrice",productPrice);

    if(productImage){
      formData.append("productImage",productImage);
    }

    await api.post("/products",formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      },
      onUploadProgress:(progressEvent)=>{

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        setUploadProgress(percent);

      }
    });

    setLoading(false);

    toast.success("Product Added Successfully!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    navigate("/products");

  };

  const inputStyle =
  "w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10 pb-10">

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-green-600 to-indigo-600 text-white p-6">

          <h2 className="text-2xl font-bold">
            Add New Product
          </h2>

          <p className="text-sm opacity-80">
            Enter product details below
          </p>

        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Product Name */}
          <label className="text-sm font-semibold block mb-2">
            Product Name
          </label>

          <div className="relative">

            <FiBox className="absolute left-3 top-4 text-gray-400"/>

            <input
              type="text"
              placeholder="Product Name"
              className={inputStyle}
              onChange={(e)=>setProductName(e.target.value)}
            />

            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productName}
              </p>
            )}

          </div>

          {/* Supplier */}
          <label className="text-sm font-semibold block mb-2">
            Product Supplier
          </label>

          <div className="relative">

            <FiUser className="absolute left-3 top-4 text-gray-400"/>

            <select
              className={inputStyle}
              onChange={(e)=>setSupplierName(e.target.value)}
            >

              <option value="">Select Supplier</option>

              {suppliers.map((supplier)=>(
                <option key={supplier._id} value={supplier.supplierName}>
                  {supplier.supplierName}
                </option>
              ))}

            </select>

            {errors.supplierName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.supplierName}
              </p>
            )}

          </div>

          {/* Product Type */}
          <label className="text-sm font-semibold block mb-2">
            Product Type
          </label>

          <div className="relative">

            <FiTag className="absolute left-3 top-4 text-gray-400"/>

            <input
              type="text"
              placeholder="Product Type"
              className={inputStyle}
              onChange={(e)=>setProductType(e.target.value)}
            />

          </div>

          {/* Size & Quantity */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-semibold block mb-2">
                Product Size
              </label>

              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e)=>setProductSize(e.target.value)}
              >
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">XL</option>
              </select>
            </div>

             <div>

              <label className="block text-sm font-semibold block mb-2">
                Product Quantity
              </label>

              <input
                type="number"
                placeholder="Quantity"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e)=>setProductQuantity(Number(e.target.value))}
              />
            </div>

          </div>

          {/* Price */}
          <label className="text-sm font-semibold block mb-2">
            Product Price
          </label>

          <div className="relative">

            <FiDollarSign className="absolute left-3 top-4 text-gray-400"/>

            <input
              type="number"
              placeholder="Price"
              className={inputStyle}
              onChange={(e)=>setProductPrice(Number(e.target.value))}
            />

          </div>

          {/* Image Upload */}

          <div>

            <label className="text-sm font-semibold block mb-2">
              Product Image
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition
              ${dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-500 hover:bg-gray-50"}
              `}
            >

              {!preview && (

                <>
                  <FiUpload className="text-3xl text-gray-400 mb-2"/>

                  <p className="text-gray-600 font-medium">
                    Drag & Drop or Click to Upload
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG or JPEG
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="imageUpload"
                    onChange={handleImageChange}
                  />

                  <label htmlFor="imageUpload" className="cursor-pointer mt-2 text-green-600 font-medium">
                    Browse Files
                  </label>
                </>
              )}

              {preview && (

                <div className="relative">

                  <img
                    src={preview}
                    className="w-40 h-40 object-cover rounded-lg border shadow"
                  />

                  {/* Remove Button */}

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={16}/>
                  </button>

                </div>

              )}

            </div>

            {/* Upload Progress */}

            {loading && (

              <div className="mt-4">

                <div className="w-full bg-gray-200 rounded-full h-2">

                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{width:`${uploadProgress}%`}}
                  />

                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Uploading image...
                </p>

              </div>

            )}

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center gap-2"
          >

            {loading ? (

              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Product...
              </>

            ) : (

              "Add Product"

            )}

          </button>

        </form>

      </div>

    </div>
  );

}

export default AddProduct;
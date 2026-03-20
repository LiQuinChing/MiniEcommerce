import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
  FiBox,
  FiTag,
  FiDollarSign,
  FiUpload,
  FiUser,
  FiX
} from "react-icons/fi";
import toast from "react-hot-toast";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product,setProduct] = useState({});
  const [suppliers,setSuppliers] = useState([]);
  const [productImage,setProductImage] = useState(null);
  const [preview,setPreview] = useState(null);

  const [uploadProgress,setUploadProgress] = useState(0);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{

    document.title = "SUSARA Clothing | Update Product";

    const loadData = async()=>{

      const productRes = await api.get("/products");
      const found = productRes.data.find((p)=>p._id === id);

      setProduct(found);

      if(found?.productImage){
        setPreview(`http://localhost:5000/uploads/products/${found.productImage}`);
      }

      const supplierRes = await api.get("/suppliers");
      setSuppliers(supplierRes.data);

    };

    loadData();

  },[id]);

  const handleImageChange = (e)=>{

    const file = e.target.files[0];

    if(file){

      setProductImage(file);

      setPreview(URL.createObjectURL(file));

    }

  };

  const removeImage = ()=>{

    setProductImage(null);
    setPreview(null);

  };

  const handleUpdate = async (e)=>{

    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("productName",product.productName);
    formData.append("supplierName",product.supplierName);
    formData.append("productType",product.productType);
    formData.append("productSize",product.productSize);
    formData.append("productQuantity",product.productQuantity);
    formData.append("productPrice",product.productPrice);

    if(productImage){
      formData.append("productImage",productImage);
    }

    if (!preview && !productImage) {
      formData.append("removeImage", "true");
    }

    await api.put(`/products/${id}`,formData,{
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

    toast.success("Product Updated Successfully!", {
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
            Update Product
          </h2>

          <p className="text-sm opacity-80">
            Modify product details
          </p>

        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5">

          {/* Product Name */}

          <label className="text-sm font-semibold block mb-2">
            Product Name
          </label>

          <div className="relative">

            <FiBox className="absolute left-3 top-4 text-gray-400"/>

            <input
              value={product.productName || ""}
              onChange={(e)=>setProduct({...product,productName:e.target.value})}
              className={inputStyle}
            />

          </div>

          {/* Supplier */}

          <label className="text-sm font-semibold block mb-2">
            Product Supplier
          </label>

          <div className="relative">

            <FiUser className="absolute left-3 top-4 text-gray-400"/>

            <select
              value={product.supplierName || ""}
              onChange={(e)=>setProduct({...product,supplierName:e.target.value})}
              className={inputStyle}
            >

              <option value="">Select Supplier</option>

              {suppliers.map((supplier)=>(
                <option key={supplier._id} value={supplier.supplierName}>
                  {supplier.supplierName}
                </option>
              ))}

            </select>

          </div>

          {/* Product Type */}

          <label className="text-sm font-semibold block mb-2">
            Product Type
          </label>

          <div className="relative">

            <FiTag className="absolute left-3 top-4 text-gray-400"/>

            <input
              value={product.productType || ""}
              onChange={(e)=>setProduct({...product,productType:e.target.value})}
              className={inputStyle}
            />

          </div>

          {/* Size + Quantity */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm font-semibold block mb-2">
                Product Size
              </label>

              <select
                value={product.productSize || ""}
                onChange={(e)=>setProduct({...product,productSize:e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              >

                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">XL</option>

              </select>

            </div>

            <div>

              <label className="text-sm font-semibold block mb-2">
                Product Quantity
              </label>

              <input
                type="number"
                value={product.productQuantity || 0}
                onChange={(e)=>setProduct({...product,productQuantity:e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
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
              value={product.productPrice || 0}
              onChange={(e)=>setProduct({...product,productPrice:e.target.value})}
              className={inputStyle}
            />

          </div>

          {/* Image Upload */}

          <label className="text-sm font-semibold block mb-2">
            Product Image
          </label>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 transition">

            {!preview && (

              <>
                <FiUpload className="text-3xl text-gray-400 mb-2"/>
                <p className="text-gray-600">Click to Upload</p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="imageUpload"
                  onChange={handleImageChange}
                />

                <label htmlFor="imageUpload" className="cursor-pointer text-green-600 mt-2">
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

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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
                  className="bg-green-500 h-2 rounded-full"
                  style={{width:`${uploadProgress}%`}}
                />

              </div>

              <p className="text-sm text-gray-500 mt-1">
                Uploading image...
              </p>

            </div>

          )}

          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2"
          >

            {loading ? (

              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Product...
              </>

            ) : (

              "Update Product"

            )}

          </button>

        </form>

      </div>

    </div>

  );

}

export default EditProduct;
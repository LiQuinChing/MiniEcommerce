import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMapPin,
  FiTag,
  FiClock,
  FiUpload,
  FiX
} from "react-icons/fi";
import toast from "react-hot-toast";

function AddSupplier() {

  const navigate = useNavigate();

  const [supplierName,setSupplierName] = useState("");
  const [address,setAddress] = useState("");
  const [type,setType] = useState("");
  const [openTime,setOpenTime] = useState("");
  const [closeTime,setCloseTime] = useState("");

  const [supplierImage,setSupplierImage] = useState(null);
  const [preview,setPreview] = useState(null);
  const [dragActive,setDragActive] = useState(false);
  const [uploadProgress,setUploadProgress] = useState(0);

  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    document.title = "SUSARA Clothing | Add Supplier";
  },[]);

  const handleImageChange = (e)=>{

    const file = e.target.files[0];

    if(file){
      setSupplierImage(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  const removeImage = ()=>{

    setSupplierImage(null);
    setPreview(null);
    setUploadProgress(0);

  };

  const handleDragOver = (e)=>{
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = ()=>{
    setDragActive(false);
  };

  const handleDrop = (e)=>{

    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if(file){
      setSupplierImage(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  const handleSubmit = async (e)=>{

    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("supplierName",supplierName);
    formData.append("address",address);
    formData.append("type",type);
    formData.append("openTime",openTime);
    formData.append("closeTime",closeTime);

    if(supplierImage){
      formData.append("supplierImage",supplierImage);
    }

    await api.post("/suppliers",formData,{
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

    toast.success("Supplier Added Successfully!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    navigate("/suppliers");

  };

  const inputStyle =
  "w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-green-500 outline-none";

  return(

    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10 pb-10">

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-green-600 to-indigo-600 text-white p-6">

          <h2 className="text-2xl font-bold">
            Add New Supplier
          </h2>

          <p className="text-sm opacity-80">
            Enter supplier details below
          </p>

        </div>



        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Supplier Name */}

          <label className="text-sm font-semibold block mb-2">
            Supplier Name
          </label>

          <div className="relative">

            <FiUser className="absolute left-3 top-4 text-gray-400"/>

            <input
              type="text"
              placeholder="Supplier Name"
              className={inputStyle}
              onChange={(e)=>setSupplierName(e.target.value)}
            />

          </div>



          {/* Address */}

          <label className="text-sm font-semibold block mb-2">
            Address
          </label>

          <div className="relative">

            <FiMapPin className="absolute left-3 top-4 text-gray-400"/>

            <input
              type="text"
              placeholder="Supplier Address"
              className={inputStyle}
              onChange={(e)=>setAddress(e.target.value)}
            />

          </div>



          {/* Supplier Type */}

          <label className="text-sm font-semibold block mb-2">
            Supplier Type
          </label>

          <div className="relative">

            <FiTag className="absolute left-3 top-4 text-gray-400"/>

            <input
              type="text"
              placeholder="Supplier Type"
              className={inputStyle}
              onChange={(e)=>setType(e.target.value)}
            />

          </div>



          {/* Open Close Time */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm font-semibold block mb-2">
                Open Time
              </label>

              <div className="relative">

                <FiClock className="absolute left-3 top-4 text-gray-400"/>

                <input
                  type="time"
                  className={inputStyle}
                  onChange={(e)=>setOpenTime(e.target.value)}
                />

              </div>

            </div>



            <div>

              <label className="text-sm font-semibold block mb-2">
                Close Time
              </label>

              <div className="relative">

                <FiClock className="absolute left-3 top-4 text-gray-400"/>

                <input
                  type="time"
                  className={inputStyle}
                  onChange={(e)=>setCloseTime(e.target.value)}
                />

              </div>

            </div>

          </div>



          {/* Image Upload */}

          <div>

            <label className="text-sm font-semibold block mb-2">
              Supplier Image
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

                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer mt-2 text-green-600 font-medium"
                  >
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



          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center gap-2"
          >

            {loading ? (

              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Supplier...
              </>

            ) : (

              "Add Supplier"

            )}

          </button>

        </form>

      </div>

    </div>

  );

}

export default AddSupplier;
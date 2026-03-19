import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiUpload,
  FiX
} from "react-icons/fi";
import toast from "react-hot-toast";

function EditSupplier() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier,setSupplier] = useState({});
  const [supplierImage,setSupplierImage] = useState(null);
  const [preview,setPreview] = useState(null);

  const [uploadProgress,setUploadProgress] = useState(0);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{

    document.title = "SUSARA Clothing | Add Supplier";

    const loadSupplier = async ()=>{

      const res = await api.get("/suppliers");

      const found = res.data.find((s)=>s._id === id);

      setSupplier(found);

      if(found?.supplierImage){
        setPreview(`http://localhost:5000/uploads/suppliers/${found.supplierImage}`);
      }

    };

    loadSupplier();

  },[id]);



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

  };



  const handleUpdate = async (e)=>{

    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("supplierName",supplier.supplierName);
    formData.append("address",supplier.address);
    formData.append("type",supplier.type);
    formData.append("openTime",supplier.openTime);
    formData.append("closeTime",supplier.closeTime);

    if(supplierImage){
      formData.append("supplierImage",supplierImage);
    }

    if(!preview){
      formData.append("removeImage","true");
    }

    await api.put(`/suppliers/${id}`,formData,{
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

    toast.success("Supplier Updated Successfully!", {
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
            Update Supplier
          </h2>

          <p className="text-sm opacity-80">
            Modify supplier details
          </p>

        </div>


        <form onSubmit={handleUpdate} className="p-6 space-y-5">


          {/* Supplier Name */}

          <label className="text-sm font-semibold block mb-2">
            Supplier Name
          </label>

          <div className="relative">

            <FiUser className="absolute left-3 top-4 text-gray-400"/>

            <input
              value={supplier.supplierName || ""}
              onChange={(e)=>setSupplier({...supplier,supplierName:e.target.value})}
              className={inputStyle}
            />

          </div>


          {/* Address */}

          <label className="text-sm font-semibold block mb-2">
            Address
          </label>

          <div className="relative">

            <FiMapPin className="absolute left-3 top-4 text-gray-400"/>

            <input
              value={supplier.address || ""}
              onChange={(e)=>setSupplier({...supplier,address:e.target.value})}
              className={inputStyle}
            />

          </div>


          {/* Type */}

          <label className="text-sm font-semibold block mb-2">
            Supplier Type
          </label>

          <div className="relative">

            <FiUser className="absolute left-3 top-4 text-gray-400"/>

            <input
              value={supplier.type || ""}
              onChange={(e)=>setSupplier({...supplier,type:e.target.value})}
              className={inputStyle}
            />

          </div>


          {/* Open & Close Time */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm font-semibold block mb-2">
                Open Time
              </label>

              <div className="relative">

                <FiClock className="absolute left-3 top-4 text-gray-400"/>

                <input
                  type="time"
                  value={supplier.openTime || ""}
                  onChange={(e)=>setSupplier({...supplier,openTime:e.target.value})}
                  className={inputStyle}
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
                  value={supplier.closeTime || ""}
                  onChange={(e)=>setSupplier({...supplier,closeTime:e.target.value})}
                  className={inputStyle}
                />

              </div>

            </div>

          </div>



          {/* Image Upload */}

          <label className="text-sm font-semibold block mb-2">
            Supplier Image
          </label>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 transition">

            {!preview && (

              <>

                <FiUpload className="text-3xl text-gray-400 mb-2"/>

                <p className="text-gray-600">
                  Click to Upload
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
                  className="cursor-pointer text-green-600 mt-2"
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



          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2"
          >

            {loading ? (

              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Supplier...
              </>

            ) : (

              "Update Supplier"

            )}

          </button>


        </form>

      </div>

    </div>

  );

}

export default EditSupplier;
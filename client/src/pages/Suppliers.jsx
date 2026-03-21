import { useEffect,useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiUsers } from "react-icons/fi";

function Suppliers(){

  const [suppliers,setSuppliers] = useState([]);
  const navigate = useNavigate();

  const loadSuppliers = async () => {

    const res = await api.get("/suppliers");

    setSuppliers(res.data);

  };

  useEffect(()=>{
    document.title = "SUSARA Clothing | Suppliers";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSuppliers();
  },[]);

  const deleteSupplier = async (id) => {

    if(!window.confirm("Delete this supplier?")) return;

    await api.delete(`/suppliers/${id}`);

    loadSuppliers();

  };

  const getSupplierStatus = (openTime, closeTime) => {

    if (!openTime || !closeTime) return "Closed";

    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
      ? "Open"
      : "Closed";

  };

  return(

    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="max-w-7xl mx-auto">

        {/* Page Title */}

        <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
          <FiUsers />
          <span className="text-green-600"> SUSARA Clothing</span> - Supplier Management
        </h1>


        {/* Supplier Count */}

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm flex justify-between items-center">

          <p className="text-gray-700 font-medium">
            Total Suppliers
          </p>

          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
            {suppliers.length}
          </span>

        </div>


        {/* Supplier Grid */}

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

          {suppliers.map((supplier)=>(

            <div
              key={supplier._id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden"
            >

              {/* Supplier Image */}

              <div className="relative">

                <img
                  src={`http://localhost:8888/uploads/suppliers/${supplier.supplierImage}`}
                  className="h-48 w-full object-cover"
                />

                {getSupplierStatus(supplier.openTime, supplier.closeTime) === "Open" ? (

                  <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Open Now
                  </span>

                ) : (

                  <span className="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Closed
                  </span>

                )}

              </div>

              {/* Supplier Content */}

              <div className="p-4 space-y-2">

                <div className="flex items-center gap-3 mb-2">

                  {supplier.supplierImage && (

                    <img
                      src={`http://localhost:8888/uploads/suppliers/${supplier.supplierImage}`}
                      className="w-10 h-10 rounded-full object-cover border"
                    />

                  )}

                  <h2 className="text-lg font-semibold">
                    {supplier.supplierName}
                  </h2>

                </div>

                <p className="text-sm text-gray-500">
                  Address: {supplier.address}
                </p>

                <p className="text-sm text-gray-500">
                  Type: {supplier.type}
                </p>

                <div className="flex justify-left flex-wrap pt-2">

                  <span className="bg-green-100 text-green-700 text-xs font-medium font-semibold px-3 py-1 rounded-full">
                    Open: {supplier.openTime}
                  </span>
                  
                </div>

                <div className="flex justify-left flex-wrap pb-2">

                  <span className="bg-red-100 text-red-700 text-xs font-medium font-semibold px-3 py-1 rounded-full">
                    Close: {supplier.closeTime}
                  </span>

                </div>


                {/* Buttons */}

                <div className="flex gap-2 pt-2">

                  <button
                    onClick={()=>navigate(`/edit-supplier/${supplier._id}`)}
                    className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                  >
                    <FiEdit size={16}/>
                  </button>

                  <button
                    onClick={()=>deleteSupplier(supplier._id)}
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

    </div>

  );

}

export default Suppliers;
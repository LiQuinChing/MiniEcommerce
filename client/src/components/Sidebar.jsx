import { NavLink } from "react-router-dom";
import {
  FiUser,
  FiHome,
  FiPackage,
  FiUsers,
  FiPlusSquare,
  FiShoppingBag,
  FiMenu,
  FiShoppingCart,
  FiLogOut
} from "react-icons/fi";
import { useState } from "react";

function Sidebar() {

  const [open, setOpen] = useState(false);

  const menuItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-gray-700";

  const activeItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600";

  const handleLogout = () => {

    localStorage.removeItem("token");
    window.location.href = "/login";

  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow"
        >
          <FiMenu size={20} />
        </button>
      )}

      <aside
        className={`
        fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-40
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        `}
      >

        {/* Header */}

        <div className="px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <FiUser size={18} />
            </div>

            <div className="flex flex-col gap-1">

              <h1 className="text-sm font-semibold text-white">
                SUSARA Clothing
              </h1>

              <span className="text-xs text-gray-400">
                Welcome back, Admin 👋
              </span>

            </div>

          </div>

          <div className="mt-4 h-px bg-gray-800"></div>

        </div>

        {/* Menu */}

        <div className="overflow-y-auto h-[calc(100vh-80px)] px-4">

          <nav className="space-y-2">

            <NavLink to="/" className={({ isActive }) => isActive ? activeItem : menuItem}>
              <FiHome />
              Dashboard
            </NavLink>

            <NavLink to="/products" className={({ isActive }) => isActive ? activeItem : menuItem}>
              <FiPackage />
              Products
            </NavLink>

            <NavLink to="/suppliers" className={({ isActive }) => isActive ? activeItem : menuItem}>
              <FiUsers />
              Suppliers
            </NavLink>

            <NavLink to="/add-product" className={({ isActive }) => isActive ? activeItem : menuItem}>
              <FiShoppingBag />
              Add Product
            </NavLink>

            <NavLink to="/add-supplier" className={({ isActive }) => isActive ? activeItem : menuItem}>
              <FiPlusSquare />
              Add Supplier
            </NavLink>

            <NavLink to="/orders" className={({ isActive }) => isActive ? activeItem : menuItem}>
              <FiShoppingCart />
              Orders
            </NavLink>

          </nav>

        </div>

        {/* Logout */}

        <div className="absolute bottom-0 left-0 w-full px-4 py-4 border-t border-gray-800">

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;
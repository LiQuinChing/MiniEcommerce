import { FiBell, FiSearch, FiUser } from "react-icons/fi";

function Navbar() {

  return (

    <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      {/* Search */}

      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-96">

        <FiSearch className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm"
        />

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <button className="relative">

          <FiBell size={20} className="text-gray-600" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>

        </button>

        {/* Profile */}

        <div className="flex items-center gap-2 cursor-pointer">

          <div className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center">
            <FiUser />
          </div>

        </div>

      </div>

    </div>

  );

}

export default Navbar;
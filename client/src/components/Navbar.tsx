import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Product Management</h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-400">
          Products
        </Link>

        <Link to="/add-product" className="hover:text-yellow-400">
          Add Product
        </Link>

        <Link to="/suppliers" className="hover:text-yellow-400">
            Suppliers
        </Link>

        <Link to="/add-supplier" className="hover:text-yellow-400">
            Add Supplier
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
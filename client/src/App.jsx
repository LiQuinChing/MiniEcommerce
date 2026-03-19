import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Products from "./pages/Products";
import AddProducts from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminFooter from "./components/AdminFooter";

import AddSupplier from './pages/AddSupplier';
import Suppliers from './pages/Suppliers';
import EditSupplier from './pages/EditSupplier';

import OrderPage from "./pages/OrderPage";

function App() {

  return (

    <>
      <Toaster position="bottom-left" reverseOrder={false} />

        <BrowserRouter>

        <div className="flex">

          <Sidebar />

          <div className="flex-1 ml-64 flex flex-col min-h-screen">

            <Navbar />

            <main className="flex-1">

              <Routes>

                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProducts />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />

                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/add-supplier" element={<AddSupplier />} />
                <Route path="/edit-supplier/:id" element={<EditSupplier />} />

                <Route path="/orders" element={<OrderPage />} />

              </Routes>

            </main>

            <AdminFooter />

          </div>

        </div>

      </BrowserRouter>

    </>

  );

}

export default App;
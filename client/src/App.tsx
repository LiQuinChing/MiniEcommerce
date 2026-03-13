import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import AddProducts from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Navbar from "./components/Navbar";
import AddSupplier from './pages/AddSupplier';
import Suppliers from './pages/Suppliers';
import EditSupplier from './pages/EditSupplier';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/add-product" element={<AddProducts />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />

          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/add-supplier" element={<AddSupplier />} />
          <Route path="/edit-supplier/:id" element={<EditSupplier />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Products from "./pages/Products";
import AddProducts from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import Sidebar from "./components/Sidebar";
import AdminFooter from "./components/AdminFooter";

import AddSupplier from './pages/AddSupplier';
import Suppliers from './pages/Suppliers';
import EditSupplier from './pages/EditSupplier';

import OrderProducts from './pages/OrderProducts';

import OrderPage from "./pages/OrderPage";

function App() {

  return (

    <>
      <Toaster position="bottom-left" reverseOrder={false} />

        <BrowserRouter>

        <div className="flex">

          <Sidebar />

          <div className="flex-1 ml-64 flex flex-col min-h-screen">

            <main className="flex-1">

              <Routes>

                <Route path="/products" element={<Products />} />
                <Route path="/add-product" element={<AddProducts />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />

                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/add-supplier" element={<AddSupplier />} />
                <Route path="/edit-supplier/:id" element={<EditSupplier />} />

                <Route path="/order-products" element={<OrderProducts />} />

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
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PaymentPage from './pages/PaymentPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ManageCustomersPage from './pages/ManageCustomersPage';
import OrderPage from "./pages/OrderPage";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return role === 'ADMIN' ? <>{children}</> : <Navigate to="/profile" replace />;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes*/}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
        {/* Order route - needs a login */}
        <Route path="/orders" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />

      {/* Admin Routes */}
        <Route path="/customers" element={<AdminRoute><ManageCustomersPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

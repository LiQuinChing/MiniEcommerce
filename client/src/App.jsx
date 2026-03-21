import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./AuthContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AdminFooter from "./components/AdminFooter";
import CustomerFooter from "./components/CustomerFooter";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import ManageCustomersPage from "./pages/ManageCustomersPage";

import Products from "./pages/Products";
import AddProducts from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

import Suppliers from "./pages/Suppliers";
import AddSupplier from "./pages/AddSupplier";
import EditSupplier from "./pages/EditSupplier";

import OrderProducts from "./pages/OrderProducts";
import OrderPage from "./pages/OrderPage";

// 🔐 Protected Route
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// 🔐 Admin Route
function AdminRoute({ children }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return role === "ADMIN" ? children : <Navigate to="/profile" replace />;
}

// 👤 User Route (optional but cleaner)
function UserRoute({ children }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return role === "CUSTOMER" ? children : <Navigate to="/" replace />;
}

// // 🧱 Admin Layout
// function AdminLayout({ children }) {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 ml-64 flex flex-col min-h-screen">
//         <main className="flex-1">{children}</main>
//         <AdminFooter />
//       </div>
//     </div>
//   );
// }

function Layout({ children }) {
  const { role, token } = useAuth();

  // Not logged in → show normal Navbar
  if (!token) {
    return (
      <>
        <Navbar />
          {children}
        <Footer/>
      </>
    );
  }

  // Admin → Sidebar layout ONLY
  if (role === "ADMIN") {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
          <AdminFooter />
        </div>
      </div>
    );
  }

  // Customer → Navbar and customer footer only
  return (
    <>
      <Navbar />
        {children}
      <CustomerFooter/>
    </>
  );
}

// 🌐 App Routes
function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="bottom-left" reverseOrder={false} />

      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* USER */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <UserRoute>
                <PaymentPage />
              </UserRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <UserRoute>
                <PaymentHistoryPage />
              </UserRoute>
            }
          />
          <Route
            path="/order-products"
            element={
              <UserRoute>
                <OrderProducts />
              </UserRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <UserRoute>
                <OrderPage />
              </UserRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/customers"
            element={
              <AdminRoute>
                <ManageCustomersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/products"
            element={
              <AdminRoute>
                <Products />
              </AdminRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <AdminRoute>
                <AddProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <AdminRoute>
                <Suppliers />
              </AdminRoute>
            }
          />
          <Route
            path="/add-supplier"
            element={
              <AdminRoute>
                <AddSupplier />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-supplier/:id"
            element={
              <AdminRoute>
                <EditSupplier />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}

// 🚀 Main App
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

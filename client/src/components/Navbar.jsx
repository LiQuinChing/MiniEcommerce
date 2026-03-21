import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserById } from '../api';
import { useAuth } from '../AuthContext';
import { FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { email, role, token, userId, logout } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    let isActive = true;

    if (!email || !userId) {
      setDisplayName('');
      return () => {
        isActive = false;
      };
    }

    getUserById(userId, token)
      .then((user) => {
        if (!isActive) {
          return;
        }
        const firstPiece = user?.name?.trim()?.split(/\s+/)?.[0] ?? '';
        setDisplayName(firstPiece);
      })
      .catch(() => {
        if (isActive) {
          setDisplayName('');
        }
      });

    return () => {
      isActive = false;
    };
  }, [email, token, userId]);

  function handleLogout() {
    logout();
    toast.success("Logged out Successfully!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    navigate('/login');
  }

  return (
    <nav className="bg-gray-800 text-white shadow-md font-bold">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-extrabold tracking-tight hover:text-green-200 transition-colors">
          SUSARA Clothing
        </NavLink>

        <div className="flex items-center gap-5 text-sm font-medium tracking-wide">
          {email ? (
            <>
                <NavLink to="/" className={({ isActive }) =>
                    isActive
                      ? "font-bold text-green-300"
                      : "font-medium hover:text-green-200"
                  }>
                  Dashboard
                </NavLink>
                <NavLink to="/order-products" className={({ isActive }) =>
                    isActive
                      ? "font-bold text-green-300"
                      : "font-medium hover:text-green-200"
                  }>
                  Available Products
                </NavLink>
              {role !== 'ADMIN' && (
                <NavLink to="/payment" className={({ isActive }) =>
                    isActive
                      ? "font-bold text-green-300"
                      : "font-medium hover:text-green-200"
                  }>
                  Make Payment
                </NavLink>
              )}
              <NavLink to="/payments" className={({ isActive }) =>
                  isActive
                    ? "font-bold text-green-300"
                    : "font-medium hover:text-green-200"
                }>
                {role === 'ADMIN' ? 'Payment History' : 'My Payments'}
              </NavLink>
              {role === 'ADMIN' && (
                <NavLink to="/customers" className={({ isActive }) =>
                    isActive
                      ? "font-bold text-green-300"
                      : "font-medium hover:text-green-200"
                  }>
                  Manage Customers
                </NavLink>
              )}
              {role === 'ADMIN' && (
                <NavLink to="/orders" className={({ isActive }) =>
                    isActive
                      ? "font-bold text-green-300"
                      : "font-medium hover:text-green-200"
                  }>
                  Manage Orders
                </NavLink>
              )}
              <NavLink to="/profile" className={({ isActive }) =>
                  isActive
                    ? "font-bold text-green-300"
                    : "font-medium hover:text-green-200"
                }>
                Profile
              </NavLink>
              <div className="hidden sm:flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-full cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                  {(displayName || email)?.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm text-white font-medium">
                  {displayName || email}
                </span>
              </div>
              {/* <span className="text-indigo-300 text-xs hidden sm:block">{displayName || email}</span> */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-md transition-colors flex gap-3 font-bold cursor-pointer"
              >
                <FiLogOut strokeWidth={3} className="w-5 h-5"/> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-green-200 transition-colors font-bold">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-md transition-colors font-bold"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiInstagram,
  FiTwitter
} from "react-icons/fi";
import { Link } from "react-router-dom";

function Footer() {

  return (

    <footer className="bg-gray-900 text-gray-300">

      <div className="max-w-7xl mx-auto px-10 py-10 grid md:grid-cols-4 gap-12 items-start text-left">

        {/* Brand */}

        <div>
          <h3 className="text-xl font-bold text-white mb-3">
            SUSARA Clothing
          </h3>

          <p className="text-sm text-gray-400">
            Quality products delivered to your doorstep with secure payments
            and reliable service.
          </p>
        </div>

        {/* Contact */}

        <div>
          <h4 className="font-semibold text-white mb-3">
            Contact
          </h4>

          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-3">
              <FiMapPin className="text-gray-400 flex-shrink-0" />
              <span>Colombo, Sri Lanka</span>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="text-gray-400 flex-shrink-0" />
              <span>+94 77 123 4567</span>
            </div>

            <div className="flex items-center gap-3">
              <FiMail className="text-gray-400 flex-shrink-0" />
              <span>support@susara.lk</span>
            </div>

          </div>
        </div>

        {/* Quick Links */}

        <div>
          <h4 className="font-semibold text-white mb-3">
            Quick Links
          </h4>

          <ul className="space-y-2 text-sm">

            <li>
              <Link to="/login" className="hover:text-green-400 transition">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register" className="hover:text-green-400 transition">
                Sign Up
              </Link>
            </li>

          </ul>
        </div>

        {/* Social */}

        <div>
          <h4 className="font-semibold text-white mb-3">
            Follow Us
          </h4>

          <div className="flex gap-4 mt-2">

            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-500 transition">
              <FiFacebook />
            </a>

            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-500 transition">
              <FiInstagram />
            </a>

            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-500 transition">
              <FiTwitter />
            </a>

          </div>
        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-gray-700 text-center text-sm py-4 text-gray-400">
        © {new Date().getFullYear()} SUSARA Clothing. All rights reserved.
      </div>

    </footer>

  );
}

export default Footer;
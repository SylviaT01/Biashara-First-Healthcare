import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-black hover:text-gray-300">BFH</Link>
        <nav className="space-x-4">
          <Link to="/register-business" className="hover:text-gray-300">Register Business</Link>
          <Link to="/register-hospital" className="hover:text-gray-300">Register Hospital</Link>
          <Link to="/nearby-hospitals" className="hover:text-gray-300">Find Nearby Hospitals</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

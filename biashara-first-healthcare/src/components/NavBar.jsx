import React from "react";
import { Link } from "react-router-dom";
import logo from "../components/icons/biashara-first-healthcare-high-resolution-logo-white-transparent.png";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  return (
    <header className="bg-[#a5e79a] text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-semibold text-2xl text-gray-700">
          {/* <img src={logo} alt="BFH Logo" className="h-12 md:h-19" /> */}
          BFH
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-gray-900 ">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900 ">About</Link>
          <Link to="/register-business" className="hover:text-gray-600">Register Business</Link>
          <button className="hover:text-gray-600">Register Hospital</button>
          {/* <Link to="map-section" className="hover:text-gray-600">Find Nearby Hospitals</Link> */}
          
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

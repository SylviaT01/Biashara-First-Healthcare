import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import hospitallogo from "../components/icons/YuBuntu-Logo-WpT-p-500 (1).png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }; 

  return (
    <header className="bg-[#b7e5db] text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-semibold text-2xl text-gray-700">
          <img src={hospitallogo} alt="BFH Logo" className="h-4 md:h-19" />
        </Link>
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-gray-900 ">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900 ">About</Link>
          <Link to="/register-business" className="hover:text-gray-600">Register Business</Link>
          <button className="hover:text-gray-600">Register Hospital</button>
        </nav>
        {isOpen && (
          <nav className="absolute top-14 left-0 w-full bg-[#b7e5db] text-center md:hidden">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/register-business"
              className="block py-2 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              Register Business
            </Link>
            <button className="block w-full py-2 hover:bg-gray-100">
              Register Hospital
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;

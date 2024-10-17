import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import MapView from "./MapView";
import AOS from "aos";
import "aos/dist/aos.css";
import "./styles/button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital, faMapMarkerAlt, faHandsHelping, faNetworkWired } from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const slides = [
    {
      // url: "https://img.freepik.com/premium-photo/3d-icon-illustration-store-location_1032034-801.jpg?w=740",
      url: "https://img.freepik.com/free-photo/little-girls-consulting-map-their-familiar-trip_23-2149373954.jpg?t=st=1729162263~exp=1729165863~hmac=ee2f4b46ea864cb59df7208544d7aef2442e073550043735075208555960c406&w=360",
      heading: "Connect Businesses & Hospitals",
      description: "Our platform helps businesses and hospitals easily register, and allows businesses to locate nearby hospitals using our interactive map."
    },
    {
      url: "https://img.freepik.com/free-photo/location-symbol-city-low-angle_23-2149764142.jpg?t=st=1728995642~exp=1728999242~hmac=56774faacb5faee10e3ba9e06b3e005b37397b615ad31e514527c5ca3b7565fd&w=740",
      heading: "Locate Nearby Hospitals",
      description: "Easily find health facilities around your area using our interactive map."
    },
    {
      url: "https://img.freepik.com/free-photo/black-woman-running-flower-business-side-view_23-2149871124.jpg?t=st=1729001064~exp=1729004664~hmac=10e6d2c08ab74e1282078007a5e4be99cebad3bbd73148a6466fbe533b25a35f&w=740",
      heading: "Join Our Network",
      description: "Connect with nearby businesses and healthcare facilities to grow together."
    },
    {
      url: "https://img.freepik.com/free-photo/man-with-dreads-representing-rastafari-movement_23-2151532093.jpg?t=st=1729001189~exp=1729004789~hmac=765c2f013e29eb032989d06485e5328e53016842d9f6ecb667f939b84c451607&w=740",
      heading: "Helping Your Community",
      description: "Support local businesses and health facilities by registering on our platform."
    }
  ];
  useEffect(() => {
    AOS.init({ duration: 1000 });
    // Auto-slide every 3 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [slides.length]);
  const [coordinates, setCoordinates] = useState([0, 0]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="container h-[500px] mx-auto   shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row mt-10 border border-gray-100">
        <div className="flex-1 p-8 md:p-16 shadow-lg">
          <header className="flex justify-between items-center mb-4">
            <nav className="space-x-4">
              <Link to="/about" className="text-gray-500 hover:text-gray-700">About</Link>
              <ScrollLink to="map-section" smooth={true} duration={500} className="text-gray-500 hover:text-gray-700">
                Location
              </ScrollLink>
            </nav>
          </header>
          <div className="text-left">
            <h1 className="text-5xl font-bold text-gray-700">Welcome to <span className="text-red-300">Biashara First Healthcare</span></h1>
            <p className="text-lg text-gray-400 mt-2">Connecting Businesses and Hospitals for Better Health Access</p>
            <p className="text-gray-600 mt-6">
              Biashara First Healthcare offers an innovative platform that simplifies registration and connection between businesses and hospitals. Our interactive map enables businesses to easily find nearby healthcare providers, ensuring quick access to essential services. We streamline the process for businesses seeking partnerships and hospitals aiming to expand their reach.
            </p>
            <div className="mt-8 space-x-4">
              <Link to="/register-business" className="download-button text-gray-800 rounded-md">Register Your Business</Link>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Register Your Hospital</button>
            </div>
          </div>
        </div>
        <div className="flex-1 relative bg-green-200">
          <div
            className="absolute inset-0 transition-all duration-1000 opacity-70"
            style={{
              backgroundImage: `url(${slides[currentSlide].url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full text-gray-300" data-aos="fade-up">
            <h2 className="text-5xl font-bold mb-4">{slides[currentSlide].heading}</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">{slides[currentSlide].description}</p>
          </div>

          {/* Slider Controls */}
          <div className="absolute inset-x-0 bottom-10 flex justify-between items-center px-4">
            <button onClick={prevSlide} className="p-1 text-[#D6A9A8] rounded hover:bg-[#F0C2C1]" aria-label="Previous Slide">
              &#10094;
            </button>
            <button onClick={nextSlide} className="p-1  text-[#D6A9A8] rounded-full hover:bg-[#F0C2C1]" aria-label="Next Slide">
              &#10095;
            </button>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
              <FontAwesomeIcon icon={faHospital} className="text-4xl text-[#D6A9A8] mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Hospital Registration</h3>
              <p className="text-gray-600 mt-2">Easily register your hospital on our platform to reach more businesses and customers.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-[#D6A9A8] mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Location Services</h3>
              <p className="text-gray-600 mt-2">Use our map to find healthcare services around you.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
              <FontAwesomeIcon icon={faHandsHelping} className="text-4xl text-[#D6A9A8] mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Business Registration</h3>
              <p className="text-gray-600 mt-2">Register your business and connect with healthcare facilities to grow together.</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
              <FontAwesomeIcon icon={faNetworkWired} className="text-4xl text-[#D6A9A8] mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Network Expansion</h3>
              <p className="text-gray-600 mt-2">Expand your network by connecting with nearby businesses and hospitals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map-section" className=" bg-white">
        <div id="map-section" className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-700 mb-4">
            Find Nearby Hospitals
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Use our interactive map to locate nearby hospitals for small businesses.
          </p>
          <div className="h-96">
            <MapView setCoordinates={setCoordinates} canPlacePin={false} />
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Why Choose Us?
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            We make it easier for small businesses to locate health facilities, while helping health facilities to become easily accessible.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/about" className="px-6 py-3 bg-[#cf9897] text-white rounded-md hover:bg-[#e28d8c]">
              Learn More
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


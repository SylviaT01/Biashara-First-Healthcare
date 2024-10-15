import React from "react";
import { Link } from "react-router-dom";
import MapView from "./MapView";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hospital Locator</h1>
          <nav className="space-x-4">
            <Link to="/register-business" className="hover:text-gray-300">Register Business</Link>
            <Link to="/nearby-hospitals" className="hover:text-gray-300">Find Nearby Hospitals</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-blue-50 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Helping Businesses Find Nearby Hospitals
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Our platform helps businesses easily register and locate nearby hospitals by overlaying hospital data on a map.
            Use the interactive map below to find hospitals closest to your business location.
          </p>
          <Link to="/register-business" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500">
            Register Your Business
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Interactive Map
          </h3>
          <p className="text-center text-gray-600 mb-8">
            Use the map below to find nearby hospitals based on business location.
          </p>
          <div className="h-96">
            <MapView />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Hospital Locator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

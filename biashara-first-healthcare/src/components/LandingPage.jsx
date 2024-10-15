import React from "react";
import { Link } from "react-router-dom";
import MapView from "./MapView";


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-blue-50 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Helping Businesses and Hospitals Connect
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Our platform helps businesses and hospitals easily register, and allows businesses to locate nearby hospitals using our interactive map.
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

      
    </div>
  );
};

export default LandingPage;

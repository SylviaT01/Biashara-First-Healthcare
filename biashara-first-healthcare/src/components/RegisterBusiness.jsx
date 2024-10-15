import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MapView from "./MapView";

const RegisterBusiness = () => {
  const [formData, setFormData] = useState({
    business_owner: "",
    business_name: "",
    contact_number: "",
    email: "",
    address: "",
    business_type: "",
    description: "",
    latitude: "",
    longitude: "",
    useCurrentLocation: false,
  });

  const [isPinPlaced, setIsPinPlaced] = useState(false);
  const navigate = useNavigate();

  const setCoordinates = (coordinates, isCurrentLocation = false) => {
    setFormData({
      ...formData,
      latitude: coordinates[1],
      longitude: coordinates[0],
      useCurrentLocation: isCurrentLocation,
    });
    setIsPinPlaced(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessData = {
      business_owner: formData.business_owner,
      business_name: formData.business_name,
      contact_number: formData.contact_number,
      email: formData.email,
      address: formData.address,
      business_type: formData.business_type,
      description: formData.description,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/register_business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setFormData({
          business_owner: "",
          business_name: "",
          contact_number: "",
          email: "",
          address: "",
          business_type: "",
          description: "",
          latitude: "",
          longitude: "",
          useCurrentLocation: false,
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Failed to register business");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while registering the business");
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCoordinates(userCoords, true);
        },
        (error) => {
          console.error("Geolocation error: ", error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register Your Business
        </h2>

        <div className="mb-6 text-sm text-gray-500">
          <p>
            <strong>Instructions:</strong> You can either use your current location
            or place a pin on the map to register your business.
          </p>
          <p className="mt-2">1. Click on "Use Current Location" to automatically center the map on your location, or</p>
          <p>2. Click on the map to manually place a pin.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Business Owner</label>
            <input
              type="text"
              name="business_owner"
              value={formData.business_owner}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Business Type</label>
            <input
              type="text"
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-[48%] bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
            >
              Use Current Location
            </button>
            <p className="text-sm text-gray-500">(Click map to place a pin)</p>
          </div>

          <div className="h-96 mb-4">
            <MapView setCoordinates={setCoordinates} canPlacePin={true} />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-500"
          >
            Register Business
          </button>
        </form>

        {/* Guidance Text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            {isPinPlaced
              ? "You have placed a pin on the map. You can change it by clicking again."
              : "Place a pin by clicking on the map."}
          </p>
        </div>
      </div>
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default RegisterBusiness;

import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon, Stroke } from "ol/style";
import { Point, LineString } from "ol/geom";
import { decode } from '@mapbox/polyline';
import Feature from "ol/Feature";
import SearchBar from './SearchBar';
import axios from 'axios';

// Path to GeoJSON data for hospital locations
const hospitalsGeoJson = "/assets/Hospital_locations.geojson";

// URL for the businesses route
const businessesApiUrl = "https://backend-bfhealth.onrender.com/businesses";

const ORS_API_KEY = "5b3ce3597851110001cf6248fe6ac930d4954f9eada6222989493f22"; 
const ORS_API_URL_JSON = "https://api.openrouteservice.org/v2/directions/driving-car";


const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const MapView = ({ setCoordinates, center, canPlacePin = false }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [hospitalLayer, setHospitalLayer] = useState(null);
  const [businessLayer, setBusinessLayer] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [routeLayer, setRouteLayer] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null)
  const popupRef = useRef();

  useEffect(() => {
    // if (mapRef.current) return;
    if (mapInstance.current) return;

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([36.8219, -1.2921]),
        zoom: 12,
      }),
    });

    const popup = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });
    map.addOverlay(popup);

    mapRef.current = map;

    fetch(hospitalsGeoJson)
      .then((response) => response.json())
      .then((data) => {
        setGeojsonData(data);

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(data, {
            featureProjection: "EPSG:3857",
          }),
        });

        const hospitalStyle = new Style({
          image: new Icon({
            src: "/assets/hospital.png",
            scale: 0.017,
            anchor: [0.5, 1],
          }),
        });

        const hospitalLayer = new VectorLayer({
          source: vectorSource,
          style: hospitalStyle,
        });

        map.addLayer(hospitalLayer);
        setHospitalLayer(hospitalLayer);

        // Toggle hospital layer visibility
        hospitalLayer.setVisible(showHospitals);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });

    const markerSource = new VectorSource();
    const businessLayer = new VectorLayer({
      source: markerSource,
    });

    map.addLayer(businessLayer);
    setBusinessLayer(businessLayer);

    if (canPlacePin) {
      map.on("click", (evt) => {
        const coordinates = toLonLat(evt.coordinate);
        setCoordinates(coordinates);
        markerSource.clear();

        const marker = new Feature({
          geometry: new Point(evt.coordinate),
        });

        const markerStyle = new Style({
          image: new Icon({
            src: "/assets/location.png",
            scale: 0.05,
            anchor: [0.5, 1],
          }),
        });

        marker.setStyle(markerStyle);
        markerSource.addFeature(marker);
      });
    }
    mapInstance.current = map;

    fetch(businessesApiUrl)
      .then((response) => response.json())
      .then((data) => {
        setBusinesses(data.businesses);

        data.businesses.forEach((business) => {
          const businessCoords = [business.longitude, business.latitude];
          const businessFeature = new Feature({
            geometry: new Point(fromLonLat(businessCoords)),
            businessInfo: business,
          });

          const businessMarkerStyle = new Style({
            image: new Icon({
              src: "/assets/business.png",
              scale: 0.05,
              anchor: [0.5, 1],
            }),
          });

          businessFeature.setStyle(businessMarkerStyle);
          markerSource.addFeature(businessFeature);
        });
      })
      .catch((error) => console.error("Error loading business data:", error));

    map.on("pointermove", (evt) => {
      let featureFound = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const businessInfo = feature.get("businessInfo");
        if (businessInfo) {
          popup.setPosition(evt.coordinate);
          popupRef.current.innerHTML = `
            <strong>${businessInfo.business_name}</strong><br/>
            <hr style="margin: 5px 0;"/>
            ${businessInfo.business_type}
          `;
          popupRef.current.style.display = "block";
          featureFound = true;
        }
      });

      if (!featureFound) {
        popupRef.current.style.display = "none";
      }
      if (!featureFound) {
        map.forEachFeatureAtPixel(evt.pixel, (feature) => {
          // Directly access the 'name' field on the feature
          const hospitalName = feature.get("name"); 
          if (hospitalName) {
            popup.setPosition(evt.coordinate);
            popupRef.current.innerHTML = `
              <strong>${hospitalName}</strong><br/>
              <hr style="margin: 5px 0;"/>
              Hospital
            `;
            popupRef.current.style.display = "block";
            featureFound = true;
          }
        });
      }
    
      // Hide popup if no feature was found
      if (!featureFound) {
        popupRef.current.style.display = "none";
      }
    });

    map.on("click", (evt) => {
      let featureFound = false;
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const coordinates = evt.coordinate;
        const businessInfo = feature.get("businessInfo");

        if (businessInfo) {
          setSelectedBusiness(businessInfo);
          popup.setPosition(coordinates);
          popupRef.current.innerHTML = `
            <strong>${businessInfo.name}</strong><br/>
            ${businessInfo.type}
          `;
          popupRef.current.style.display = "block";
          featureFound = true;
        }
      });

      if (!featureFound) {
        popupRef.current.style.display = "none";
      }
    });
    if (selectedHospital) {
      showRoute(selectedHospital);
    }
  }, [setCoordinates, geojsonData, canPlacePin, showHospitals, showBusinesses, selectedHospital]);

  const updateView = (longitude, latitude) => {
    if (mapInstance.current) {
      const view = mapInstance.current.getView();
      view.setCenter(fromLonLat([longitude, latitude]));
      view.setZoom(16); 
  
      const markerSource = new VectorSource();
      const currentLocationLayer = new VectorLayer({
        source: markerSource,
      });
  
      
      markerSource.clear();
  
      
      const marker = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
  
      const markerStyle = new Style({
        image: new Icon({
          src: "/assets/location.png",
          scale: 0.05,
          anchor: [0.5, 1],
        }),
      });
  
      marker.setStyle(markerStyle);
  
      
      markerSource.addFeature(marker);
  
     
      mapInstance.current.addLayer(currentLocationLayer);
  
      //  Remove the layer when needed
      // mapInstance.current.removeLayer(currentLocationLayer);
    }
  };
  

  // Expose the updateView function
  useEffect(() => {
    window.updateMapView = updateView;
  }, []);

  const handleSelectLocation = (result) => {
    const { latitude, longitude } = result.properties || result;
    const coordinates = fromLonLat([longitude, latitude]);
    setCoordinates(coordinates);
    mapRef.current.getView().setCenter(coordinates);
    mapRef.current.getView().setZoom(20);
  };

  const getNearbyHospitals = () => {
    if (!selectedBusiness || !geojsonData) return [];

    const businessLat = selectedBusiness.latitude;
    const businessLon = selectedBusiness.longitude;
    const maxDistance = 10;

    const hospitalsWithinRange = geojsonData.features
      .map((hospitalFeature) => {
        const hospitalLat = hospitalFeature.geometry.coordinates[1];
        const hospitalLon = hospitalFeature.geometry.coordinates[0];
        const distance = haversineDistance(businessLat, businessLon, hospitalLat, hospitalLon);
        return { hospitalFeature, distance };
      })
      .filter(({ distance }) => distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    return hospitalsWithinRange;
  };

const showRoute = async (hospitalCoords) => {
  const businessCoords = [selectedBusiness.longitude, selectedBusiness.latitude];

  console.log("Business coordinates:", businessCoords);
  console.log("Hospital coordinates:", hospitalCoords);

  try {
    const response = await axios.post(
      `${ORS_API_URL_JSON}?api_key=${ORS_API_KEY}`,
      {
        coordinates: [businessCoords, hospitalCoords],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("ORS API response:", response.data);

    // Check if the response has routes
    if (!response.data || !response.data.routes || response.data.routes.length === 0) {
      console.error("No route found in the response.");
      return;
    }

    const route = response.data.routes[0];
    console.log("Route object:", route);

    
    if (!route.geometry) {
      console.error("No geometry found in the route.");
      return;
    }

    const decodedCoords = decode(route.geometry); 
    console.log("Decoded route coordinates:", decodedCoords);

    
    const routeCoords = decodedCoords.map(([lat, lon]) => fromLonLat([lon, lat]));

    // Create route feature and style
    const routeFeature = new Feature({
      geometry: new LineString(routeCoords),
    });

    const routeStyle = new Style({
      stroke: new Stroke({
        color: "#FF0000",
        width: 3,
      }),
    });

    routeFeature.setStyle(routeStyle);

   
    if (routeLayer) {
      routeLayer.getSource().clear();
      // Optionally remove the layer from the map if you want to recreate it
      mapRef.current.removeLayer(routeLayer);
    }

    // Create a new route layer
    const routeLayerSource = new VectorSource({
      features: [routeFeature],
    });

    const newRouteLayer = new VectorLayer({
      source: routeLayerSource,
    });
    mapRef.current.addLayer(newRouteLayer);
    setRouteLayer(newRouteLayer); 

    console.log("Route displayed on map.");
  } catch (error) {
    console.error("Error fetching route:", error.response ? error.response.data : error.message);
  }
};
  const Modal = ({ isOpen, onClose, hospitals, onHospitalClick }) => {
    if (!isOpen) return null;
  
    const handleHospitalClick = (hospitalCoords) => {
      // Open Google Maps Directions before closing the modal
      const businessCoords = [selectedBusiness.latitude, selectedBusiness.longitude];
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${businessCoords[0]},${businessCoords[1]}&destination=${hospitalCoords[1]},${hospitalCoords[0]}&travelmode=driving`;
      window.open(googleMapsUrl, "_blank");
  
      onClose();
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded shadow-lg w-100 max-h-96 overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-gray-300 rounded-md text-gray-700"
          >
            X
          </button>
          <h3 className="text-xl font-bold mb-4">Hospitals near {selectedBusiness.business_name}</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Hospital</th>
                <th className="px-4 py-2">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(({ hospitalFeature, distance }, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleHospitalClick([hospitalFeature.geometry.coordinates[0], hospitalFeature.geometry.coordinates[1]])}
                      className="text-blue-500 hover:underline"
                    >
                      {hospitalFeature.properties.name}
                    </button>
                  </td>
                  <td className="border px-4 py-2">{distance.toFixed(2)} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

  return (
    <div className="map-container relative">

      <div id="map" className="h-96 w-full"></div>
      <div ref={popupRef} className="ol-popup bg-white text-xs font-light p-2" style={{ display: "none" }}></div>

      {/* Layer control panel */}
      <div className="absolute top-4 left-4 p-4 bg-white z-10 flex space-x-4 flex-col">
        <div>
          <SearchBar
            hospitals={geojsonData}
            businesses={businesses}
            onSelectLocation={handleSelectLocation}
          />
        </div>
        <div className="mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={() => {
                setShowHospitals((prev) => !prev);
                hospitalLayer && hospitalLayer.setVisible(!showHospitals);
              }}
            />
            <span>Show Hospitals</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBusinesses}
              onChange={() => {
                setShowBusinesses((prev) => !prev);
                businessLayer && businessLayer.setVisible(!showBusinesses);
              }}
            />
            <span>Show Businesses</span>
          </label>
        </div>
      </div>

      <Modal
        isOpen={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        hospitals={getNearbyHospitals()}
        onHospitalClick={(hospitalCoords) => showRoute(hospitalCoords)}
      />
    </div>
  );

};

export default MapView;
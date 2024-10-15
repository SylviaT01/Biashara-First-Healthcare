import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon } from "ol/style";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import SearchBar from './SearchBar';

// Path to GeoJSON data for hospital locations
const hospitalsGeoJson = "/assets/Hospital_locations.geojson";

// URL for the businesses route
const businessesApiUrl = "http://127.0.0.1:5000/businesses";

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

const MapView = ({ setCoordinates, center, zoomToCoordinates, canPlacePin = false }) => {
  const mapRef = useRef(null);
  const [hospitalLayer, setHospitalLayer] = useState(null);
  const [businessLayer, setBusinessLayer] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showBusinesses, setShowBusinesses] = useState(true);
  const popupRef = useRef();

  useEffect(() => {
    if (mapRef.current) return;

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



        if (zoomToCoordinates) {
          const centerCoords = fromLonLat([zoomToCoordinates[0], zoomToCoordinates[1]]);
          map.getView().setCenter(centerCoords);
          map.getView().setZoom(14);
        }
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
  }, [setCoordinates, zoomToCoordinates, geojsonData, canPlacePin, showHospitals, showBusinesses]);

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

  const Modal = ({ isOpen, onClose, hospitals }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded shadow-lg w-96 max-h-96 overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
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
                  <td className="border px-4 py-2">{hospitalFeature.properties.name}</td>
                  <td className="border px-4 py-2">{distance.toFixed(2)}</td>
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
      />
    </div>
  );

};

export default MapView;
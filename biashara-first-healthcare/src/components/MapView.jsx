import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon } from "ol/style";
import { Point } from "ol/geom";
import Feature from "ol/Feature";

// Path to GeoJSON data for hospital locations
const hospitalsGeoJson = "/assets/Hospital_locations.geojson";

// URL for the businesses route
const businessesApiUrl = "http://127.0.0.1:5000/businesses";

// Haversine formula to compute the distance between two lat/lon points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(deltaLon / 2) *
    Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

const MapView = ({ setCoordinates, center, zoomToCoordinates, canPlacePin = false }) => {
  const mapRef = useRef(null);
  const [markerLayer, setMarkerLayer] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [businesses, setBusinesses] = useState([]);

  // Get the nearest hospital using the Haversine formula
  const getNearestHospitals = (userCoords, hospitals) => {
    let nearestHospitals = [];
    hospitals.forEach((hospital) => {
      const hospitalCoords = hospital.geometry.coordinates;
      const distance = haversineDistance(
        userCoords[1],
        userCoords[0],
        hospitalCoords[1],
        hospitalCoords[0]
      );

      // Only add hospitals within a certain radius 
      if (distance <= 10) {
        nearestHospitals.push({ ...hospital, distance });
      }
    });
    return nearestHospitals;
  };

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

    mapRef.current = map;

    // Load the GeoJSON for hospitals
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

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: hospitalStyle,
        });

        map.addLayer(vectorLayer);

        // Check if zoomToCoordinates exists and adjust map view
        if (zoomToCoordinates) {
          const centerCoords = fromLonLat([zoomToCoordinates[0], zoomToCoordinates[1]]);
          map.getView().setCenter(centerCoords);
          map.getView().setZoom(14);
        }
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });

    // Create a layer to hold the marker (user-placed pin)
    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
    });

    map.addLayer(markerLayer);
    setMarkerLayer(markerSource);

    // Handle map click to place a marker
    if (canPlacePin) {
    map.on("click", (evt) => {
      const coordinates = toLonLat(evt.coordinate);
      setCoordinates(coordinates);

      markerSource.clear();

      if (geojsonData && geojsonData.features) {
        const nearestHospitals = getNearestHospitals(coordinates, geojsonData.features);
        if (nearestHospitals.length > 0) {
          alert(`Nearest hospitals found in your area!`);
          nearestHospitals.forEach(hospital => {
            alert(`${hospital.properties.name} - ${hospital.distance.toFixed(2)} km`);
          });
        } else {
          alert("No hospital found nearby.");
        }
      }

      // Create a new marker (pin) at the clicked location
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

    // Fetch businesses from backend
    fetch(businessesApiUrl)
      .then((response) => response.json())
      .then((data) => {
        setBusinesses(data.businesses); // Save businesses to state

        // Add business markers to the map
        data.businesses.forEach((business) => {
          const businessCoords = [business.longitude, business.latitude];
          const businessFeature = new Feature({
            geometry: new Point(fromLonLat(businessCoords)),
          });

          const businessStyle = new Style({
            image: new Icon({
              src: "/assets/business.png",
              scale: 0.05,
              anchor: [0.5, 1],
            }),
          });

          businessFeature.setStyle(businessStyle);
          markerSource.addFeature(businessFeature);
        });
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
      });
  }, [setCoordinates, zoomToCoordinates, geojsonData, canPlacePin]);

  return <div id="map" className="h-full w-full" />;
};

export default MapView;

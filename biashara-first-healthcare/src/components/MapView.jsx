import React, { useEffect } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Circle, Fill, Stroke } from "ol/style";

const hospitalsGeoJson = "/path/to/your/Hospital_locations.geojson"; // Replace with actual GeoJSON path

const MapView = () => {
  useEffect(() => {
    // Create a map
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([36.8219, -1.2921]), // Nairobi, Kenya coordinates as default
        zoom: 10,
      }),
    });

    // Load the GeoJSON for hospitals
    fetch(hospitalsGeoJson)
      .then((response) => response.json())
      .then((geojsonData) => {
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geojsonData, {
            featureProjection: "EPSG:3857",
          }),
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({ color: "blue" }),
              stroke: new Stroke({
                color: "white",
                width: 2,
              }),
            }),
          }),
        });

        map.addLayer(vectorLayer);
      });
  }, []);

  return (
    <div id="map" className="h-full w-full" />
  );
};

export default MapView;

import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";

const hospitalsGeoJson = "/assets/Hospital_locations.geojson";

const MapView = () => {
    const mapRef = useRef(null);
    useEffect(() => {
        if (mapRef.current) return;
        // Create a map
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
        // setMapRef(mapRef.current);

        // Load the GeoJSON for hospitals
        fetch(hospitalsGeoJson)
            .then((response) => response.json())
            .then((geojsonData) => {
                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData, {
                        featureProjection: "EPSG:3857",
                    }),
                });

                const hospitalStyle = new Style({
                    image: new Icon({
                        src: '/assets/hospital.png',
                        scale: 0.017,
                        anchor: [0.5, 1],
                    }),
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: hospitalStyle,
                });

                map.addLayer(vectorLayer);
            });
    }, []);

    return (
        <div id="map" className="h-full w-full" />
    );
};

export default MapView;

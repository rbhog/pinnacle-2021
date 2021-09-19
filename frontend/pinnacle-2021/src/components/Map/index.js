import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  'pk.eyJ1Ijoicm9iZXJ0YmFvIiwiYSI6ImNrbmJ4b2EyazB3a2kyb29vdmI4NnFhdHkifQ.eWUrs0-n2fF0u1XZhNbE4w';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  let m;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-76.9425, 38.9901],
      zoom: 14.71,
    });

    m = map.current;
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    if (!m) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    m.on('load', () => {
      /**
       * Skybox
       */
      m.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-color': '#1a1a1aEF',
          'sky-atmosphere-sun-intensity': 15,
        },
      });

      /**
       * Neighborhood Region
       */
      m.addSource('s1', {
        type: 'geojson',
        data: './geojson/subject_1.geojson',
      });
      m.addLayer({
        id: 's1-outline',
        type: 'line',
        source: 's1',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 4,
        },
      });

      // s2

      /**
       * Neighborhood Region
       */
      m.addSource('s2', {
        type: 'geojson',
        data: './geojson/subject_1.geojson',
      });
      m.addLayer({
        id: 's2-outline',
        type: 'line',
        source: 's2',
        layout: {},
        paint: {
          'line-color': '#9ebf36',
          'line-width': 4,
        },
      });

      // s3

      /**
       * Neighborhood Region
       */
      m.addSource('s3', {
        type: 'geojson',
        data: './geojson/subject_1.geojson',
      });
      m.addLayer({
        id: 's3-outline',
        type: 'line',
        source: 's3',
        layout: {},
        paint: {
          'line-color': '#59e16a',
          'line-width': 4,
        },
      });

      // s4

      /**
       * Neighborhood Region
       */
      m.addSource('s4', {
        type: 'geojson',
        data: './geojson/subject_1.geojson',
      });
      m.addLayer({
        id: 's4-outline',
        type: 'line',
        source: 's4',
        layout: {},
        paint: {
          'line-color': '#4aa1f4',
          'line-width': 4,
        },
      });

      // s5

      /**
       * Neighborhood Region
       */
      m.addSource('s5', {
        type: 'geojson',
        data: './geojson/subject_5.geojson',
      });
      m.addLayer({
        id: 's5-outline',
        type: 'line',
        source: 's5',
        layout: {},
        paint: {
          'line-color': '#a63928',
          'line-width': 4,
        },
      });
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

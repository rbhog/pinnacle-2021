import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Slider from '../Slider';

import buildings from '../../../../../../test/master.geojson';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmJob2ciLCJhIjoiY2tieWE0N3ByMGFhMTJ5dDZldXA2b3E0bCJ9.9m48ruH9QzUOYpeISYI-lg';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-76.943316049);
  const [lat, setLat] = useState(38.98611);
  const [zoom, setZoom] = useState(16.15);
  // 38.986117691303434, -76.9433160497966
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    map
      .addSource('layers', {
        type: 'geojson',
        data: layers,
      })
      .addLayer({
        id: 'layers',
        type: 'fill',
        source: 'layers',
        paint: {
          'fill-color': '#E21833',
          'fill-opacity': 0.01,
        },
      });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="sidebar-slider">
        <Slider />
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

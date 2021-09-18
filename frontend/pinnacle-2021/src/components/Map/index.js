import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Slider from '../Slider';

import buildings from '../../geojson/master.geojson';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmJob2ciLCJhIjoiY2tieWE0N3ByMGFhMTJ5dDZldXA2b3E0bCJ9.9m48ruH9QzUOYpeISYI-lg';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-76.943316049);
  const [lat, setLat] = useState(38.98611);
  const [zoom, setZoom] = useState(16.15);
  let m;
  // 38.986117691303434, -76.9433160497966
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    m = map.current;
    m.on('load', function () {
      m.addSource('buildings', {
        type: 'geojson',
        data: buildings,
      }).addLayer({
        id: 'layers',
        type: 'fill',
        source: 'buildings',
        paint: {
          'fill-color': '#E21833',
          'fill-opacity': 0.01,
        },
      });
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

  useEffect(() => {
    map.addControl(new CompassControl(), 'top-right');
    map.addControl(new ZoomControl(), 'top-right');
    map.addControl(
      new RulerControl({
        mainColor: '#E21833',
        secondaryColor: '#414141',
        units: 'miles',
        labelFormat: n => `${n.toFixed(2)} miles`,
      }),
      'top-right'
    );
    map.addControl(new InspectControl(), 'top-right');

    map.on('move', () => {
      setMapState({
        lat: map.getCenter().lat.toFixed(4),
        lng: map.getCenter().lng.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
  }, [map]);

  useEffect(() => {
    if (!map) return;

    // Clear distance layer & initiate empty distances[]
    // map.getSource("distances").setData(featureCollection([]))

    // let distances = []
    // let speeds = []

    paths.forEach(({ enabled, data }, i) => {
      let {
        NAME: name,
        TIME_START: start,
        TIME_END: end,
        TIME_STEP: step,
      } = data.properties;

      const lineLayerName = 'path_' + name + '_line';
      const circleLayerName = 'path_' + name + '_circle';

      const endIndex = ~~((time - start) / step);
      const coords = [...data.geometry.coordinates].slice(0, endIndex + 1);

      const lastPoint = coords[endIndex];

      // Clear circles if not in time range / not enabled
      // Clear lines if there aren't >= 2 points

      if (!enabled || time < start || time > end)
        map.getSource(circleLayerName).setData(featureCollection([]));

      if (!enabled || time <= start) {
        map.getSource(lineLayerName).setData(featureCollection([]));
        return;
      }

      // Add line if at least 2 points
      if (coords.length >= 2) {
        map.getSource(lineLayerName).setData(lineString(coords));
        // .setData(bezierSpline(lineString(coords), { resolution: 1000000, sharpness: 0.6 }))
      }

      // Add circle & perform collision detection if in time range
      if (lastPoint) {
        map.getSource(circleLayerName).setData(
          featureCollection([
            circle(lastPoint, SAFE_RADIUS, {
              steps: 500,
              units: 'kilometers',
            }),
          ])
        );
      }
    });

    // setPathSpeeds(speeds)
  }, [map, time, paths]);

  useEffect(() => {
    if (!map) return;

    paths.forEach(({ enabled, data }) => {
      const lineLayerName = 'path_' + data.properties.NAME + '_line';
      const circleLayerName = 'path_' + data.properties.NAME + '_circle';
      const lineLayer = map.getSource(lineLayerName);

      // If line layer exists already, show / hide
      if (lineLayer) {
        map.setLayoutProperty(
          lineLayerName,
          'visibility',
          enabled ? 'visible' : 'none'
        );

        return;
      }

      map.on('mouseenter');

      map.on('click', lineLayerName, e => handleClick(map, e.lngLat, data));
      map.on('click', circleLayerName, e => handleClick(map, e.lngLat, data));

      map.on('mouseenter', lineLayerName, () => handleMouse(map, 'pointer'));
      map.on('mouseenter', circleLayerName, () => handleMouse(map, 'pointer'));

      map.on('mouseleave', lineLayerName, () => handleMouse(map, ''));
      map.on('mouseleave', circleLayerName, () => handleMouse(map, ''));

      // Add initial sources + layers
      // Initial source has empty featureCollection, since it'll be updated later
      map
        .addSource(lineLayerName, {
          type: 'geojson',
          data: featureCollection([]),
        })
        .addSource(circleLayerName, {
          type: 'geojson',
          data: featureCollection([]),
        })
        .addLayer({
          id: lineLayerName,
          type: 'line',
          source: lineLayerName,
          paint: {
            'line-color': data.properties.COLOR,
            'line-opacity': 0.4,
            'line-width': 2,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'bevel',
          },
        })
        .addLayer({
          id: circleLayerName,
          type: 'fill',
          source: circleLayerName,
          paint: {
            'fill-color': data.properties.COLOR,
            'fill-opacity': 0.2,
            'fill-outline-color': data.properties.COLOR,
          },
        });
    });
  }, [map, paths]);

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

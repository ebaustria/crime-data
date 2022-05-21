import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2J1c2giLCJhIjoiY2thcXVzMGszMmJhZjMxcDY2Y2FrdXkwMSJ9.cwBqtbXpWJbtAEGli1AIIg';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(13.7373);
  const [lat, setLat] = useState(51.0504);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    // initialize map only once
    if (map.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
      <div className="app-container">
        <div ref={mapContainer} className="map-container" />
      </div>
  );
}

export default App;

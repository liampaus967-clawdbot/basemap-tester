import React, { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Basemap style definitions
interface BasemapStyle {
  id: string;
  name: string;
  icon: string;
  url: string;
}

const BASEMAP_STYLES: BasemapStyle[] = [
  {
    id: "hydro-light",
    name: "Hydro Light",
    icon: "💧",
    url: "mapbox://styles/onwaterllc/STYLE_ID_HERE", // Replace with uploaded style ID
  },
  {
    id: "topo-light",
    name: "Topo Light",
    icon: "🗺️",
    url: "mapbox://styles/mapbox/outdoors-v12",
  },
  {
    id: "topo-dark",
    name: "Topo Dark",
    icon: "🌑",
    url: "mapbox://styles/mapbox/dark-v11",
  },
  {
    id: "satellite",
    name: "Satellite",
    icon: "🛰️",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
  },
];

const BasemapTester: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 4,
  });

  const [activeStyleId, setActiveStyleId] = useState<string>("topo-light");

  const activeStyle = BASEMAP_STYLES.find((s) => s.id === activeStyleId);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={activeStyle?.url}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
      </Map>

      {/* Basemap Switcher Panel */}
      <div className="basemap-panel">
        <div className="panel-title">Basemap Style</div>
        
        <div className="basemap-grid">
          {BASEMAP_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveStyleId(style.id)}
              className={`basemap-btn ${activeStyleId === style.id ? "active" : ""}`}
            >
              <span className="basemap-icon">{style.icon}</span>
              <span className="basemap-label">{style.name}</span>
              {activeStyleId === style.id && <span className="active-indicator" />}
            </button>
          ))}
        </div>

        {/* Current Style Info */}
        <div className="style-info">
          <span>Current Style URL:</span>
          <code>{activeStyle?.url}</code>
        </div>
      </div>
    </div>
  );
};

export default BasemapTester;

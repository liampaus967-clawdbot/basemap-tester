import React, { useState, useCallback } from "react";
import Map, { NavigationControl } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import hydroLightStyle from "@/styles/hydro-light.json";
import onxTopoLightStyle from "@/styles/onx-topo-light.json";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Basemap style definitions
interface BasemapStyle {
  id: string;
  name: string;
  icon: string;
  style: string | object; // Can be URL string or style JSON object
}

const BASEMAP_STYLES: BasemapStyle[] = [
  {
    id: "onx-topo-light",
    name: "onX Topo Light",
    icon: "🏔️",
    style: onxTopoLightStyle, // onX-style with contours in feet
  },
  {
    id: "hydro-light",
    name: "Hydro Light",
    icon: "💧",
    style: hydroLightStyle,
  },
  {
    id: "topo-light",
    name: "Topo Light",
    icon: "🗺️",
    style: "mapbox://styles/mapbox/outdoors-v12",
  },
  {
    id: "topo-dark",
    name: "Topo Dark",
    icon: "🌑",
    style: "mapbox://styles/mapbox/dark-v11",
  },
  {
    id: "satellite",
    name: "Satellite",
    icon: "🛰️",
    style: "mapbox://styles/mapbox/satellite-streets-v12",
  },
];

const BasemapTester: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: 44.5,
    longitude: -72.7,
    zoom: 10,
  });

  const [activeStyleId, setActiveStyleId] = useState<string>("onx-topo-light");

  const activeStyle = BASEMAP_STYLES.find((s) => s.id === activeStyleId);

  // Enable 3D terrain when map loads
  const onMapLoad = useCallback((event: { target: any }) => {
    const map = event.target;
    
    // Add terrain source if not already present
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
    }
    
    // Enable 3D terrain
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={activeStyle?.style as any}
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={onMapLoad}
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
          <span>Current Style:</span>
          <code>{typeof activeStyle?.style === 'string' ? activeStyle.style : 'Local JSON (hydro-light.json)'}</code>
        </div>
      </div>
    </div>
  );
};

export default BasemapTester;

import React, { useState, useCallback } from "react";
import Map, { NavigationControl, Source, Layer } from "react-map-gl";
import type { LineLayer, SymbolLayer } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import onwaterTopoLightStyle from "@/styles/onwater-topo-light.json";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Rivers layer styles
const riversLayer: LineLayer = {
  id: "rivers-onwater",
  type: "line",
  source: "rivers",
  "source-layer": "testRiversSet-cr53z3",
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": "#5a9fc7",
    "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0, 10, 1.5, 14, 3],
    "line-opacity": 0.9,
  },
};

const riversLabelLayer: SymbolLayer = {
  id: "rivers-onwater-label",
  type: "symbol",
  source: "rivers",
  "source-layer": "testRiversSet-cr53z3",
  minzoom: 8,
  layout: {
    "text-field": ["get", "gnis_name"],
    "text-font": ["DIN Pro Bold Italic", "Arial Unicode MS Bold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 10, 13, 14, 15],
    "symbol-placement": "line",
    "text-max-angle": 30,
    "text-padding": 10,
  },
  paint: {
    "text-color": "#2c5973",
    "text-halo-color": "rgba(255, 255, 255, 0.9)",
    "text-halo-width": 1,
  },
};

// Basemap style definitions
interface BasemapStyle {
  id: string;
  name: string;
  icon: string;
  style: string | object; // Can be URL string or style JSON object
}

const BASEMAP_STYLES: BasemapStyle[] = [
  {
    id: "onwater-topo-light",
    name: "onWater Topo Light",
    icon: "🏔️",
    style: onwaterTopoLightStyle,
  },
  {
    id: "erins-basemap",
    name: "Dark Basemap",
    icon: "🗺️",
    style: "mapbox://styles/erinonwater/cml8n6urc005001sqcymq79wv",
  },
];

const BasemapTester: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: 44.5,
    longitude: -72.7,
    zoom: 10,
    pitch: 45,
    bearing: -10,
  });

  const [activeStyleId, setActiveStyleId] =
    useState<string>("onwater-topo-light");

  const activeStyle = BASEMAP_STYLES.find((s) => s.id === activeStyleId);

  // Setup terrain and hillshade on a map instance
  const setupTerrain = useCallback((map: any) => {
    if (!map.isStyleLoaded()) return;

    // Add terrain source if not already present
    if (!map.getSource("mapbox-dem")) {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
    }

    // Add separate DEM source for hillshade layer (for full resolution)
    if (!map.getSource("mapbox-dem-hillshade")) {
      map.addSource("mapbox-dem-hillshade", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
    }

    // Add hillshade layer if not already present
    if (!map.getLayer("hillshade")) {
      // Find a good insertion point - before labels/symbols if possible
      const layers = map.getStyle().layers;
      let insertBefore: string | undefined;
      for (const layer of layers) {
        if (layer.type === "symbol" || layer.id.includes("label")) {
          insertBefore = layer.id;
          break;
        }
      }

      map.addLayer(
        {
          id: "hillshade",
          type: "hillshade",
          source: "mapbox-dem-hillshade",
          paint: {
            "hillshade-illumination-direction": 315,
            "hillshade-illumination-anchor": "viewport",
            "hillshade-exaggeration": 0.9,
            "hillshade-shadow-color": "#2a3a2a",
            "hillshade-highlight-color": "#ffffff",
            "hillshade-accent-color": "#3a4a3a",
          },
        },
        insertBefore,
      );
    }

    // Enable 3D terrain
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.75 });
  }, []);

  // Enable 3D terrain and hillshade when map loads
  const onMapLoad = useCallback(
    (event: { target: any }) => {
      setupTerrain(event.target);
    },
    [setupTerrain],
  );

  // Re-apply terrain when style changes
  const onStyleData = useCallback(
    (event: { target: any }) => {
      // Small delay to ensure style is fully loaded
      setTimeout(() => {
        setupTerrain(event.target);
      }, 100);
    },
    [setupTerrain],
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Map
        initialViewState={viewport}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={activeStyle?.style as any}
        mapboxAccessToken={MAPBOX_TOKEN}
        projection={{ name: "globe" }}
        onLoad={onMapLoad}
        onStyleData={onStyleData}
      >
        <NavigationControl position="top-right" />

        {/* Rivers Layer */}
        <Source id="rivers" type="vector" url="mapbox://lman967.d0g758s3">
          <Layer {...riversLayer} />
          <Layer {...riversLabelLayer} />
        </Source>
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
              {activeStyleId === style.id && (
                <span className="active-indicator" />
              )}
            </button>
          ))}
        </div>

        {/* Current Style Info */}
        <div className="style-info">
          <span>Current Style:</span>
          <code>
            {typeof activeStyle?.style === "string"
              ? activeStyle.style
              : "Local JSON (hydro-light.json)"}
          </code>
        </div>
      </div>
    </div>
  );
};

export default BasemapTester;

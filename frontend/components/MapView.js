"use client";

import React, { useState } from "react";
import { GoogleMap, Marker, Circle, useJsApiLoader, HeatmapLayer } from "@react-google-maps/api";

const libraries = ["visualization"];

export default function MapView({ lat, lng, density, zones = [] }) {
  const [showHeatmap, setShowHeatmap] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const getColor = (val) => {
    if (val < 0.3) return "#22c55e"; // green
    if (val < 0.7) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  if (!isLoaded) return <div className="w-full h-[400px] flex items-center justify-center bg-slate-800/50 rounded-[16px] text-slate-400">Loading Map...</div>;

  return (
    <div className="relative w-full h-[400px] rounded-[16px] overflow-hidden shadow-lg">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-lg text-sm font-semibold text-white shadow-xl transition-all"
        >
          {showHeatmap ? "Show Standard Markers" : "Show Density Heatmap"}
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        center={{ lat, lng }}
        zoom={16}
      >
        {showHeatmap ? (
          <HeatmapLayer 
            data={zones.map(z => ({
              location: new window.google.maps.LatLng(z.location.lat, z.location.lng),
              weight: z.crowd_density.value * 10
            }))} 
            options={{
              radius: 50,
              opacity: 0.7,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            }} 
          />
        ) : (
          <>
            <Marker position={{ lat, lng }} title="Main Venue" />
            {zones.map((zone, i) => (
              <React.Fragment key={i}>
                <Marker position={zone.location} title={zone.name} />
                <Circle
                  center={zone.location}
                  radius={80}
                  options={{
                    fillColor: getColor(zone.crowd_density.value),
                    fillOpacity: 0.4,
                    strokeColor: getColor(zone.crowd_density.value),
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                  }}
                />
              </React.Fragment>
            ))}
          </>
        )}
      </GoogleMap>
    </div>
  );
}

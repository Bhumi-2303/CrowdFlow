"use client";

import dynamic from "next/dynamic";

const GoogleMap = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.GoogleMap),
  { ssr: false }
);

const LoadScript = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.LoadScript),
  { ssr: false }
);

const Marker = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Marker),
  { ssr: false }
);

const Circle = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Circle),
  { ssr: false }
);

import React from "react";

export default function MapView({ lat, lng, density, zones = [] }) {
  const getColor = (val) => {
    if (val < 0.3) return "#22c55e"; // green
    if (val < 0.7) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
          borderRadius: "16px",
        }}
        center={{ lat, lng }}
        zoom={16}
      >
        {/* Overall Venue Marker */}
        <Marker 
          position={{ lat, lng }} 
          title="Main Venue"
        />

        {/* Zone-specific indicators */}
        {zones.map((zone, i) => (
          <React.Fragment key={i}>
            <Marker
              position={zone.location}
              title={zone.name}
            />
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
      </GoogleMap>
    </LoadScript>
  );
}

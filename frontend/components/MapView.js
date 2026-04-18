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

export default function MapView({ lat, lng, density }) {
  const getColor = () => {
    if (density < 0.3) return "#22c55e"; // green
    if (density < 0.7) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "300px",
          borderRadius: "16px",
        }}
        center={{ lat, lng }}
        zoom={15}
      >
        <Marker position={{ lat, lng }} />
        <Circle
          center={{ lat, lng }}
          radius={200}
          options={{
            fillColor: getColor(),
            fillOpacity: 0.4,
            strokeColor: getColor(),
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}

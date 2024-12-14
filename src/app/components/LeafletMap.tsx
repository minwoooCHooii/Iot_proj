'use client';

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  data: {
    location: string;
    coordinates: [number, number];
    congestionLevel: string;
  }[];
}

// 커스텀 아이콘 정의
const customIcon = new L.Icon({
  iconUrl: "/location.png", // public 폴더의 location.png 사용
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function LeafletMap({ data }: LeafletMapProps) {
  console.log("LeafletMap Data:", data); // 데이터 확인

  return (
    <MapContainer
      center={[37.5665, 126.9780]} // 서울 중심 좌표
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((location, index) => (
        <Marker
          key={index}
          position={location.coordinates}
          icon={customIcon} // 커스텀 아이콘 적용
        >
          <Popup>
            <strong>{location.location}</strong>
            <br />
            혼잡도: {location.congestionLevel}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


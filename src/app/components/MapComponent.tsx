'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationData {
  location: string;
  latitude: number;
  longitude: number;
  congestionLevel: '붐빔' | '보통' | '여유';
}

// 커스텀 아이콘 설정
const customIcon = L.icon({
  iconUrl: '/location.png', // public 폴더 기준 경로
  iconSize: [40, 40], // 아이콘 크기
  iconAnchor: [20, 40], // 마커의 기준 위치
  popupAnchor: [0, -40], // 팝업 위치
});

export default function MapComponent({ data }: { data: LocationData[] }) {
  const validLocations = data.filter(
    ({ latitude, longitude }) => !isNaN(latitude) && !isNaN(longitude)
  );

  return (
    <MapContainer
      center={[37.5665, 126.9780]} // 서울 중심 좌표
      zoom={12}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {validLocations.map((location, index) => (
        <Marker
          key={index}
          position={[location.latitude, location.longitude]}
          icon={customIcon}
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

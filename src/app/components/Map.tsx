'use client';

import React from "react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface MapProps {
  data: {
    location: string;
    coordinates: [number, number];
    totalPopulation: number;
    congestionLevel: string;
  }[];
}

export default function Map({ data }: MapProps) {
  const validData = data.filter(
    (item) => item.coordinates && item.coordinates.length === 2
  ).map(item => ({
    location: item.location,
    coordinates: item.coordinates,
    congestionLevel: item.congestionLevel
  }));

  console.log("Valid Data for Leaflet:", validData); // 유효 데이터 확인

  return <LeafletMap data={validData} />;
}


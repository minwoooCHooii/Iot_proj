'use client';

import WeatherCard from './WeatherCard';

interface WeatherListProps {
  weatherData: {
    location: string;
    totalPopulation: number;
    weather: {
      weatherStatus: string;
      temp: number;
      sensibleTemp: number;
      maxTemp: number;
      minTemp: number;
      humidity: number;
      pm10: number;
      precipitation: string;
    } | null;
  }[];
}

export default function WeatherList({ weatherData }: WeatherListProps) {
  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "30px", // 카드 간 간격
        padding: "20px 0",
        paddingLeft: "20px", // 스크롤 시작 간격
        justifyContent: "flex-start",
      }}
    >
      {weatherData.map((data, index) => (
        <WeatherCard
          key={index}
          location={data.location}
          totalPopulation={data.totalPopulation}
          weather={data.weather}
        />
      ))}
    </div>
  );
}

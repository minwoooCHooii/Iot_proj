'use client';

interface WeatherCardProps {
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
}

export default function WeatherCard({
  location,
  totalPopulation,
  weather,
}: WeatherCardProps) {
  const getPm10Status = (pm10: number) => {
    if (pm10 <= 30) return { status: "좋음", color: "#00BFFF" };
    if (pm10 <= 80) return { status: "보통", color: "#32CD32" };
    return { status: "나쁨", color: "#FF6347" };
  };

  const pm10Info = weather ? getPm10Status(weather.pm10) : null;

  return (
    <div
      style={{
        borderRadius: "16px",
        padding: "20px",
        background: "#fff",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        width: "400px", // 가로 폭을 고정
        minWidth: "400px", // 최소 너비 설정
        margin: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#000", marginBottom: "10px" }}>
        {location}
      </h2>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        <strong>총 인구:</strong> {totalPopulation.toLocaleString()}명
      </p>
      {weather ? (
        <ul style={{ listStyleType: "none", padding: 0, lineHeight: "1.8", fontSize: "16px" }}>
          <li><strong>날씨 상태:</strong> {weather.weatherStatus || "데이터 없음"}</li>
          <li><strong>기온:</strong> {weather.temp || "데이터 없음"}°C</li>
          <li><strong>체감온도:</strong> {weather.sensibleTemp || "데이터 없음"}°C</li>
          <li>
            <strong>최고/최저 기온:</strong> {weather.maxTemp || "데이터 없음"}°C /{" "}
            {weather.minTemp || "데이터 없음"}°C
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <strong>습도 - </strong>
            <img
              src="/humidity_background_removed.png"
              alt="습도 아이콘"
              style={{ width: "20px", height: "20px" }}
            />
            {weather.humidity || "데이터 없음"}%
          </li>
          <li>
            <strong>미세먼지 농도:</strong>
            <div
              style={{
                marginTop: "10px",
                height: "12px",
                width: "100%",
                backgroundColor: "#f0f0f0",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min((weather.pm10 / 150) * 100, 100)}%`,
                  backgroundColor: pm10Info?.color || "#ccc",
                  height: "100%",
                }}
              ></div>
            </div>
            <p style={{ fontSize: "14px", color: pm10Info?.color || "#555", marginTop: "5px" }}>
              {weather.pm10 || "데이터 없음"}㎍/㎥ ({pm10Info?.status || "알 수 없음"})
            </p>
          </li>
          <li><strong>강수량:</strong> {weather.precipitation || "데이터 없음"}</li>
        </ul>
      ) : (
        <p style={{ color: "#999", fontSize: "16px" }}>날씨 데이터 없음</p>
      )}
    </div>
  );
}

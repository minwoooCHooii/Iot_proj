import axios from "axios";

export async function fetchWeatherData(location: string) {
  const url = `/api/proxy?location=${encodeURIComponent(location)}`;
  console.log(`🌤️ 날씨 데이터 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    console.log(`✅ ${location} 응답 데이터:`, xmlData); // 응답 데이터 출력

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    const weatherNode = xmlDoc.querySelector("WEATHER_STTS");
    if (!weatherNode) {
      console.warn(`⚠️ ${location} 날씨 데이터 없음`);
      return {
        weatherStatus: "데이터 없음",
        temp: 0,
        sensibleTemp: 0,
        maxTemp: 0,
        minTemp: 0,
        humidity: 0,
        pm10: 0,
        precipitation: "없음",
      };
    }

    const weatherData = {
      weatherStatus: weatherNode.querySelector("PCP_MSG")?.textContent || "없음",
      temp: parseFloat(weatherNode.querySelector("TEMP")?.textContent || "0"),
      sensibleTemp: parseFloat(weatherNode.querySelector("SENSIBLE_TEMP")?.textContent || "0"),
      maxTemp: parseFloat(weatherNode.querySelector("MAX_TEMP")?.textContent || "0"),
      minTemp: parseFloat(weatherNode.querySelector("MIN_TEMP")?.textContent || "0"),
      humidity: parseFloat(weatherNode.querySelector("HUMIDITY")?.textContent || "0"),
      pm10: parseFloat(weatherNode.querySelector("PM10")?.textContent || "0"),
      precipitation: weatherNode.querySelector("PRECIPITATION")?.textContent || "없음",
    };

    return weatherData;
  } catch (error) {
    console.error(`❌ ${location} 날씨 데이터 요청 실패:`, error);
    return {
      weatherStatus: "요청 실패",
      temp: 0,
      sensibleTemp: 0,
      maxTemp: 0,
      minTemp: 0,
      humidity: 0,
      pm10: 0,
      precipitation: "없음",
    };
  }
}

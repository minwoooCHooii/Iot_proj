import axios from "axios";

export async function fetchWeatherData(location: string) {
  const url = `/api/proxy?areaName=${encodeURIComponent(location)}`;
  console.log(`🌤️ 날씨 데이터 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    const weatherNode = xmlDoc.querySelector("WEATHER_STTS");
    if (!weatherNode) {
      console.warn(`⚠️ ${location}: 날씨 데이터 없음`);
      return null;
    }

    const weatherData = {
      location,
      weatherStatus: weatherNode.querySelector("PCP_MSG")?.textContent || "데이터 없음",
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
    return null;
  }
}

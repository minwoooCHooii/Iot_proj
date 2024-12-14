import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "발급받은 API KEY를 입력하세요";
const SERVICE = "citydata";

export async function fetchWeatherData(location: string) {
  const url = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/1/5/${location}`;
  console.log(`🌤️ 날씨 데이터 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    const weatherNode = xmlDoc.querySelector("WEATHER_STTS");
    if (!weatherNode) {
      console.error(`❌ ${location} 날씨 데이터 없음`);
      return null;
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
    if (error instanceof Error) {
      console.error(`❌ ${location} 날씨 데이터 요청 실패:`, error.message);
    } else {
      console.error(`❌ ${location} 알 수 없는 에러 발생:`, error);
    }
    return null;
  }
}

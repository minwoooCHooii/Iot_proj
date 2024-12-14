import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.API_KEY || "발급받은 API KEY를 입력하세요";
const SERVICE = "citydata";
const START_INDEX = 1;
const END_INDEX = 5;

const LOCATIONS: string[] = [
  "명동 관광특구",
  "이태원 관광특구",
  "강남역",
  "서울식물원·마곡나루역",
  "혜화역",
  "낙산공원·이화마을",
  "덕수궁길·정동길",
  "인사동",
  "해방촌·경리단길",
  "남산공원",
  "뚝섬한강공원",
  "서울대공원",
  "서울숲공원",
  "여의도한강공원",
];

const CHUNK_SIZE = 10; // 한 번에 실행할 최대 요청 수

const fetchLocationData = async (AREA_NM: string) => {
  const url = `/api/proxy?areaName=${encodeURIComponent(AREA_NM)}`;
  //console.log(`🔗 실제 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    //console.log(`🔍 ${AREA_NM}의 전체 API 응답 데이터:`, response.data);

    const xmlData = response.data;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    //console.log(`🔎 ${AREA_NM} 파싱된 XML 구조:`, new XMLSerializer().serializeToString(xmlDoc));

    const livePopulationNode = xmlDoc.querySelector("LIVE_PPLTN_STTS");
    if (!livePopulationNode) {
      //console.warn(`⚠️ ${AREA_NM}: LIVE_PPLTN_STTS 태그가 없습니다. 응답 구조를 확인하세요.`);
      return {
        location: AREA_NM,
        latitude: 0,
        longitude: 0,
        populationRates: {},
        totalPopulation: 0,
        message: "해당 지역에 실시간 인구 데이터가 제공되지 않습니다.",
      };
    }

    const populationRates = {
      "0대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_0")?.textContent || "0"),
      "10대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_10")?.textContent || "0"),
      "20대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_20")?.textContent || "0"),
      "30대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_30")?.textContent || "0"),
      "40대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_40")?.textContent || "0"),
      "50대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_50")?.textContent || "0"),
      "60대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_60")?.textContent || "0"),
      "70대": parseFloat(livePopulationNode.querySelector("PPLTN_RATE_70")?.textContent || "0"),
    };

    const totalPopulation = parseInt(
      livePopulationNode.querySelector("AREA_PPLTN_MAX")?.textContent || "0",
      10
    );

    const latitude = parseFloat(livePopulationNode.querySelector("LAT")?.textContent || "0");
    const longitude = parseFloat(livePopulationNode.querySelector("LNG")?.textContent || "0");

    return {
      location: AREA_NM,
      latitude,
      longitude,
      populationRates,
      totalPopulation,
    };
  } catch (error) {
    console.error(`❌ ${AREA_NM} 요청 실패:`, error);
    return {
      location: AREA_NM,
      message: "데이터 요청 중 오류가 발생했습니다.",
    };
  }
};

const fetchChunkedData = async (locations: string[], chunkSize: number) => {
  const results = [];
  for (let i = 0; i < locations.length; i += chunkSize) {
    const chunk = locations.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(fetchLocationData));
    results.push(...chunkResults.filter((result) => result !== null));
    console.log(`✅ ${i + chunk.length}/${locations.length} 요청 완료`);
  }
  return results;
};

export async function fetchPopulationData() {
  return await fetchChunkedData(LOCATIONS, CHUNK_SIZE);
}

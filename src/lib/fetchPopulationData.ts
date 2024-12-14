import axios from "axios";

const LOCATIONS: string[] = [
  "명동 관광특구",
  "이태원 관광특구",
  "강남역",
  "고덕역",
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

// 특정 장소에 대한 데이터 가져오기 함수
const fetchLocationData = async (areaName: string) => {
  const url = `/api/proxy?areaName=${encodeURIComponent(areaName)}`;
  console.log(`🔗 프록시 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    console.log(`✅ ${areaName} 응답 데이터:`, xmlData); // API 응답 출력

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    // 결과 코드 확인
    const resultCode = xmlDoc.querySelector("RESULT > CODE")?.textContent;
    const resultMessage = xmlDoc.querySelector("RESULT > MESSAGE")?.textContent;

    if (resultCode !== "INFO-000") {
      console.warn(`⚠️ ${areaName} 요청 실패: ${resultMessage}`);
      return {
        location: areaName,
        latitude: 0,
        longitude: 0,
        populationRates: {},
        totalPopulation: 0,
      };
    }

    const livePopulationNode = xmlDoc.querySelector("LIVE_PPLTN_STTS");
    if (!livePopulationNode) {
      console.warn(`⚠️ ${areaName} 데이터 없음: LIVE_PPLTN_STTS 태그가 없습니다.`);
      return {
        location: areaName,
        latitude: 0,
        longitude: 0,
        populationRates: {},
        totalPopulation: 0,
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
      location: areaName,
      latitude,
      longitude,
      populationRates,
      totalPopulation,
    };
  } catch (error) {
    console.error(`❌ ${areaName} 요청 실패:`, error);
    return {
      location: areaName,
      latitude: 0,
      longitude: 0,
      populationRates: {},
      totalPopulation: 0,
    };
  }
};

// 청크 단위로 API 호출 실행 함수
const fetchChunkedData = async (locations: string[], chunkSize: number) => {
  const results = [];

  for (let i = 0; i < locations.length; i += chunkSize) {
    const chunk = locations.slice(i, i + chunkSize);

    // 현재 청크의 모든 요청 병렬 실행
    const chunkResults = await Promise.all(chunk.map(fetchLocationData));

    // 유효한 결과만 저장
    results.push(...chunkResults.filter((result) => result !== null));

    console.log(`✅ ${i + chunk.length}/${locations.length} 요청 완료`);
  }

  return results;
};

// 전체 인구 데이터 가져오기 함수
export async function fetchPopulationData() {
  return await fetchChunkedData(LOCATIONS, CHUNK_SIZE);
}

import axios from "axios";

const LOCATIONS = [
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

const CHUNK_SIZE = 5; // 한 번에 실행할 최대 요청 수

const fetchLocationData = async (location: string) => {
  const url = `/api/proxy?location=${encodeURIComponent(location)}`;
  console.log(`🔗 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    const livePopulationNode = xmlDoc.querySelector("LIVE_PPLTN_STTS");
    if (livePopulationNode) {
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

      return {
        location,
        populationRates,
        totalPopulation,
      };
    } else {
      console.error(`❌ ${location} 처리 실패: LIVE_PPLTN_STTS 태그 없음`);
      return null;
    }
  } catch (error) {
    console.error(`❌ ${location} 요청 실패:`, error);
    return null;
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

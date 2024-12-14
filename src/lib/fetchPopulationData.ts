import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "발급받은 API KEY를 입력하세요";
const SERVICE = "citydata";
const START_INDEX = 1;
const END_INDEX = 5;

const LOCATIONS: string[] = [
  //"강남 MICE 관광특구",
  //"동대문 관광특구",
  "명동 관광특구",
  "이태원 관광특구",
  //"잠실 관광특구",
  //"종로·청계 관광특구",
  //"홍대 관광특구",
  //"경복궁",
  //"광화문·덕수궁",
  //"보신각",
  //"서울 암사동 유적",
  //"창덕궁·종묘",
  //"가산디지털단지역",
  "강남역",
  //"건대입구역",
  "고덕역",
  //"고속터미널역",
  //"교대역",
  //"구로디지털단지역",
  //"구로역",
  //"군자역",
  //"남구로역",
  //"대림역",
  //"동대문역",
  //"뚝섬역",
  //"미아사거리역",
  //"발산역",
  //"북한산우이역",
  //"사당역",
  //"삼각지역",
  //"서울대입구역",
  "서울식물원·마곡나루역",
  //"서울역",
  //"선릉역",
  //"성신여대입구역",
  //"수유역",
  //"신논현역·논현역",
  //"신도림역",
  //"신림역",
  //"신촌·이대역",
  //"양재역",
  //"역삼역",
  //"연신내역",
  //"오목교역·목동운동장",
  //"왕십리역",
  //"용산역",
  //"이태원역",
  //"장지역",
  //"장한평역",
  //"천호역",
  //"총신대입구(이수)역",
  //"충정로역",
  //"합정역",
  "혜화역",
  //"홍대입구역(2호선)",
  //"회기역",
  //"4·19 카페거리",
  //"가락시장",
  //"가로수길",
  //"광장(전통)시장",
  //"김포공항",
  "낙산공원·이화마을",
  //"노량진",
  "덕수궁길·정동길",
  //"방배역 먹자골목",
  //"북촌한옥마을",
  //"서촌",
  //"성수카페거리",
  //"수유리 먹자골목",
  //"쌍문동 맛집거리",
  //"압구정로데오거리",
  //"여의도",
  //"연남동",
  //"영등포 타임스퀘어",
  //"외대앞",
  //"용리단길",
  //"이태원 앤틱가구거리",
  "인사동",
  //"창동 신경제 중심지",
  //"청담동 명품거리",
  //"청량리 제기동 일대 전통시장",
  "해방촌·경리단길",
  //"DDP(동대문디자인플라자)",
  //"DMC(디지털미디어시티)",
  //"강서한강공원",
  //"고척돔",
  //"광나루한강공원",
  //"광화문광장",
  //"국립중앙박물관·용산가족공원",
  //"난지한강공원",
  "남산공원",
  //"노들섬",
  "뚝섬한강공원",
  //"망원한강공원",
  //"반포한강공원",
  //"북서울꿈의숲",
  //"불광천",
  //"서리풀공원·몽마르뜨공원",
  //"서울광장",
  "서울대공원",
  "서울숲공원",
  //"아차산",
  //"양화한강공원",
  //"어린이대공원",
  "여의도한강공원",
  //"월드컵공원",
  //"응봉산",
  //"이촌한강공원",
  //"잠실종합운동장",
  //"잠실한강공원",
  //"잠원한강공원",
  //"청계산",
  //"청와대",
  //"북창동 먹자골목",
  //"남대문시장",
  //"익선동",
  
];

const CHUNK_SIZE = 10; // 한 번에 실행할 최대 요청 수

// 특정 장소에 대한 데이터 가져오기 함수
const fetchLocationData = async (AREA_NM: string) => {
  // Next.js API 라우트를 통해 요청
  const url = `/api/proxy?areaName=${encodeURIComponent(AREA_NM)}`;

  console.log(`🔗 API 요청 URL 1 : ${url}`);

  try {
    const response = await axios.get(url); // Next.js API 라우트로 요청
    const xmlData = response.data;

    // XML 데이터 파싱 로직은 그대로 유지
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

      const latitude = parseFloat(livePopulationNode.querySelector("LAT")?.textContent || "0");
      const longitude = parseFloat(livePopulationNode.querySelector("LNG")?.textContent || "0");

      return {
        location: AREA_NM,
        latitude,
        longitude,
        populationRates,
        totalPopulation,
      };
    } else {
      console.error(`❌ ${AREA_NM} 처리 실패: LIVE_PPLTN_STTS 태그 없음`);
      return null;
    }
  } catch (error) {
    console.error(`❌ ${AREA_NM} 요청 실패:`, error);
    return null;
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
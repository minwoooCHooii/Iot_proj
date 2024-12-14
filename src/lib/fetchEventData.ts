import axios from "axios";

export async function fetchEventData(location: string) {
  const url = `/api/proxy?areaName=${encodeURIComponent(location)}`;
  console.log(`📊 이벤트 데이터 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    const eventNodes = xmlDoc.querySelectorAll("EVENT_STTS");
    if (!eventNodes.length) {
      console.warn(`⚠️ ${location}: 이벤트 데이터 없음`);
      return [];
    }

    const events = Array.from(eventNodes).map((node) => ({
      eventName: node.querySelector("EVENT_NM")?.textContent || "정보 없음",
      eventPlace: node.querySelector("EVENT_PLACE")?.textContent || "정보 없음",
      eventPeriod: node.querySelector("EVENT_PERIOD")?.textContent || "정보 없음",
      thumbnail: node.querySelector("THUMBNAIL")?.textContent || "",
      url: node.querySelector("URL")?.textContent || "#",
      coordinates: [
        parseFloat(node.querySelector("EVENT_X")?.textContent || "0"),
        parseFloat(node.querySelector("EVENT_Y")?.textContent || "0"),
      ],
    }));

    return events;
  } catch (error) {
    console.error(`❌ ${location} 이벤트 데이터 요청 실패:`, error);
    return [];
  }
}

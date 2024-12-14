import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BASE_URL = "http://openapi.seoul.go.kr:8088";
// 서버 사이드 전용 API_KEY 환경 변수를 사용하기를 권장 (예: API_KEY)
const API_KEY = process.env.API_KEY; // NEXT_PUBLIC_ 사용 지양
const SERVICE = "citydata";
const START_INDEX = 1;
const END_INDEX = 5;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { areaName } = req.query;
  if (typeof areaName !== 'string') {
    return res.status(400).json({ error: "areaName query parameter is required." });
  }

  // 최종 호출 URL을 콘솔에 출력
  const finalUrl = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/${START_INDEX}/${END_INDEX}/${encodeURIComponent(areaName)}`;
  console.log("🔎 Proxy Request URL:", finalUrl);
  console.log("🔎 Current API_KEY:", API_KEY);

  try {
    const response = await axios.get(finalUrl);
    res.status(200).send(response.data);
  } catch (error: any) {
    console.error("❌ Proxy Request Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}

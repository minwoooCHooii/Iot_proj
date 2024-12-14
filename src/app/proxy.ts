import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://openapi.seoul.go.kr:8088"; // HTTPS를 지원하지 않는 API URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { areaName } = req.query;

  if (!areaName || typeof areaName !== "string") {
    res.status(400).json({ error: "Invalid areaName parameter" });
    return;
  }

  const url = `${BASE_URL}/${API_KEY}/xml/citydata/1/5/${encodeURIComponent(areaName.trim())}`;
  console.log(`🔗 실제 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    res.status(200).send(response.data); // API 응답 데이터를 그대로 반환
  } catch (error) {
    console.error("❌ API 요청 실패:", error);
    res.status(500).json({ error: "Failed to fetch data from API" });
  }
}

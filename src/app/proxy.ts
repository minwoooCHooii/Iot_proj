import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "발급받은 API KEY를 입력하세요";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { location } = req.query;

  if (!location || typeof location !== "string") {
    res.status(400).json({ error: "Invalid location parameter" });
    return;
  }

  const url = `${BASE_URL}/${API_KEY}/xml/citydata/1/5/${encodeURIComponent(location)}`;
  console.log(`🔗 Proxy API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    res.status(200).send(response.data); // API 데이터를 그대로 반환
  } catch (error) {
    console.error("❌ Proxy API 요청 실패:", error);
    res.status(500).json({ error: "Failed to fetch data from API" });
  }
}

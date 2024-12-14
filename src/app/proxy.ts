import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// 환경 변수로부터 API URL과 KEY를 가져옵니다.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "발급받은 API KEY를 입력하세요";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { areaName } = req.query;

  // areaName이 올바르게 전달되었는지 확인
  if (!areaName || typeof areaName !== "string") {
    res.status(400).json({ error: "Invalid areaName parameter" });
    return;
  }

  // 실제 API 요청 URL 생성
  const url = `${BASE_URL}/${API_KEY}/xml/citydata/1/5/${encodeURIComponent(areaName)}`;
  console.log(`🔗 실제 API 요청 URL: ${url}`); // 디버깅용 로그

  try {
    // 외부 API 요청
    const response = await axios.get(url);

    // 응답 데이터 전달
    res.status(200).send(response.data);
  } catch (error) {
    console.error("❌ 프록시 API 요청 실패:", error);
    res.status(500).json({ error: "Failed to fetch data from API" });
  }
}

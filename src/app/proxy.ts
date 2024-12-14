import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BASE_URL = "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "발급받은 API KEY를 입력하세요";
const SERVICE = "citydata";
const START_INDEX = 1;
const END_INDEX = 5;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { areaName } = req.query;
  if (typeof areaName !== 'string') {
    return res.status(400).json({ error: "areaName query parameter is required." });
  }

  const url = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/${START_INDEX}/${END_INDEX}/${encodeURIComponent(areaName)}`;
  try {
    const response = await axios.get(url);
    console.log(url)
    res.status(200).send(response.data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}

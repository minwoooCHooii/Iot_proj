import axios from "axios";

export default async function handler(req, res) {
  const { area } = req.query;
  const BASE_URL = "https://openapi.seoul.go.kr:8088";
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const SERVICE = "citydata";
  const START_INDEX = 1;
  const END_INDEX = 5;

  const url = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/${START_INDEX}/${END_INDEX}/${area}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

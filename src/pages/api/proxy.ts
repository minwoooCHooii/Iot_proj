import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.API_KEY;
const SERVICE = "citydata";
const START_INDEX = 1;
const END_INDEX = 5;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { areaName } = req.query;

  if (typeof areaName !== "string") {
    console.error("Invalid areaName query parameter:", areaName);
    return res.status(400).json({ error: "areaName query parameter is required." });
  }

  const finalUrl = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/${START_INDEX}/${END_INDEX}/${encodeURIComponent(areaName)}`;
  console.log("Final Request URL:", finalUrl);

  try {
    const response = await axios.get(finalUrl);
    console.log("OpenAPI Response Data:", response.data);
    res.status(200).send(response.data);
  } catch (error: any) {
    console.error("Error during API Request:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    }
    res.status(500).json({
      error: "Failed to fetch data from OpenAPI",
      details: error.message,
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;

  try {
    const apiUrl = `https://your-secure-api.com/${endpoint}`; // HTTPS 사용
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${apiUrl}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  }  catch (error: any) {
    console.error(`Error fetching data: ${error.message}`);
  }
}

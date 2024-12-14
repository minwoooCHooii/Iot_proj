import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;

  const response = await fetch(`http://your-insecure-api.com/${endpoint}`);
  const data = await response.json();

  res.status(200).json(data);
}

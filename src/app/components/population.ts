// src/pages/api/population.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const KEY = process.env.NEXT_PUBLIC_API_KEY || 'YOUR_API_KEY';
  const FORMAT = 'xml';
  const SERVICE = 'citydata';
  const START_INDEX = 1;
  const END_INDEX = 10;
  const AREA_NM = '강남역';

  const url = `http://openapi.seoul.go.kr:8088/${KEY}/${FORMAT}/${SERVICE}/${START_INDEX}/${END_INDEX}/${AREA_NM}`;

  try {
    const response = await axios.get(url);
    console.log('API Response Status:', response.status);

    // XML -> JSON 변환
    const jsonData = await parseStringPromise(response.data);

    // 데이터 추출 및 가공
    const LIVE_PPLTN_STTS = jsonData.RESULT?.LIVE_PPLTN_STTS?.row || [];
    const data = LIVE_PPLTN_STTS.map((item: any) => ({
      AREA_PPLTN_MIN: item.AREA_PPLTN_MIN?.[0],
      AREA_PPLTN_MAX: item.AREA_PPLTN_MAX?.[0],
      MALE_PPLTN_RATE: item.MALE_PPLTN_RATE?.[0],
      FEMALE_PPLTN_RATE: item.FEMALE_PPLTN_RATE?.[0],
      PPLTN_TIME: item.PPLTN_TIME?.[0],
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from API' });
  }
}

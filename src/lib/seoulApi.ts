import axios from 'axios';
import xml2js from 'xml2js';

export async function fetchPopulationData() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const SERVICE = 'citydata';
  const START_INDEX = 1;
  const END_INDEX = 10;
  const AREA_NM = '강남역';

  const url = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/${START_INDEX}/${END_INDEX}/${AREA_NM}`;

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    // XML -> JSON 변환
    const jsonData = await xml2js.parseStringPromise(xmlData, { explicitArray: false });
    return jsonData;
  } catch (error) {
    console.error('Error fetching population data:', error);
    throw error;
  }
}

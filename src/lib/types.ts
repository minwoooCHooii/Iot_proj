export type PopulationRates = {
  "0대": number;
  "10대": number;
  "20대": number;
  "30대": number;
  "40대": number;
  "50대": number;
  "60대": number;
  "70대": number;
  [key: string]: number; // 인덱스 시그니처 추가
};

export interface PopulationData {
  location: string;
  populationRates: PopulationRates;
  totalPopulation: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
}

export interface Event {
  eventName: string;
  eventPlace: string;
  eventPeriod: string;
  thumbnail: string;
  url: string;
}

export interface LocationData {
  location: string;
  populationRates: PopulationRates;
  totalPopulation: number;
  congestionLevel: string;
  weather: WeatherData | null;
}

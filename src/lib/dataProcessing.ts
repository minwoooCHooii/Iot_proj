export function getTop10ByPopulation(data: { location: string; populationRates: Record<string, number>; totalPopulation: number }[]) {
    // 인구 데이터를 총 인구를 기준으로 정렬
    return data
      .sort((a, b) => b.totalPopulation - a.totalPopulation)
      .slice(0, 10); // 상위 10개만 반환
  }
  
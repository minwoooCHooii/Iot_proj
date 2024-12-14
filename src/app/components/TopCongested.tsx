type TopCongestedProps = {
    data: {
      location: string;
      congestionLevel: string;
      congestionMessage: string;
    }[];
  };
  
  export default function TopCongested({ data }: TopCongestedProps) {
    // 혼잡도 레벨 기준으로 상위 10개 추출
    const top10 = [...data]
      .sort((a, b) => b.congestionLevel.localeCompare(a.congestionLevel)) // 높은 혼잡도 순
      .slice(0, 10);
  
    return (
      <div>
        <h3>가장 혼잡한 지역 10개</h3>
        <ul>
          {top10.map((item, index) => (
            <li key={index}>
              <strong>{item.location}</strong>: {item.congestionMessage} (혼잡도: {item.congestionLevel})
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
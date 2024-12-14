import React from "react";

interface RecommendationProps {
  data: {
    location: string;
    populationRates: Record<string, number>;
    totalPopulation: number;
  }[];
}

const Recommendation: React.FC<RecommendationProps> = ({ data }) => {
  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
        추천 문화행사
      </h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "10px",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#f9f9f9",
              minWidth: "300px", // 카드의 최소 너비 설정
              flex: "0 0 auto", // 가로 스크롤을 위해 카드 고정 너비
            }}
          >
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#005b96" }}>
              {item.location}
            </h3>
            <p>
              <strong>총 인구:</strong> {item.totalPopulation.toLocaleString()}명
            </p>
            <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
              {Object.entries(item.populationRates).map(([ageGroup, percentage]) => (
                <li key={ageGroup}>
                  <strong>{ageGroup}:</strong> {percentage}%
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;

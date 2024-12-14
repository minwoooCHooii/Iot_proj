'use client';

interface EventCardProps {
  eventName: string;
  eventPlace: string;
  eventPeriod: string;
  thumbnail: string;
  url: string;
}

export default function EventCard({
  eventName = "이벤트 이름 없음", // 기본 값 추가
  eventPlace = "장소 정보 없음", // 기본 값 추가
  eventPeriod = "기간 정보 없음", // 기본 값 추가
  thumbnail = "/default-thumbnail.png", // 기본 썸네일 이미지
  url = "#", // 기본 URL
}: EventCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "16px",
        width: "300px",
        minWidth: "300px",
        height: "400px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <img
        src={thumbnail}
        alt={`${eventName} 썸네일`}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <h2 style={{ fontSize: "20px", margin: "12px 0", color: "#333", fontWeight: "bold" }}>
        {eventName}
      </h2>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}>
        <strong>장소:</strong> {eventPlace}
      </p>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
        <strong>기간:</strong> {eventPeriod}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#007BFF",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "bold",
          display: "inline-block",
          padding: "8px 12px",
          border: "1px solid #007BFF",
          borderRadius: "4px",
          backgroundColor: "#fff",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#007BFF") &&
          (e.currentTarget.style.color = "#fff")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#fff") &&
          (e.currentTarget.style.color = "#007BFF")
        }
      >
        행사 정보 보기
      </a>
    </div>
  );
}

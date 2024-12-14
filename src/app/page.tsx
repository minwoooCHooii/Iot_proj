'use client';

// page.tsx
import { useEffect, useState, useRef } from "react";
import { fetchPopulationData } from "@/lib/fetchPopulationData";
import { fetchWeatherData } from "@/lib/fetchWeatherData";
import { fetchEventData } from "@/lib/fetchEventData";

import WeatherCard from "@/app/components/WeatherCard";
import EventCard from "@/app/components/EventCard";
import Map from "@/app/components/Map";

interface Event {
  eventName: string;
  eventPlace: string;
  eventPeriod: string;
  thumbnail: string;
  url: string;
  coordinates: number[];
}

export default function HomePage() {
  const [topLocations, setTopLocations] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<{ location: string; events: Event[] }[]>([]);
  const [loading, setLoading] = useState(true);

  const hasLoaded = useRef(false);

  useEffect(() => {
    async function loadData() {
      if (hasLoaded.current) return;
      hasLoaded.current = true;
  
      try {
        const populationData = await fetchPopulationData();
        console.log("🔍 populationData:", populationData);
  
        const sortedLocations = populationData
          .filter((location) => location?.totalPopulation !== undefined) // 유효한 데이터만
          .sort((a, b) => (b.totalPopulation || 0) - (a.totalPopulation || 0)) // undefined 방지
          .slice(0, 5);
  
        const weatherAndEvents = await Promise.all(
          sortedLocations.map(async (location) => {
            const weather = await fetchWeatherData(location.location).catch(() => null);
            const events = await fetchEventData(location.location).catch(() => []);
            return { location: location.location, weather, events };
          })
        );
  
        setTopLocations(
          weatherAndEvents.map((data) => ({
            location: data.location,
            totalPopulation:
              populationData.find((pop) => pop.location === data.location)?.totalPopulation || 0,
            weather: data.weather,
          }))
        );
  
        const uniqueEvents = removeDuplicateEvents(weatherAndEvents);
  
        setTopEvents(uniqueEvents);
      } catch (error) {
        console.error("❌ 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
  
    loadData();
  }, []);
  

  function removeDuplicateEvents(
    data: { location: string; events: Event[] }[]
  ): { location: string; events: Event[] }[] {
    const seenEvents = new Set<string>();
    return data.map((locationData) => {
      const uniqueEvents = locationData.events.filter((event) => {
        const eventKey = `${event.eventName}-${event.eventPlace}-${event.eventPeriod}`;
        if (seenEvents.has(eventKey)) return false;
        seenEvents.add(eventKey);
        return true;
      });
      return { location: locationData.location, events: uniqueEvents };
    });
  }

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#339" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 26px",
          backgroundColor: "#4A90E2",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px", fontWeight: "bold" }}>서울 도시 혼잡도 분석</span>
        </div>
      </nav>

      <div style={{ padding: "20px" }}>
        <Map data={[...topLocations, ...topEvents]} />
      </div>

      <h2 style={{ fontSize: "24px", marginBottom: "10px", textAlign: "center", color: "#000" }}>날씨 및 인구 정보</h2>
      <h2 style={{ fontSize: "12px", marginBottom: "20px", textAlign: "center", color: "gray" }}>인구 밀집 상위 5개 지역</h2>
      <div style={{ display: "flex", overflowX: "auto", gap: "20px", padding: "20px 0" }}>
        {topLocations.map((location, index) => (
          <WeatherCard
            key={index}
            location={location.location}
            totalPopulation={location.totalPopulation}
            weather={location.weather}
          />
        ))}
      </div>

      <h2 style={{ fontSize: "24px", margin: "40px 0 20px", textAlign: "center", color: "#000" }}>추천 문화행사</h2>
      <div>
        {topEvents.map((eventData, index) => (
          <div key={index} style={{ marginBottom: "40px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#000", fontWeight: "bold", textAlign: "center" }}>{eventData.location}</h3>
            <div style={{ display: "flex", overflowX: "auto", gap: "20px", padding: "20px 0" }}>
              {eventData.events.map((event, eventIndex) => (
                <EventCard
                  key={eventIndex}
                  eventName={event.eventName}
                  eventPlace={event.eventPlace}
                  eventPeriod={event.eventPeriod}
                  thumbnail={event.thumbnail}
                  url={event.url}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

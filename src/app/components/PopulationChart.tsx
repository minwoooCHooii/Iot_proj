import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PopulationChartProps {
  data: {
    location: string;
    totalPopulation: number;
    populationRates: Record<string, number>;
  }[];
}

const PopulationChart: React.FC<PopulationChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.location),
    datasets: Object.keys(data[0].populationRates).map((ageGroup) => ({
      label: ageGroup,
      data: data.map((item) => item.populationRates[ageGroup]),
      backgroundColor: getRandomColor(),
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "장소별 연령대별 인구 비율" },
    },
  };

  return <Bar options={options} data={chartData} />;
};

// 랜덤 색상을 생성하는 유틸 함수
const getRandomColor = () =>
  `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, 0.5)`;

export default PopulationChart;

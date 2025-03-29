import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Data contoh perkembangan anak (Line Chart)
const growthData = {
  labels: ["0 Bulan", "3 Bulan", "6 Bulan", "9 Bulan", "12 Bulan"],
  datasets: [
    {
      label: "Tinggi Badan (cm)",
      data: [50, 60, 68, 72, 80],
      borderColor: "#ff6384",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      label: "Berat Badan (kg)",
      data: [3.5, 5.8, 7.2, 8.5, 9.8],
      borderColor: "#36a2eb",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
    {
      label: "Lingkar Kepala (cm)",
      data: [35, 38, 40, 42, 44],
      borderColor: "#ffcd56",
      backgroundColor: "rgba(255, 205, 86, 0.2)",
    },
    {
      label: "Lingkar Lengan (cm)",
      data: [10, 12, 13, 14, 15],
      borderColor: "#4bc0c0",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  ],
};

const growthOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Perkembangan Anak Secara Individual" },
  },
};

// Data perbandingan kondisi anak dalam satu kelompok (Bar Chart)
const groupComparisonData = {
  labels: ["Anak A", "Anak B", "Anak C", "Anak D"],
  datasets: [
    {
      label: "Tinggi Badan (cm)",
      data: [80, 75, 82, 78],
      backgroundColor: "#ff6384",
    },
    {
      label: "Berat Badan (kg)",
      data: [9.8, 9.2, 10.1, 9.5],
      backgroundColor: "#36a2eb",
    },
    {
      label: "Lingkar Kepala (cm)",
      data: [44, 43, 45, 44],
      backgroundColor: "#ffcd56",
    },
    {
      label: "Lingkar Lengan (cm)",
      data: [15, 14, 16, 15],
      backgroundColor: "#4bc0c0",
    },
  ],
};

const groupComparisonOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Perbandingan Kondisi Anak dalam Satu Kelompok" },
  },
};

const MultiGroupChart: React.FC = () => {
  return (
    <div>
      <Line data={growthData} options={growthOptions} />
      <div style={{ marginTop: "40px" }}>
        <Bar data={groupComparisonData} options={groupComparisonOptions} />
      </div>
    </div>
  );
};

export default MultiGroupChart;

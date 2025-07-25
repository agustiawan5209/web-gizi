import { Chart as ChartJs, CategoryScale, Legend, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// Definisikan tipe untuk props
interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string; // Change this to a single string
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    };
    title?: string; // Opsional: judul chart
}

const LineChart: React.FC<BarChartProps> = ({ data, title }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: !!title, // Tampilkan judul hanya jika ada
                text: title,
            },
        },
        cutout: '50%',
    };

    return <Bar data={data} options={options} className="h-64 w-72" />;
};
export default LineChart;

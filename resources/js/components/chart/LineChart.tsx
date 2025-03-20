import { CategoryScale, Chart as ChartJs, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Definisikan tipe untuk props
interface LineChartProps {
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

const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
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

    return <Line data={data} options={options} className="h-64 w-72" />;
};
export default LineChart;

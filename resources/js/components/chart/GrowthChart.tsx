import useAsyncData from '@/hooks/use-asyncdata';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { Line } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Dataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    tension?: number;
}

interface ChartData {
    labels: string[];
    datasets: Dataset[] | any; // Tambahkan 'any' sebagai fallback
}

interface GrowthProps {
    url: string;
    title?: string;
}

const GrowthChart: React.FC<GrowthProps> = ({ url, title }) => {
    const { data: chartData, loading, error } = useAsyncData<ChartData>(url);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: !!title,
                text: title,
            },
        },
    };

    if (loading)
        return (
            <div className="flex justify-center py-4 text-center">
                <LoaderCircle />
            </div>
        );
    if (error) return <div className="py-4 text-center text-red-500">{error}</div>;
    if (!chartData) return <div className="py-4 text-center">Tidak ada data</div>;

    // Fungsi untuk mengkonversi data ke format yang benar
    const normalizeChartData = (data: any): ChartData => {
        // Jika datasets sudah dalam format yang benar
        if (Array.isArray(data.datasets)) {
            return data;
        }
        // Jika format data berbeda, lakukan transformasi
        return {
            labels: data.labels || [],
            datasets: Object.values(data.datasets).map((item: any, key) => {
                const pattern = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`
                const color = `rgb(${pattern}, 0.8)`;
                const color2 = `rgba(${pattern}, 0.2)`
                return {
                    label: item.label,
                    data: item.data,
                    borderColor: color,
                    backgroundColor: color2,
                    tension: 0.1,
                    yAxisID: 'y',
                };
            }),
        };
    };

    try {
        const normalizedData = normalizeChartData(chartData);

        if (!normalizedData.labels || !normalizedData.datasets || normalizedData.datasets.length === 0) {
            console.error('Data chart tidak valid:', normalizedData);
            return <div className="py-4 text-center">Format data tidak valid</div>;
        }

        return (
            <div className="h-[400px] w-full">
                <Line options={options} data={normalizedData} />
            </div>
        );
    } catch (e) {
        console.error('Error rendering chart:', e);
        return <div className="py-4 text-center text-red-500">Gagal menampilkan chart</div>;
    }
};

export default GrowthChart;

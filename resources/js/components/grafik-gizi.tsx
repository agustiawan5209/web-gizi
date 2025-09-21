import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define types
interface NutritionData {
    tahun: number;
    gizi_buruk: number;
    gizi_kurang: number;
    gizi_baik: number;
    gizi_lebih: number;
}

const GrafikGizi = () => {
    const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from Laravel backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(route('api.get-dataset-data'));
                setNutritionData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Gagal memuat data');
                setLoading(false);
                console.error(err);
            }
        };

        fetchData();
    }, []);

    // Prepare data for chart
    const chartData = {
        labels: nutritionData.map((item) => item.tahun.toString()),
        datasets: [
            {
                label: 'Gizi Buruk',
                data: nutritionData.map((item) => item.gizi_buruk),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
            },
            {
                label: 'Gizi Kurang',
                data: nutritionData.map((item) => item.gizi_kurang),
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: 'rgba(249, 115, 22, 1)',
                borderWidth: 1,
            },
            {
                label: 'Gizi Baik',
                data: nutritionData.map((item) => item.gizi_baik),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
            },
            {
                label: 'Gizi Lebih',
                data: nutritionData.map((item) => item.gizi_lebih),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Rekap Pemeriksaan Status Gizi Balita per Tahun',
                font: {
                    size: 16,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Jumlah Balita',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Tahun',
                },
            },
        },
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-white p-6 shadow-md"
        >
            <h2 className="mb-6 text-center text-xl font-bold text-gray-800">Rekap Pemeriksaan Status Gizi Balita per Tahun</h2>

            <div className="mb-8">
                <Bar data={chartData} options={options} />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b px-4 py-3 text-left font-semibold">Tahun</th>
                            <th className="border-b px-4 py-3 text-right font-semibold">Gizi Buruk</th>
                            <th className="border-b px-4 py-3 text-right font-semibold">Gizi Kurang</th>
                            <th className="border-b px-4 py-3 text-right font-semibold">Gizi Baik</th>
                            <th className="border-b px-4 py-3 text-right font-semibold">Gizi Lebih</th>
                            <th className="border-b px-4 py-3 text-right font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nutritionData.map((item, index) => (
                            <motion.tr
                                key={item.tahun}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="border-b px-4 py-3">{item.tahun}</td>
                                <td className="border-b px-4 py-3 text-right">{item.gizi_buruk}</td>
                                <td className="border-b px-4 py-3 text-right">{item.gizi_kurang}</td>
                                <td className="border-b px-4 py-3 text-right">{item.gizi_baik}</td>
                                <td className="border-b px-4 py-3 text-right">{item.gizi_lebih}</td>
                                <td className="border-b px-4 py-3 text-right font-medium">
                                    {item.gizi_buruk + item.gizi_kurang + item.gizi_baik + item.gizi_lebih}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default GrafikGizi;

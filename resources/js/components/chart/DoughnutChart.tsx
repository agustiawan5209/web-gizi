import { Chart as ChartJs, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJs.register(ArcElement, Tooltip, Legend);

// Definisikan tipe untuk props
interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title?: string; // Opsional: judul chart
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
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

  return <Doughnut data={data} options={options} className="w-72 h-64" />;
};

export default DoughnutChart;

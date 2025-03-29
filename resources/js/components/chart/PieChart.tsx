import { Chart as ChartJs, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJs.register(ArcElement, Tooltip, Legend);

// Definisikan tipe untuk props
interface PieChartProps {
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

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
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
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;


import { ChartBar, ChartPie, ChartArea, Database } from 'lucide-react';

export const FiturPage = () => {
  const fiturs = [
    {
      title: 'Analisis Data Canggih',
      description: 'Gunakan algoritma mutakhir untuk menganalisis data kesehatan balita dengan akurasi tinggi',
      icon: <ChartBar className="text-blue-500 text-3xl" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Prediksi Inteligensi',
      description: 'Sistem prediksi berbasis AI untuk mengantisipasi kebutuhan kesehatan',
      icon: <ChartPie className="text-purple-500 text-3xl" />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Visualisasi Interaktif',
      description: 'Dashboard interaktif dengan berbagai opsi visualisasi data',
      icon: <ChartArea className="text-green-500 text-3xl" />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Manajemen Data Terpusat',
      description: 'Penyimpanan dan pengelolaan data terintegrasi dengan keamanan tinggi',
      icon: <Database className="text-orange-500 text-3xl" />,
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Fitur Unggulan</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Temukan bagaimana teknologi kami dapat membantu memantau kesehatan balita dengan lebih efektif
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {fiturs.map((fitur) => (
          <div
            key={fitur.title}
            className={`${fitur.bgColor} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300`}
          >
            <div className="p-8">
              <div className="mb-6">
                {fitur.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{fitur.title}</h3>
              <p className="text-gray-600">{fitur.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="/image/visual.png" // Ganti dengan path gambar
            alt="Data visualization"
            width={600}
            height={400}
            className="rounded-xl shadow-xl"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Teknologi Terdepan</h3>
          <p className="text-gray-600 mb-6">
            Kami menggunakan teknologi machine learning dan analisis data terkini untuk memberikan
            wawasan yang berharga tentang kesehatan dan perkembangan balita.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Algoritma prediksi akurat</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Visualisasi data interaktif</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Sistem notifikasi cerdas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

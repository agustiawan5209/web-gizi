

const AboutPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Hero Section */}
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl overflow-hidden mb-12">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative max-w-7xl mx-auto py-24 px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Tentang Proyek Kami
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl">
          Solusi digital inovatif untuk pemantauan kesehatan balita secara komprehensif
        </p>
      </div>
    </div>

    {/* Mission Section */}
    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
      <div>
        <img
          src="/image/logo.png" // Ganti dengan path gambar Anda
          alt="Baby care illustration"
          width={600}
          height={400}
          className="rounded-xl shadow-xl"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Misi Kami</h2>
        <p className="text-lg text-gray-600 mb-6">
          Kami berkomitmen untuk memberdayakan orang tua dan profesional kesehatan dengan alat digital
          yang membantu memantau perkembangan dan kesehatan balita secara real-time.
        </p>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <p className="text-blue-800 italic">
            "Setiap anak berhak mendapatkan perhatian kesehatan terbaik sejak dini"
          </p>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Fitur Utama
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Pelacakan Real-time",
            description: "Pantau kondisi kesehatan balita secara real-time",
            icon: "⏱️",
          },
          {
            title: "Pengingat Medis",
            description: "Notifikasi jadwal pemeriksaan dan vaksinasi",
            icon: "⏰",
          },
          {
            title: "Analisis Data",
            description: "Analisis perkembangan kesehatan yang terperinci",
            icon: "📊",
          },
          {
            title: "Antarmuka Responsif",
            description: "Akses mudah dari berbagai perangkat",
            icon: "📱",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default AboutPage;

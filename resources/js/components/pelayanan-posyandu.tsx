import React from 'react';
import { ClipboardList, UserPlus, LogIn, Ruler, ClipboardCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ServiceStep {
  id: number;
  title: string;
  description: string | React.ReactNode;
  icon: React.ReactNode;
}

const PelayananPosyandu: React.FC = () => {
  const serviceSteps: ServiceStep[] = [
    {
      id: 1,
      title: "Kunjungan ke Posyandu",
      description: "Orang tua/wali membawa balita ke Posyandu untuk pemeriksaan.",
      icon: <ClipboardList className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Registrasi Akun Pasien",
      description: (
        <div>
          <p className="mb-2">Jika belum memiliki akun, silakan daftar terlebih dahulu:</p>
          <Link
            href="/register"
            className="inline-flex items-center px-3 py-1 mb-2 mr-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Registrasi Akun Pasien
          </Link>
          <p className="mt-2">Jika sudah memiliki akun, silakan login:</p>
          <Link
            href="/login"
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login Akun Pasien
          </Link>
        </div>
      ),
      icon: <UserPlus className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Pengukuran Antropometri",
      description: "Petugas akan melakukan pengukuran data antropometri balita seperti: berat badan, tinggi badan, lingkar kepala, dan lingkar lengan.",
      icon: <Ruler className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "Hasil Pemeriksaan",
      description: "Hasil pemeriksaan akan ditampilkan melalui akun pasien dan juga dapat dilihat oleh petugas secara real-time melalui sistem.",
      icon: <ClipboardCheck className="w-6 h-6" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Alur Pelayanan Posyandu</h2>

      <div className="space-y-8">
        {serviceSteps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col md:flex-row gap-6 relative"
          >
            {/* Garis vertikal untuk step */}
            {index < serviceSteps.length - 1 && (
              <div className="hidden md:block absolute left-5 top-8 h-full w-0.5 bg-blue-200"></div>
            )}

            {/* Nomor step */}
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold relative z-10">
              {step.id}
            </div>

            {/* Konten step */}
            <div className="flex-1 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <span className="text-blue-600 mr-3">{step.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
              </div>
              <div className="text-gray-600 pl-9">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Catatan:</strong> Pastikan data yang dimasukkan saat registrasi sesuai dengan identitas balita untuk memudahkan proses pemeriksaan dan pemantauan gizi secara berkala.
        </p>
      </div>
    </div>
  );
};

export default PelayananPosyandu;

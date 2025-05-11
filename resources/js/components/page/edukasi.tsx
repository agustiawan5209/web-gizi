import React from 'react';

const EdukasiGiziAnak: React.FC = () => {
    return (
        <div className="mx-auto max-w-7xl p-6 text-gray-800">
            <h1 className="mb-6 text-center text-4xl font-bold text-green-700">Edukasi Gizi Anak</h1>

            <section className="mb-5 outline-1 outline-gray-300 shadow-md p-6 rounded-lg">
                <h2 className="mb-2 text-2xl font-semibold text-green-600">Pentingnya Gizi Anak</h2>
                <p className="text-base">
                    Gizi anak yang baik adalah fondasi utama dalam tumbuh kembang anak. Nutrisi yang seimbang dapat membantu meningkatkan daya tahan
                    tubuh, fungsi otak, pertumbuhan fisik, serta mencegah berbagai penyakit kronis di kemudian hari. Masa balita merupakan periode
                    emas (golden age) yang sangat menentukan kualitas hidup anak di masa depan.
                </p>
            </section>

            <section className="mb-5 outline-1 outline-gray-300 shadow-md p-6 rounded-lg">
                <h2 className="mb-2 text-2xl font-semibold text-green-600">Nutrisi Penting bagi Anak</h2>
                <ul className="list-inside list-disc space-y-2">
                    <li>
                        <strong>Karbohidrat:</strong> Sumber energi utama untuk aktivitas sehari-hari.
                    </li>
                    <li>
                        <strong>Protein:</strong> Penting untuk pertumbuhan jaringan tubuh dan otak.
                    </li>
                    <li>
                        <strong>Lemak sehat:</strong> Membantu perkembangan otak dan penyerapan vitamin.
                    </li>
                    <li>
                        <strong>Vitamin dan mineral:</strong> Seperti zat besi, kalsium, vitamin A, C, dan D untuk mendukung sistem imun dan
                        pertumbuhan tulang.
                    </li>
                    <li>
                        <strong>Air:</strong> Menjaga hidrasi dan mendukung fungsi organ tubuh.
                    </li>
                </ul>
            </section>

            <section className="mb-5 outline-1 outline-gray-300 shadow-md p-6 rounded-lg">
                <h2 className="mb-2 text-2xl font-semibold text-green-600">Dampak Kekurangan Gizi</h2>
                <p className="text-base">
                    Kekurangan gizi pada anak dapat menyebabkan stunting (pertumbuhan terhambat), penurunan kecerdasan, mudah sakit, serta gangguan
                    perkembangan fisik dan mental. Oleh karena itu, penting bagi orang tua dan masyarakat untuk memahami kebutuhan gizi anak dan
                    memenuhi asupan sehari-harinya.
                </p>
            </section>

            <section className="mb-5 outline-1 outline-gray-300 shadow-md p-6 rounded-lg">
                <h2 className="mb-2 text-2xl font-semibold text-green-600">Tips Memberikan Gizi Seimbang</h2>
                <ul className="list-inside list-disc space-y-2">
                    <li>Berikan makanan bergizi seimbang yang terdiri dari karbohidrat, protein, sayur, dan buah.</li>
                    <li>Hindari makanan cepat saji dan makanan tinggi gula serta garam.</li>
                    <li>Buat jadwal makan yang teratur, termasuk camilan sehat di antara waktu makan utama.</li>
                    <li>Libatkan anak dalam memilih dan menyiapkan makanan agar mereka lebih tertarik makan sehat.</li>
                    <li>Pastikan anak cukup minum air putih setiap hari.</li>
                </ul>
            </section>

            <section className="mb-5 outline-1 outline-gray-300 shadow-md p-6 rounded-lg">
                <h2 className="mb-2 text-2xl font-semibold text-green-600">Peran Orang Tua dan Masyarakat</h2>
                <p className="text-base">
                    Orang tua memiliki peran utama dalam memastikan anak mendapatkan asupan gizi yang baik. Selain itu, edukasi kepada masyarakat luas
                    juga penting agar tercipta lingkungan yang mendukung pola makan sehat, mulai dari rumah, sekolah, hingga fasilitas umum. Program
                    penyuluhan gizi, posyandu, dan media edukasi digital juga dapat dimanfaatkan untuk meningkatkan pengetahuan dan kesadaran
                    masyarakat.
                </p>
            </section>
        </div>
    );
};

export default EdukasiGiziAnak;

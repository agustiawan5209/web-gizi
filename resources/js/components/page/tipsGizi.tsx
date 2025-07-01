const tipsData = [
    {
        id: 1,
        title: 'Perbanyak Konsumsi Sayuran',
        description: 'Sayuran kaya akan serat dan vitamin yang penting untuk pertumbuhan anak dan kesehatan pencernaan.',
    },
    {
        id: 2,
        title: 'Cukupi Kebutuhan Air',
        description: 'Minumlah minimal 8 gelas air putih per hari untuk menjaga keseimbangan cairan tubuh.',
    },
    {
        id: 3,
        title: 'Sarapan Sehat Setiap Hari',
        description: 'Sarapan adalah sumber energi awal untuk memulai aktivitas, hindari makanan tinggi gula di pagi hari.',
    },
    {
        id: 4,
        title: 'Konsumsi Protein Berkualitas',
        description: 'Daging tanpa lemak, ikan, telur, dan kacang-kacangan penting untuk pertumbuhan otot dan jaringan tubuh.',
    },
];

const TipsGizi = () => {
    return (
        <div className="mx-auto mt-10 max-w-5xl">
            <section className="rounded-xl bg-green-50 px-4 py-8 shadow-md md:px-12">
                <h2 className="mb-6 text-2xl font-bold text-green-700">Info & Tips Gizi</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {tipsData.map((tip) => (
                        <div key={tip.id} className="rounded-lg border border-green-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                            <h3 className="text-lg font-semibold text-green-600">{tip.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{tip.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TipsGizi;

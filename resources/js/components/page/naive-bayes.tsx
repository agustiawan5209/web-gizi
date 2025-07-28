import { Activity, ArrowRight, Circle, Info, User } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';

type NutritionalStatus = 'Gizi Buruk' | 'Gizi Kurang' | 'Gizi Baik' | 'Gizi Lebih';

interface ChildData {
    age: number;
    gender: 'Laki-laki' | 'Perempuan';
    height: number;
    weight: number;
    headCircumference: number;
    armCircumference: number;
}

interface ProbabilityData {
    mean: number;
    stdDev: number;
}

interface NaiveBayesModel {
    [status: string]: {
        priorProbability: number;
        age: ProbabilityData;
        height: ProbabilityData;
        weight: ProbabilityData;
        headCircumference: ProbabilityData;
        armCircumference: ProbabilityData;
    };
}

const NaiveBayesNutritionClassifier: React.FC = () => {
    const [childData, setChildData] = useState<ChildData>({
        age: 2.5,
        gender: 'Laki-laki',
        height: 72,
        weight: 14.5,
        headCircumference: 45.5,
        armCircumference: 18.3,
    });

    const [result, setResult] = useState<{
        status: NutritionalStatus;
        probabilities: Record<NutritionalStatus, number>;
        calculations?: Record<
            NutritionalStatus,
            {
                prior: number;
                likelihoods: Record<string, number>;
                rawPosterior: number;
            }
        >;
    } | null>(null);

    const [showTheory, setShowTheory] = useState(false);
    const [showImplementation, setShowImplementation] = useState(true);
    const [showExample, setShowExample] = useState(false);

    // Model Naive Bayes yang sudah dilatih (contoh data)
    const trainedModel: NaiveBayesModel = {
        'Gizi Buruk': {
            priorProbability: 0.1,
            age: { mean: 3.2, stdDev: 1.5 },
            height: { mean: 85.4, stdDev: 5.2 },
            weight: { mean: 9.8, stdDev: 1.5 },
            headCircumference: { mean: 45.2, stdDev: 1.8 },
            armCircumference: { mean: 12.1, stdDev: 1.2 },
        },
        'Gizi Kurang': {
            priorProbability: 0.2,
            age: { mean: 4.1, stdDev: 1.8 },
            height: { mean: 92.7, stdDev: 6.1 },
            weight: { mean: 12.3, stdDev: 1.8 },
            headCircumference: { mean: 46.8, stdDev: 1.9 },
            armCircumference: { mean: 13.5, stdDev: 1.4 },
        },
        'Gizi Baik': {
            priorProbability: 0.6,
            age: { mean: 4.5, stdDev: 2.1 },
            height: { mean: 102.3, stdDev: 7.4 },
            weight: { mean: 16.2, stdDev: 2.5 },
            headCircumference: { mean: 48.5, stdDev: 2.1 },
            armCircumference: { mean: 15.2, stdDev: 1.7 },
        },
        'Gizi Lebih': {
            priorProbability: 0.1,
            age: { mean: 4.8, stdDev: 2.3 },
            height: { mean: 105.7, stdDev: 7.8 },
            weight: { mean: 20.1, stdDev: 3.2 },
            headCircumference: { mean: 49.2, stdDev: 2.3 },
            armCircumference: { mean: 17.8, stdDev: 2.1 },
        },
    };

    const calculateProbability = (x: number, mean: number, stdDev: number): number => {
        if (stdDev === 0) return 0;
        const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
        return (1 / (Math.sqrt(2 * Math.PI) * stdDev)) * exponent;
    };

    const classifyNutrition = () => {
        const calculations: Record<
            NutritionalStatus,
            {
                prior: number;
                likelihoods: Record<string, number>;
                rawPosterior: number;
            }
        > = {
            'Gizi Buruk': { prior: 0, likelihoods: {}, rawPosterior: 0 },
            'Gizi Kurang': { prior: 0, likelihoods: {}, rawPosterior: 0 },
            'Gizi Baik': { prior: 0, likelihoods: {}, rawPosterior: 0 },
            'Gizi Lebih': { prior: 0, likelihoods: {}, rawPosterior: 0 },
        };

        const probabilities: Record<NutritionalStatus, number> = {
            'Gizi Buruk': 1,
            'Gizi Kurang': 1,
            'Gizi Baik': 1,
            'Gizi Lebih': 1,
        };

        // Hitung likelihood untuk setiap kelas
        Object.keys(trainedModel).forEach((status) => {
            const nutritionalStatus = status as NutritionalStatus;
            const classData = trainedModel[nutritionalStatus];

            // Simpan prior probability
            calculations[nutritionalStatus].prior = classData.priorProbability;
            probabilities[nutritionalStatus] *= classData.priorProbability;

            // Hitung likelihood untuk setiap fitur
            const ageLikelihood = calculateProbability(childData.age, classData.age.mean, classData.age.stdDev);
            calculations[nutritionalStatus].likelihoods['Usia'] = ageLikelihood;
            probabilities[nutritionalStatus] *= ageLikelihood;

            const heightLikelihood = calculateProbability(childData.height, classData.height.mean, classData.height.stdDev);
            calculations[nutritionalStatus].likelihoods['Tinggi Badan'] = heightLikelihood;
            probabilities[nutritionalStatus] *= heightLikelihood;

            const weightLikelihood = calculateProbability(childData.weight, classData.weight.mean, classData.weight.stdDev);
            calculations[nutritionalStatus].likelihoods['Berat Badan'] = weightLikelihood;
            probabilities[nutritionalStatus] *= weightLikelihood;

            const headCircumferenceLikelihood = calculateProbability(
                childData.headCircumference,
                classData.headCircumference.mean,
                classData.headCircumference.stdDev,
            );
            calculations[nutritionalStatus].likelihoods['Lingkar Kepala'] = headCircumferenceLikelihood;
            probabilities[nutritionalStatus] *= headCircumferenceLikelihood;

            const armCircumferenceLikelihood = calculateProbability(
                childData.armCircumference,
                classData.armCircumference.mean,
                classData.armCircumference.stdDev,
            );
            calculations[nutritionalStatus].likelihoods['Lingkar Lengan'] = armCircumferenceLikelihood;
            probabilities[nutritionalStatus] *= armCircumferenceLikelihood;

            // Simpan raw posterior (sebelum normalisasi)
            calculations[nutritionalStatus].rawPosterior = probabilities[nutritionalStatus];
        });

        // Normalisasi probabilities
        const total = Object.values(probabilities).reduce((sum, prob) => sum + prob, 0);
        Object.keys(probabilities).forEach((status) => {
            const nutritionalStatus = status as NutritionalStatus;
            probabilities[nutritionalStatus] /= total;
        });

        // Determine the status with highest probability
        let maxStatus: NutritionalStatus = 'Gizi Baik';
        let maxProb = 0;

        Object.keys(probabilities).forEach((status) => {
            const nutritionalStatus = status as NutritionalStatus;
            if (probabilities[nutritionalStatus] > maxProb) {
                maxProb = probabilities[nutritionalStatus];
                maxStatus = nutritionalStatus;
            }
        });

        setResult({
            status: maxStatus,
            probabilities,
            calculations,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setChildData({
            ...childData,
            [name]: name === 'gender' ? value : parseFloat(value),
        });
    };

    const getStatusColor = (status: NutritionalStatus) => {
        switch (status) {
            case 'Gizi Buruk':
                return 'bg-red-100 text-red-800';
            case 'Gizi Kurang':
                return 'bg-yellow-100 text-yellow-800';
            case 'Gizi Baik':
                return 'bg-green-100 text-green-800';
            case 'Gizi Lebih':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="bg-transparent">
            <CardContent>
                <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-md">
                    <h1 className="mb-6 text-center text-3xl font-bold text-indigo-700">Klasifikasi Status Gizi Anak dengan Naive Bayes</h1>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Input Form */}
                        <div className="rounded-lg bg-gray-50 p-6">
                            <h2 className="mb-4 flex items-center text-xl font-semibold text-indigo-600">
                                <User className="mr-2" /> Data Anak
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Usia (tahun)</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={childData.age}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        step="0.1"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                    <select
                                        name="gender"
                                        value={childData.gender}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={childData.height}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        step="0.1"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Berat Badan (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={childData.weight}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        step="0.1"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Lingkar Kepala (cm)</label>
                                    <input
                                        type="number"
                                        name="headCircumference"
                                        value={childData.headCircumference}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        step="0.1"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Lingkar Lengan (cm)</label>
                                    <input
                                        type="number"
                                        name="armCircumference"
                                        value={childData.armCircumference}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        step="0.1"
                                        min="0"
                                    />
                                </div>

                                <button
                                    onClick={classifyNutrition}
                                    className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-300 hover:bg-indigo-700"
                                >
                                    <ArrowRight className="mr-2" /> Klasifikasikan Status Gizi
                                </button>
                            </div>
                        </div>

                        {/* Result Section */}
                        <div className="space-y-6">
                            {result ? (
                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                                    <h2 className="mb-4 text-xl font-semibold text-indigo-600">Hasil Klasifikasi</h2>
                                    <div className={`mb-4 rounded-lg p-4 text-center ${getStatusColor(result.status)}`}>
                                        <p className="text-sm font-medium">STATUS GIZI</p>
                                        <p className="text-2xl font-bold">{result.status}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-medium text-gray-700">Probabilitas:</h3>
                                        {Object.entries(result.probabilities).map(([status, prob]) => (
                                            <div key={status}>
                                                <div className="mb-1 flex justify-between text-sm">
                                                    <span>{status}</span>
                                                    <span>{(prob * 100).toFixed(2)}%</span>
                                                </div>
                                                <div className="h-2.5 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-2.5 rounded-full ${getStatusColor(status as NutritionalStatus)}`}
                                                        style={{ width: `${prob * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {result.calculations && (
                                        <div className="mt-4">
                                            <h3 className="mb-2 font-medium text-gray-700">Detail Perhitungan:</h3>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="px-3 py-2 text-left">Kelas</th>
                                                            <th className="px-3 py-2 text-right">Prior</th>
                                                            <th className="px-3 py-2 text-right">Likelihood Usia</th>
                                                            <th className="px-3 py-2 text-right">Likelihood Tinggi</th>
                                                            <th className="px-3 py-2 text-right">Likelihood Berat</th>
                                                            <th className="px-3 py-2 text-right">Posterior</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(result.calculations).map(([status, calc]) => (
                                                            <tr key={status} className="border-b border-gray-200">
                                                                <td className="px-3 py-2">{status}</td>
                                                                <td className="px-3 py-2 text-right">{calc.prior.toExponential(2)}</td>
                                                                <td className="px-3 py-2 text-right">{calc.likelihoods['Usia'].toExponential(2)}</td>
                                                                <td className="px-3 py-2 text-right">
                                                                    {calc.likelihoods['Tinggi Badan'].toExponential(2)}
                                                                </td>
                                                                <td className="px-3 py-2 text-right">
                                                                    {calc.likelihoods['Berat Badan'].toExponential(2)}
                                                                </td>
                                                                <td className="px-3 py-2 text-right font-medium">
                                                                    {(result.probabilities[status as NutritionalStatus] * 100).toFixed(2)}%
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-lg bg-gray-50 p-6">
                                    <div className="text-center text-gray-500">
                                        <Activity className="mx-auto mb-2 text-4xl" />
                                        <p>Masukkan data anak untuk melihat hasil klasifikasi</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* Theory Section */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                            <button
                                onClick={() => setShowTheory(!showTheory)}
                                className="flex w-full items-center justify-between text-left font-semibold text-indigo-600"
                            >
                                <span>Teori Dasar Naive Bayes</span>
                                <svg
                                    className={`h-5 w-5 transform transition-transform ${showTheory ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showTheory && (
                                <div className="mt-4 space-y-2 text-sm text-gray-700">
                                    <p>
                                        <strong>Naive Bayes</strong> adalah algoritma klasifikasi probabilistik yang didasarkan pada Teorema Bayes
                                        dengan asumsi "naif" bahwa semua fitur bersifat independen satu sama lain.
                                    </p>
                                    <p>
                                        Rumus Teorema Bayes:
                                        <br />
                                        <code className="rounded bg-gray-100 p-1">P(A|B) = [P(B|A) * P(A)] / P(B)</code>
                                    </p>
                                    <p>
                                        Dalam konteks klasifikasi gizi:
                                        <br />
                                        <code className="rounded bg-gray-100 p-1">P(Status Gizi|Fitur) ∝ P(Fitur|Status Gizi) * P(Status Gizi)</code>
                                    </p>
                                    <p>
                                        Kita menghitung probabilitas posterior untuk setiap kelas status gizi dan memilih kelas dengan probabilitas
                                        tertinggi.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Implementation Section */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                            <button
                                onClick={() => setShowImplementation(!showImplementation)}
                                className="flex w-full items-center justify-between text-left font-semibold text-indigo-600"
                            >
                                <span>Langkah Implementasi Detail</span>
                                <svg
                                    className={`h-5 w-5 transform transition-transform ${showImplementation ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showImplementation && (
                                <div className="mt-4 space-y-4 text-sm text-gray-700">
                                    <div>
                                        <h4 className="font-medium text-indigo-600">1. Persiapan Data</h4>
                                        <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
                                            <li>Kumpulkan dataset antropometri anak dengan label status gizi</li>
                                            <li>Bagi dataset menjadi 4 kelas: Gizi Buruk, Gizi Kurang, Gizi Baik, Gizi Lebih</li>
                                            <li>
                                                Hitung statistik untuk setiap fitur dalam setiap kelas:
                                                <ul className="list-circle list-inside pl-5">
                                                    <li>Mean (rata-rata)</li>
                                                    <li>Standar deviasi</li>
                                                </ul>
                                            </li>
                                            <li>Hitung probabilitas prior setiap kelas (jumlah sampel kelas / total sampel)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-indigo-600">2. Pelatihan Model</h4>
                                        <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
                                            <li>
                                                Simpan parameter model untuk setiap kelas:
                                                <div className="mt-1 rounded bg-gray-100 p-2 text-xs">
                                                    <pre>{`{
  'Gizi Baik': {
    priorProbability: 0.6,
    age: { mean: 4.5, stdDev: 2.1 },
    height: { mean: 102.3, stdDev: 7.4 },
    // ... dan seterusnya
  },
  // kelas lainnya
}`}</pre>
                                                </div>
                                            </li>
                                            <li>Asumsikan distribusi normal (Gaussian) untuk fitur numerik</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-indigo-600">3. Klasifikasi Data Baru</h4>
                                        <ol className="mt-1 list-inside list-decimal space-y-2 pl-4">
                                            <li>
                                                <strong>Hitung likelihood setiap fitur:</strong>
                                                <p className="mt-1 pl-4">Gunakan fungsi densitas probabilitas normal:</p>
                                                <code className="mt-1 block rounded bg-gray-100 p-2 text-xs">
                                                    {`P(x|kelas) = (1/(√(2π)σ)) * e^(-(x-μ)²/(2σ²))`}
                                                </code>
                                            </li>
                                            <li>
                                                <strong>Hitung probabilitas posterior:</strong>
                                                <p className="mt-1 pl-4">Kalikan prior probability dengan likelihood semua fitur:</p>
                                                <code className="mt-1 block rounded bg-gray-100 p-2 text-xs">
                                                    P(kelas|fitur) ∝ P(kelas) * P(usia|kelas) * P(tinggi|kelas) * P(berat|kelas) * ...
                                                </code>
                                            </li>
                                            <li>
                                                <strong>Normalisasi probabilitas:</strong>
                                                <p className="mt-1 pl-4">Bagi setiap probabilitas dengan total semua probabilitas</p>
                                            </li>
                                            <li>
                                                <strong>Pilih kelas dengan probabilitas tertinggi</strong>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Example Flow Section */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
                            <button
                                onClick={() => setShowExample(!showExample)}
                                className="flex w-full items-center justify-between text-left font-semibold text-indigo-600"
                            >
                                <span>Contoh Alur Sistem</span>
                                <svg
                                    className={`h-5 w-5 transform transition-transform ${showExample ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showExample && (
                                <div className="mt-4 space-y-4 text-sm text-gray-700">
                                    <div>
                                        <h4 className="font-medium text-indigo-600">1. Input Contoh</h4>
                                        <div className="mt-2 rounded bg-gray-100 p-3">
                                            <p className="font-medium">Data anak yang dimasukkan:</p>
                                            <ul className="mt-1 list-inside list-disc pl-4">
                                                <li>Usia: 2.5 tahun</li>
                                                <li>Jenis Kelamin: Laki-laki</li>
                                                <li>Tinggi Badan: 85 cm</li>
                                                <li>Berat Badan: 10.5 kg</li>
                                                <li>Lingkar Kepala: 45.5 cm</li>
                                                <li>Lingkar Lengan: 12.3 cm</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-indigo-600">2. Proses Klasifikasi</h4>
                                        <div className="mt-2 rounded bg-gray-100 p-3">
                                            <p className="font-medium">Perhitungan untuk kelas "Gizi Buruk":</p>
                                            <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
                                                <li>Prior Probability: 0.1</li>
                                                <li>Likelihood Usia (2.5 tahun): P(2.5 | μ=3.2, σ=1.5) = 0.234</li>
                                                <li>Likelihood Tinggi (85 cm): P(85 | μ=85.4, σ=5.2) = 0.076</li>
                                                <li>Likelihood Berat (10.5 kg): P(10.5 | μ=9.8, σ=1.5) = 0.184</li>
                                                <li>Raw Posterior: 0.1 × 0.234 × 0.076 × 0.184 × ... = 3.21e-5</li>
                                            </ul>
                                            <p className="mt-2 font-medium">Perhitungan serupa dilakukan untuk semua kelas</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-indigo-600">3. Output Contoh</h4>
                                        <div className="mt-2 rounded bg-gray-100 p-3">
                                            <p className="font-medium">Hasil setelah normalisasi:</p>
                                            <ul className="mt-1 list-inside list-disc pl-4">
                                                <li>Gizi Buruk: 62.3%</li>
                                                <li>Gizi Kurang: 28.5%</li>
                                                <li>Gizi Baik: 8.9%</li>
                                                <li>Gizi Lebih: 0.3%</li>
                                            </ul>
                                            <div className="mt-2 rounded bg-red-100 p-2 text-center text-red-800">
                                                <p className="font-bold">Status Gizi: Gizi Buruk</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Process Flow */}
                    <div className="mt-8 rounded-lg bg-indigo-50 p-6">
                        <h2 className="mb-4 text-center text-xl font-semibold text-indigo-600">Alur Proses Klasifikasi</h2>
                        <div className="flex flex-col items-center justify-between md:flex-row">
                            <div className="mb-4 flex flex-col items-center md:mb-0">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <User className="text-2xl text-indigo-600" />
                                </div>
                                <p className="mt-2 font-medium">Input Data</p>
                                <p className="mt-1 text-center text-xs text-gray-600">
                                    Contoh: Anak 2.5 tahun,
                                    <br />
                                    tinggi 85cm, berat 10.5kg
                                </p>
                            </div>
                            <div className="mx-2 hidden text-indigo-400 md:block">→</div>
                            <div className="mb-4 flex flex-col items-center md:mb-0">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <Activity className="text-2xl text-indigo-600" />
                                </div>
                                <p className="mt-2 font-medium">Proses Naive Bayes</p>
                                <p className="mt-1 text-center text-xs text-gray-600">
                                    Hitung likelihood tiap fitur
                                    <br />
                                    untuk semua kelas
                                </p>
                            </div>
                            <div className="mx-2 hidden text-indigo-400 md:block">→</div>
                            <div className="flex flex-col items-center">
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <Circle className="text-2xl text-indigo-600" />
                                </div>
                                <p className="mt-2 font-medium">Hasil Klasifikasi</p>
                                <p className="mt-1 text-center text-xs text-gray-600">
                                    Contoh: Gizi Buruk (62.3%)
                                    <br />
                                    dengan probabilitas semua kelas
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-start rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <Info className="mt-0.5 mr-2 flex-shrink-0 text-yellow-600" />
                        <p className="text-sm text-yellow-800">
                            <strong>Catatan:</strong> Halaman ini menggunakan model contoh dengan parameter fiktif untuk tujuan demonstrasi.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NaiveBayesNutritionClassifier;

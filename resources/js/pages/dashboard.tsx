import LineChart from '@/components/chart/LineChart';
import PieChart from '@/components/chart/PieChart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export interface DashboardProps {
    orangtuacount?: number | string;
    attributcount?: number | string;
    datasetcount?: number | string;
    pemeriksaancount?: number | string;
    gizi?: number[];
    statusLabel?: string[];
    chartPemeriksaan: {
        label: string[];
        data: number[];
    };
}

export default function Dashboard({
    orangtuacount,
    attributcount,
    datasetcount,
    pemeriksaancount,
    gizi,
    chartPemeriksaan,
    statusLabel,
}: DashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];
    const LineChartData = {
        labels: chartPemeriksaan.label,
        datasets: [
            {
                label: 'Data Pemeriksaan',
                backgroundColor: ['rgba(21,150,0,0.4)'], // note the array
                borderColor: ['rgba(21,150,0,1)'], // note the array
                borderWidth: 1,
                data: chartPemeriksaan.data, // Use the dynamic data from chartPemeriksaan
            },
        ],
    };

    // Data yang akan dikirim ke PieChart
    const label = Object.keys(gizi ?? {});
    const data = Object.values(gizi ?? {});
    console.log('Label:', label);
    console.log('data:', data);
    const PieChartData = {
        labels: label ?? [], // provide a default value if statusLabel is undefined or empty
        datasets: [
            {
                label: 'Jumlah',
                data: data, // Data dinamis
                backgroundColor: ['rgba(222, 22, 0, 0.2)', 'rgba(194, 182, 0,0.2)', 'rgba(37, 255, 0, 0.2)', 'rgba(0, 134, 255, 0.2)'],
                borderColor: ['rgba(222, 22, 0,1)', 'rgba(194, 182, 0,1)', 'rgba(37, 255, 0, 1)', 'rgba(0, 134, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };
    const keteranganGizi = [
        {
            kategori: 'Gizi Buruk',
            attribut: 'Berat Badan, Tinggi Badan, Lingkar Lengan, Lingkar Kepala, Usia, Jenis Kelamin',
            kondisi: 'Berat badan dan tinggi badan jauh di bawah standar (< -3 SD)',
            keterangan:
                'Berdasarkan hasil perhitungan menggunakan algoritma Naive Bayes, balita diklasifikasikan sebagai gizi buruk karena memiliki probabilitas tertinggi pada kategori ini.',
        },
        {
            kategori: 'Gizi Kurang',
            attribut: 'Berat Badan, Tinggi Badan, Lingkar Lengan, Lingkar Kepala, Usia, Jenis Kelamin',
            kondisi: 'Berat badan dan tinggi badan di bawah standar (-3 SD sampai <-2 SD)',
            keterangan:
                'Berdasarkan hasil perhitungan menggunakan algoritma Naive Bayes, balita diklasifikasikan sebagai gizi kurang karena probabilitas tertinggi terdapat pada kategori ini.',
        },
        {
            kategori: 'Gizi Baik',
            attribut: 'Berat Badan, Tinggi Badan, Lingkar Lengan, Lingkar Kepala, Usia, Jenis Kelamin',
            kondisi: 'Berat badan dan tinggi badan sesuai standar (-2 SD sampai +2 SD)',
            keterangan:
                'Berdasarkan hasil perhitungan menggunakan algoritma Naive Bayes, balita diklasifikasikan sebagai gizi baik (normal) karena kategori ini memiliki probabilitas tertinggi.',
        },
        {
            kategori: 'Gizi Lebih',
            attribut: 'Berat Badan, Tinggi Badan, Lingkar Lengan, Lingkar Kepala, Usia, Jenis Kelamin',
            kondisi: 'Berat badan dan tinggi badan di atas standar (> +2 SD)',
            keterangan:
                'Berdasarkan hasil perhitungan menggunakan algoritma Naive Bayes, balita diklasifikasikan sebagai gizi lebih karena probabilitas tertinggi berada pada kategori ini.',
        },
    ];
    const date = new Date();
    const currentMonth = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-sidebar relative overflow-hidden rounded-xl border dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base text-white md:text-lg lg:text-xl">Data Pengguna</CardTitle>
                            <CardDescription className="text-white">{orangtuacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-sidebar relative overflow-hidden rounded-xl border dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base text-white md:text-base lg:text-lg">Data Kriteria Gizi Balita</CardTitle>
                            <CardDescription className="text-white">{attributcount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-sidebar relative overflow-hidden rounded-xl border dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base text-white md:text-base lg:text-base">Jumlah Dataset Gizi Balita</CardTitle>
                            <CardDescription className="text-white">{datasetcount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-sidebar relative overflow-hidden rounded-xl border dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base text-white md:text-base lg:text-base">Data Pemeriksaan Gizi Balita</CardTitle>
                            <CardDescription className="text-white">{pemeriksaancount}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="grid h-full grid-cols-1 gap-4 align-middle md:grid-cols-12">
                        <div className="col-span-full w-full p-4 md:col-span-12 lg:col-span-8 dark:bg-white">
                            <table className="w-full table-fixed border-collapse border border-gray-300 dark:border-gray-700">
                                <thead>
                                    <tr>
                                        <th className="w-20 text-xs">Kategori Gizi</th>
                                        <th className="text-xs">Attribut yang Mempengaruhi</th>
                                        <th className="text-xs">Kondisi Data Balita </th>
                                        <th className="text-xs">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keteranganGizi.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border p-1.5 text-justify text-xs">{item.kategori}</td>
                                            <td className="border p-1.5 text-justify text-xs">{item.attribut}</td>
                                            <td className="border p-1.5 text-justify text-xs">{item.kondisi}</td>
                                            <td className="border p-1.5 text-justify text-xs">{item.keterangan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-span-full max-h-full w-full border p-4 md:col-span-12 lg:col-span-4 dark:bg-white">
                            <h4 className="text-center font-semibold">Pemeriksaan Gizi Bulan {currentMonth} </h4>
                            <PieChart data={PieChartData} title="Jumlah Pemeriksaan Gizi" />
                            <div className="col-span-full w-full p-4 md:col-span-12 lg:col-span-7 dark:bg-white">
                                <LineChart data={LineChartData} title="Jumlah Pemeriksaan" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

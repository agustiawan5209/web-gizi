import LineChart from '@/components/chart/LineChart';
import PieChart from '@/components/chart/PieChart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export interface DashboardProps {
    orangtuacount?: number | string;
    balitacount?: number | string;
    datasetcount?: number | string;
    pemeriksaancount?: number | string;
    gizi?: number[];
    statusLabel?: string[];
    chartPemeriksaan: {
        label: string[];
        data: number[];
    };
}

export default function Dashboard({ orangtuacount, balitacount, datasetcount, pemeriksaancount, gizi, chartPemeriksaan, statusLabel }: DashboardProps) {
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
                label: 'Jumlah Pemeriksaan',
                backgroundColor: ['rgba(75,192,192,0.4)'], // note the array
                borderColor: ['rgba(75,192,192,1)'], // note the array
                borderWidth: 1,
                data: chartPemeriksaan.data,
            },
            // {
            //     label: 'Data Pemeriksaan',
            //     backgroundColor: ['rgba(21,150,0,0.4)'], // note the array
            //     borderColor: ['rgba(21,150,0,1)'], // note the array
            //     borderWidth: 1,
            //     data: [65, 59, 80, 81, 56, 55, 40],
            // },
        ],
    };

    // Data yang akan dikirim ke PieChart
    const PieChartData = {
        labels: statusLabel ?? [], // provide a default value if statusLabel is undefined or empty
        datasets: [
            {
                label: 'Jumlah',
                data: gizi, // Data dinamis
                backgroundColor: ['rgba(222, 22, 0, 0.2)', 'rgba(194, 182, 0,0.2)', 'rgba(37, 255, 0, 0.2)', 'rgba(0, 134, 255, 0.2)'],
                borderColor: ['rgba(222, 22, 0,1)', 'rgba(194, 182, 0,1)', 'rgba(37, 255, 0, 1)', 'rgba(0, 134, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-sidebar dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base md:text-lg lg:text-xl text-white">Data Orang Tua</CardTitle>
                            <CardDescription className="text-white">{orangtuacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-sidebar dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base md:text-lg lg:text-xl text-white">Data Balita</CardTitle>
                            <CardDescription className="text-white">{balitacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-sidebar dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base md:text-lg lg:text-xl text-white">Jumlah Dataset</CardTitle>
                            <CardDescription className="text-white">{datasetcount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-sidebar dark:bg-[#493D9E]">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-base md:text-lg lg:text-xl text-white">Data Pemeriksaan</CardTitle>
                            <CardDescription className="text-white">{pemeriksaancount}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="grid h-full grid-cols-1 gap-4 align-middle md:grid-cols-12">
                        <div className="col-span-full w-full p-4 md:col-span-12 lg:col-span-7 dark:bg-white">
                            <LineChart data={LineChartData} title="Jumlah Pemeriksaan" />
                        </div>
                        <div className="col-span-full max-h-full w-full p-4 border md:col-span-12 lg:col-span-5 dark:bg-white">
                            <PieChart data={PieChartData} title="Jumlah Pemeriksaan Gizi" />

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

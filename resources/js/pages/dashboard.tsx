import PieChart from '@/components/chart/PieChart';
import LineChart from '@/components/chart/LineChart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';



export interface DashboardProps {
    orangtuacount?: number | string;
    balitacount?: number | string;
    datasetcount?: number | string;
    pemeriksaancount?: number | string;
}

export default function Dashboard({ orangtuacount, balitacount, datasetcount, pemeriksaancount }: DashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];
    const LineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Jumlah Pemeriksaan',
                backgroundColor: ['rgba(75,192,192,0.4)'], // note the array
                borderColor: ['rgba(75,192,192,1)'], // note the array
                borderWidth: 1,
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    };

    // Data yang akan dikirim ke PieChart
    const PieChartData = {
        labels: ['Orang Tua', 'Balita'],
        datasets: [
            {
                label: 'Jumlah',
                data: [Number(orangtuacount), Number(balitacount)], // Data dinamis
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 dark:bg-elevation-1">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-800">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Data Orang Tua</CardTitle>
                            <CardDescription className="text-white">{orangtuacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-800">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Data Balita</CardTitle>
                            <CardDescription className="text-white">{balitacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-800">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Jumlah Dataset</CardTitle>
                            <CardDescription className="text-white">{datasetcount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-800">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Data Pemeriksaan</CardTitle>
                            <CardDescription className="text-white">{pemeriksaancount}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="grid h-full grid-cols-1 gap-4 align-middle md:grid-cols-12">
                        <div className="w-full p-4 col-span-full md:col-span-7 dark:bg-white">
                            <LineChart data={LineChartData} title="Jumlah Pemeriksaan" />
                        </div>
                        <div className="max-h-full w-full p-4 col-span-full md:col-span-4 dark:bg-white">
                            <PieChart data={PieChartData} title='Jumlah Orang tua dan balita' />
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

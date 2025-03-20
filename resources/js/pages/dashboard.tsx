import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export interface DashboardProps {
    orangtuacount?: number | string;
    balitacount?: number | string;
    datasetcount?: number | string;
    pemeriksaancount?: number | string;
}

export default function Dashboard({ orangtuacount, balitacount, datasetcount, pemeriksaancount }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-b from-purple-400 to-purple-600">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Data Orang Tua</CardTitle>
                            <CardDescription className="text-white">{orangtuacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-b from-purple-400 to-purple-600">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Data Balita</CardTitle>
                            <CardDescription className="text-white">{balitacount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-b from-purple-400 to-purple-600">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Jumlah Dataset</CardTitle>
                            <CardDescription className="text-white">{datasetcount}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-b from-purple-400 to-purple-600">
                        <CardHeader className="px-4 pt-1 pb-0 text-center">
                            <CardTitle className="text-xl text-white">Data Pemeriksaan</CardTitle>
                            <CardDescription className="text-white">{pemeriksaancount}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}

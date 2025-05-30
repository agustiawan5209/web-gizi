import CollapsibleRow from '@/components/collapsible-table';
import DetailPemeriksaan from '@/components/detail-pemeriksaan';
import NaiveBayesNutritionExplanation from '@/components/page/naive-bayes';
import { Button } from '@/components/ui/button';
import { Table, TableAction, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import GuestLayout from '@/layouts/guest-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
export interface DashboardProps {
    balita?: {
        id: string;
        nama: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        usia: string;
        jenis_kelamin: string;
        orangtua: {
            name: string;
        };
        pemeriksaan: {
            tgl_pemeriksaan: string;
            detailpemeriksaan: {
                attribut_id: string;
                nilai: string;
            };
        }[];
    }[];
    pemeriksaan: {
        id: string;
        tgl_pemeriksaan: string;
        label: string;
        balita: {
            nama: string;
            orangtua: { name: string };
            tempat_lahir: string;
            tanggal_lahir: string;
        };
        detailpemeriksaan: any;
    }[];
}

export default function Dashboard({ balita, pemeriksaan }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format waktu menjadi 2 digit (contoh: 05:09:02)
    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value;
    };

    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const seconds = formatTime(time.getSeconds());

    const [startDate, setStartDate] = useState<string | Date>(new Date());
    const [endDate, setEndDate] = useState<string | Date | null>(new Date());
    const pages = [
        { id: 'algoritma', title: 'Lihat Implementasi Algoritma' },
        { id: 'pemeriksaan', title: 'Lihat Hasil Pemeriksaan' },
    ];

    const [currentPage, setCurrentPage] = useState('');
  // Memoize table rows to prevent unnecessary re-renders
    const tableRows = useMemo(() => {
        if (!pemeriksaan?.length) return null;

        return pemeriksaan.map((item, index) => {
            let read_url = null;

            return (
                <CollapsibleRow
                    key={item.id} // Using item.id as key is better than index
                    num={index + 1 }
                    title={item.tgl_pemeriksaan}
                    columnData={[item.balita.nama, item.balita.orangtua.name, `${item.balita.tempat_lahir}/${item.balita.tanggal_lahir}`, item.label]}
                    delete="delete"
                    show={route('orangtua.balita.show', { pemeriksaan: item.id })}
                    id={item.id}
                >
                    <DetailPemeriksaan detail={item.detailpemeriksaan} />
                </CollapsibleRow>
            );
        });
    }, [pemeriksaan]);
    return (
        <GuestLayout head="Dashboard">
            <Head title="Dashboard" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 p-6 text-white shadow-lg">
                    <div className="flex flex-col items-start justify-between gap-4">
                        {/* Greeting and subtitle */}
                        <div className="item-start flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-black md:text-3xl">Welcome, {auth.user.name}!</h1>
                                us <p className="mt-1 text-black">Selamat datang di sistem klasifikasi anak menggunakan metode naive bayes</p>
                            </div>

                            {/* Stats section */}
                            <div className="flex flex-col gap-6 sm:flex-row">
                                {/* Deals closed */}
                                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="text-2xl font-bold">{formattedDate}</div>
                                </div>
                                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="text-2xl font-bold">
                                        {hours}:{minutes}:{seconds}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-center gap-10">
                            {pages.map((page) => (
                                <Button key={page.id} variant={'default'} onClick={() => setCurrentPage(page.id)} type="button">
                                    {page.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                {currentPage === 'algoritma' && <NaiveBayesNutritionExplanation />}
                {currentPage === 'pemeriksaan' && (
                    <div>
                         <TableContainer >
                            <div className="max-w-[300px] md:max-w-[768px] lg:max-w-full">
                            <Table className="w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableTh className="w-10">No.</TableTh>
                                        <TableTh>Tanggal Pemeriksaan</TableTh>
                                        <TableTh>Nama Balita</TableTh>
                                        <TableTh>Nama Orang Tua</TableTh>
                                        <TableTh>Tempat/Tanggal Lahir</TableTh>
                                        <TableTh>Hasil Pemeriksaan Gizi</TableTh>
                                        <TableTh>Aksi</TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{tableRows}</TableBody>
                            </Table>
                            </div>

                        </TableContainer>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}

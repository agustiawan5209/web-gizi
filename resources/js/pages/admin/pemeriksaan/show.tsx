import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface OrangTua {
    name: string;
    email: string;
}

interface Balita {
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    usia: string;
    jenis_kelamin: string;
}

interface Pemeriksaan {
    tgl_pemeriksaan: string;
}

interface DetailPemeriksaan {
    attribut: {
        nama: string;
    };
    nilai: number | string;
}

export interface PemeriksaanProps {
    orangTua: OrangTua;
    balita: Balita;
    pemeriksaan: Pemeriksaan;
    detail: DetailPemeriksaan[];
    breadcrumb: { title: string; href: string }[];
}

export default function PemeriksaanShow({ pemeriksaan, balita, orangTua, detail, breadcrumb }: PemeriksaanProps) {
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Detail Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="mx-auto max-w-7xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900 dark:text-white">
                        <h2 className="mb-6 text-xl font-bold tracking-tight">Detail Pemeriksaan</h2>

                        <div className="grid grid-cols-1 gap-8 md:gap-0">
                            <TableContainer>
                            <Table className="w-full border-collapse">
                                <TableHead>
                                    <TableRow>
                                        <TableColumn className='text-lg'>
                                            Tanggal Pemeriksaan
                                        </TableColumn>
                                        <TableColumn >
                                           {pemeriksaan.tgl_pemeriksaan}
                                        </TableColumn>
                                    </TableRow>
                                    <TableRow>
                                        <TableTh colSpan={2} className="bg-blue-100 text-black p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                            Data Orang Tua
                                        </TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Parent Data */}
                                    <TableRow className="border-b">
                                        <TableColumn className="w-1/3 p-3 font-medium text-gray-600 dark:text-gray-400">Nama Orang Tua</TableColumn>
                                        <TableColumn className="p-3">{orangTua.name}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-gray-600 dark:text-gray-400">Email Orang Tua</TableColumn>
                                        <TableColumn className="p-3">{orangTua.email}</TableColumn>
                                    </TableRow>

                                    {/* Child Data */}
                                    <TableRow>
                                        <TableTh colSpan={2} className="bg-blue-100 text-black p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                            Data Balita
                                        </TableTh>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-gray-600 dark:text-gray-400">Nama Balita</TableColumn>
                                        <TableColumn className="p-3">{balita.nama}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-gray-600 dark:text-gray-400">Tempat Lahir</TableColumn>
                                        <TableColumn className="p-3">{balita.tempat_lahir}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-gray-600 dark:text-gray-400">Tanggal Lahir</TableColumn>
                                        <TableColumn className="p-3">{balita.tanggal_lahir}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-gray-600 dark:text-gray-400">Jenis Kelamin</TableColumn>
                                        <TableColumn className="p-3">{balita.jenis_kelamin}</TableColumn>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            </TableContainer>


                            <section className="border-x">
                                <h3  className="bg-blue-100 text-black p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                    Data Pemeriksaan
                                </h3>
                                <TableContainer className="relative">
                                    <Table className="w-full">
                                        <TableBody>
                                            {detail
                                                .filter((attr) => !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase()))
                                                .map((item, index) => (
                                                    <TableRow key={index} className="border-b py-1">
                                                        <TableColumn  className="font-normal w-1/3 text-gray-600 dark:text-gray-400">{item.attribut.nama}:</TableColumn>
                                                        <TableColumn>{item.nilai}</TableColumn>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import { type BreadcrumbItem } from '@/types';


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

interface PolaMakan {
    id: string;
    rekomendasi: string;
    catatan_dokter: string;
}

export interface PemeriksaanProps {
    orangTua: OrangTua;
    balita: Balita;
    pemeriksaan: Pemeriksaan;
    detail: DetailPemeriksaan[];
    polamakan: PolaMakan;
    breadcrumb: { title: string; href: string }[];
}

export default function PemeriksaanShow({ pemeriksaan, balita, orangTua, detail, polamakan, breadcrumb }: PemeriksaanProps) {
     // Memoize breadcrumbs to prevent unnecessary recalculations
     const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                                        <TableTh colSpan={2} className="bg-blue-100 text-foreground p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                            Data Orang Tua
                                        </TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Parent Data */}
                                    <TableRow className="border-b">
                                        <TableColumn className="w-1/3 p-3 font-medium text-foreground">Nama Orang Tua</TableColumn>
                                        <TableColumn className="p-3">{orangTua.name}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">Email Orang Tua</TableColumn>
                                        <TableColumn className="p-3">{orangTua.email}</TableColumn>
                                    </TableRow>

                                    {/* Child Data */}
                                    <TableRow>
                                        <TableTh colSpan={2} className="bg-blue-100 text-foreground p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                            Data Balita
                                        </TableTh>
                                    </TableRow>

                                    {([
                                        { attribut: 'Nama', nilai: balita.nama },
                                        { attribut: 'Tempat Lahir', nilai: balita.tempat_lahir },
                                        { attribut: 'Tanggal Lahir', nilai: balita.tanggal_lahir },
                                        { attribut: 'Jenis Kelamin', nilai: balita.jenis_kelamin },
                                    ]).map((item) =>(
                                        <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">{item.attribut}</TableColumn>
                                        <TableColumn className="p-3">{item.nilai}</TableColumn>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </TableContainer>


                            <section className="border-x">
                                <h3  className="bg-blue-100 text-foreground p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                    Data Pemeriksaan
                                </h3>
                                <TableContainer className="relative">
                                    <Table className="w-full">
                                        <TableBody>
                                            {detail
                                                .filter((attr) => !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase()))
                                                .map((item, index) => (
                                                    <TableRow key={index} className="border-b py-1">
                                                        <TableColumn  className="font-normal w-1/3 text-foreground">{item.attribut.nama}:</TableColumn>
                                                        <TableColumn>{item.nilai}</TableColumn>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </section>
                            {polamakan && (
                                <section className="border-x">
                                <h3  className="bg-blue-100 text-foreground p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                   Pola Makan
                                </h3>
                                <div className='container'>
                                    <div className="bg-card dark:bg-gray-800">
                                        <h2 className='p-3 text-lg font-semibold text-foreground'>Rekomendasi Pola Makan</h2>
                                        <p className='p-3 ql-editor' dangerouslySetInnerHTML={{ __html: polamakan.rekomendasi }}></p>
                                    </div>
                                    <div className="bg-card dark:bg-gray-800">
                                        <h2 className='p-3 text-lg font-semibold text-foreground'>Catatan Dokter</h2>
                                        <p className='p-3 ql-editor' dangerouslySetInnerHTML={{ __html: polamakan.catatan_dokter }}></p>
                                    </div>
                                </div>
                            </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

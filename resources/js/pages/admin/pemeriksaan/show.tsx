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
    usia: string;
    tinggiBadan: string;
    beratBadan: string;
    lingkarKepala: string;
    lingkarLengan: string;
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
                        <h2 className="mb-6 text-3xl font-bold tracking-tight">Detail Pemeriksaan</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
                        <section className="border-x px-4">
                            <h3 className="p-4 text-lg md:text-xl bg-blue-100 dark:bg-accent font-semibold  border-b border-gray-300 dark:border-gray-700">Data Orang Tua</h3>
                            <div className="grid grid-cols-1 gap-4 text-base mt-3">
                                <div className='border-b py-1 '>
                                    <div className="font-normal text-gray-600 dark:text-gray-400">Nama:</div> <div>{orangTua.name}</div>
                                </div>
                                <div className='border-b py-1'>
                                    <div className="font-normal text-gray-600 dark:text-gray-400">Email:</div> <div>{orangTua.email}</div>
                                </div>
                            </div>
                        </section>

                        <section className="border-x px-4">
                            <h3 className="p-4 text-lg md:text-xl bg-blue-100 dark:bg-accent font-semibold  border-b border-gray-300 dark:border-gray-700">Data Balita</h3>
                            <div className="grid grid-cols-1 gap-4 text-base mt-3">
                                <div className='border-b py-1'>
                                    <div className="font-normal text-gray-600 dark:text-gray-400">Nama:</div><div> {balita.nama}</div>
                                </div>
                                <div className='border-b py-1'>
                                    <div className="font-normal text-gray-600 dark:text-gray-400">Tempat Lahir:</div> <div>{balita.tempat_lahir}</div>
                                </div>
                                <div className='border-b py-1'>
                                    <div className="font-normal text-gray-600 dark:text-gray-400">Tanggal Lahir:</div> <div>{balita.tanggal_lahir}</div>
                                </div>
                                <div className='border-b py-1'>
                                    <div className="font-normal text-gray-600 dark:text-gray-400">Jenis Kelamin:</div> <div>{balita.jenis_kelamin}</div>
                                </div>
                            </div>
                        </section>

                        <section className="border-x px-4">
                            <h3 className="p-4 text-lg md:text-xl bg-blue-100 dark:bg-accent font-semibold  border-b border-gray-300 dark:border-gray-700">Data Pemeriksaan</h3>
                            <ul className="list-disc text-base mt-3 pl-5 space-y-4">
                                {detail.filter((attr)=> !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase())).map((item, index) => (
                                    <li key={index} className='border-b py-1'>
                                        <div className="font-normal text-gray-600 dark:text-gray-400">
                                            {item.attribut.nama}:
                                        </div>{' '}
                                        <div>{item.nilai}</div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

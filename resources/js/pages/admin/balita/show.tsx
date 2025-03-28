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
    detailpemeriksaan: {
        attribut_id: string;
        nilai: string;
    };
}

interface DetailPemeriksaan {
    attribut: {
        nama: string;
    };
    nilai: number | string;
}
interface Attribut {
    id: string;
    nama: string;
}

export interface PemeriksaanProps {
    orangTua: OrangTua;
    balita: Balita;
    pemeriksaan: Pemeriksaan[];
    detail: DetailPemeriksaan[];
    attribut: Attribut[];
    breadcrumb: { title: string; href: string }[];
}

export default function PemeriksaanShow({ pemeriksaan, balita, orangTua, attribut, breadcrumb }: PemeriksaanProps) {
    const filterById = (id: string, detail: { attribut_id: string; nilai: string }[]): string => {
        if (!detail || !id) return '';
        try {
            const foundElement = detail.find((element) => String(element.attribut_id).includes(id));
            return foundElement?.nilai ?? '';
        } catch (error) {
            console.error('Error in filterById:', error);
            return '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Detail Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="mx-auto max-w-full rounded-lg bg-white p-2 shadow-lg dark:bg-gray-900 dark:text-white">
                        <h2 className="mb-6 text-xl font-bold tracking-tight">Detail Pemeriksaan</h2>

                        <div className="grid grid-cols-1 gap-8 md:gap-4">
                           <TableContainer>
                           <Table className="w-full border-collapse">
                                <TableHead>
                                    <TableRow>
                                        <TableTh
                                            colSpan={2}
                                            className="bg-blue-100 p-4 text-left text-lg font-semibold text-black md:text-xl dark:bg-gray-800"
                                        >
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
                                        <TableTh
                                            colSpan={2}
                                            className="bg-blue-100 p-4 text-left text-lg font-semibold text-black md:text-xl dark:bg-gray-800"
                                        >
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

                            <section className="border-x px-4">
                                <h3  className="bg-blue-100 text-black p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                    Data Pemeriksaan
                                </h3>
                                <TableContainer className="relative">
                                    <Table className="w-full">
                                        <TableHead>
                                            <TableRow>
                                                <TableTh className="w-10">No.</TableTh>
                                                <TableTh className="px-0">Tanggal Pemeriksaan</TableTh>
                                                {attribut.length > 0 && attribut.map((item) => <TableTh key={item.id}> {item.nama}</TableTh>)}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(pemeriksaan ?? []).length > 0 &&
                                                pemeriksaan.map((item: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableColumn>{index + 1}</TableColumn>
                                                        <TableColumn> {item.tgl_pemeriksaan} </TableColumn>
                                                        {attribut.length > 0 &&
                                                            attribut.map((attributs: any) => (
                                                                <TableColumn key={attributs.id}>
                                                                    {filterById(attributs.id, item.detailpemeriksaan)}
                                                                </TableColumn>
                                                            ))}
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

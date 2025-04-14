import GrowthChart from '@/components/chart/GrowthChart';
import FileDownloader from '@/components/FileDownloader';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface OrangTua {
    name: string;
    email: string;
}

interface Balita {
    id: string;
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
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const searchById = (id: string, detail: { attribut_id: string; nilai: string }[]): string => {
        if (!detail || !id) return '';
        try {
            const foundElement = detail.find((element) => String(element.attribut_id).includes(id));
            return foundElement?.nilai ?? '';
        } catch (error) {
            console.error('Error in searchById:', error);
            return '';
        }
    };
    const page = usePage<SharedData>();
    const { defaultUrl } = page.props;

    const handleDownloadStart = () => {
        console.log('Download started');
    };

    const handleDownloadSuccess = () => {
        console.log('Download completed successfully');
    };

    const handleDownloadError = (error: unknown) => {
        console.error('Download failed:', error);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="mx-auto max-w-full rounded-lg bg-white p-2 shadow-lg dark:bg-gray-900 dark:text-white">
                        <h2 className="mb-6 text-xl font-bold tracking-tight">Detail Pemeriksaan</h2>

                        <div className="grid grid-cols-1 gap-8 md:gap-4">
                            <TableContainer>
                                <Table className="w-full border-collapse">
                                    <TableHead>
                                       {(pemeriksaan ?? []).length > 0 && <TableRow>
                                            <TableTh
                                                colSpan={2}
                                                className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800"
                                            >
                                                <FileDownloader
                                                    pdfUrl={route('laporan.index', { balita: balita.id })}
                                                    fileName="Laporan-Pemeriksaan.pdf"
                                                    buttonText="Cetak File"
                                                    onDownloadStart={handleDownloadStart}
                                                    onDownloadSuccess={handleDownloadSuccess}
                                                    onDownloadError={handleDownloadError}
                                                />
                                            </TableTh>
                                        </TableRow>}
                                        <TableRow>
                                            <TableTh
                                                colSpan={2}
                                                className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800"
                                            >
                                                Data Orang Tua
                                            </TableTh>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Parent Data */}
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground w-1/3 p-3 font-medium">Nama Orang Tua</TableColumn>
                                            <TableColumn className="p-3">{orangTua.name}</TableColumn>
                                        </TableRow>
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground p-3 font-medium">Email Orang Tua</TableColumn>
                                            <TableColumn className="p-3">{orangTua.email}</TableColumn>
                                        </TableRow>

                                        {/* Child Data */}
                                        <TableRow>
                                            <TableTh
                                                colSpan={2}
                                                className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800"
                                            >
                                                Data Balita
                                            </TableTh>
                                        </TableRow>
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground p-3 font-medium">Nama Balita</TableColumn>
                                            <TableColumn className="p-3">{balita.nama}</TableColumn>
                                        </TableRow>
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground p-3 font-medium">Tempat Lahir</TableColumn>
                                            <TableColumn className="p-3">{balita.tempat_lahir}</TableColumn>
                                        </TableRow>
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground p-3 font-medium">Tanggal Lahir</TableColumn>
                                            <TableColumn className="p-3">{balita.tanggal_lahir}</TableColumn>
                                        </TableRow>
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground p-3 font-medium">Jenis Kelamin</TableColumn>
                                            <TableColumn className="p-3">{balita.jenis_kelamin}</TableColumn>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <section className="border-x px-4">
                                <h3 className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
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
                                                                    {searchById(attributs.id, item.detailpemeriksaan)}
                                                                </TableColumn>
                                                            ))}
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </section>
                            {pemeriksaan.length > 1 && (
                                <section className="my-4">
                                    <GrowthChart url={defaultUrl + '/api/chart/balita/' + balita.id} title="perkembangan anak secara individual" />
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

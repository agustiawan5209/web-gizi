import GrowthChart from '@/components/chart/GrowthChart';
import FileDownloader from '@/components/FileDownloader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';

import GuestLayout from '@/layouts/guest-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { File, LucideEye } from 'lucide-react';
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
    alamat: string;
}

interface Pemeriksaan {
   id: string;
    tgl_pemeriksaan: string;
    label: string;
    alasan: string;
    detailPemeriksaan: DetailPemeriksaan[];
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
    attribut: Attribut[];
     dataPemeriksaanBalita: Pemeriksaan[];
    breadcrumb: { title: string; href: string }[];
}
interface Attribut {
    id: string;
    nama: string;
}
export default function PemeriksaanShow({ pemeriksaan, balita, orangTua, detail, attribut,
    polamakan,
    dataPemeriksaanBalita, breadcrumb }: PemeriksaanProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const handleDownloadStart = () => {
        console.log('Download started');
    };

    const handleDownloadSuccess = () => {
        console.log('Download completed successfully');
    };

    const handleDownloadError = (error: unknown) => {
        console.error('Download failed:', error);
    };

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
    return (
        <GuestLayout head="title">
            <Head title="Detail Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-0 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
                    <div className="mx-auto max-w-7xl rounded-lg bg-white p-1 shadow-lg lg:p-8 dark:bg-gray-900 dark:text-white">
                        <div className="flex w-full items-center justify-start pb-5">
                            <Link href={route('dashboard')}>
                                <Button variant="secondary">Kembali</Button>
                            </Link>
                        </div>
                        <h2 className="text-center text-2xl font-bold tracking-tight">Detail Pemeriksaan</h2>

                        <div className="grid grid-cols-1 gap-8 md:gap-0">
                            <TableContainer>
                                <Table className="w-full border-collapse">
                                    <TableHead>
                                        {pemeriksaan && (
                                            <TableRow>
                                                <TableTh
                                                    colSpan={2}
                                                    className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800"
                                                >
                                                    <FileDownloader
                                                        pdfUrl={route('laporan.pemeriksaan', { balita: balita.id, pemeriksaan: pemeriksaan.id })}
                                                        fileName="Laporan-Pemeriksaan.pdf"
                                                        buttonText="Cetak File"
                                                        onDownloadStart={handleDownloadStart}
                                                        onDownloadSuccess={handleDownloadSuccess}
                                                        onDownloadError={handleDownloadError}
                                                    />
                                                </TableTh>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableColumn className="text-lg">Tanggal Pemeriksaan</TableColumn>
                                            <TableColumn>{pemeriksaan.tgl_pemeriksaan}</TableColumn>
                                        </TableRow>
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
                                        <TableRow className="border-b">
                                            <TableColumn className="text-foreground p-3 font-medium">Alamat</TableColumn>
                                            <TableColumn className="p-3">{balita.alamat}</TableColumn>
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

                                        {[
                                            { attribut: 'Nama', nilai: balita.nama },
                                            { attribut: 'Tempat Lahir', nilai: balita.tempat_lahir },
                                            { attribut: 'Tanggal Lahir', nilai: balita.tanggal_lahir },
                                            { attribut: 'Jenis Kelamin', nilai: balita.jenis_kelamin },
                                        ].map((item) => (
                                            <TableRow key={item.attribut} className="border-b">
                                                <TableColumn className="text-foreground p-3 font-medium">{item.attribut}</TableColumn>
                                                <TableColumn className="p-3">{item.nilai}</TableColumn>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <section className="border-x">
                                <h3 className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                    Data Pemeriksaan
                                </h3>
                                <TableContainer className="relative">
                                    <Table className="w-full">
                                        <TableBody>
                                            {detail
                                                .filter((attr) => !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase()))
                                                .map((item, index) => (
                                                    <TableRow key={index} className="border-b py-1">
                                                        <TableColumn className="text-foreground w-1/3 font-normal">{item.attribut.nama}:</TableColumn>
                                                        <TableColumn>{item.nilai}</TableColumn>
                                                    </TableRow>
                                                ))}
                                            {polamakan && (
                                                <>
                                                    <TableRow>
                                                        <TableColumn className="text-foreground w-1/3 font-normal">
                                                            Alasan
                                                        </TableColumn>
                                                        <TableColumn
                                                            className="ql-editor p-3"
                                                            dangerouslySetInnerHTML={{ __html: pemeriksaan.alasan }}
                                                        ></TableColumn>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableColumn className="text-foreground p-3 text-lg font-semibold">
                                                            Rekomendasi Pola Makan
                                                        </TableColumn>
                                                        <TableColumn
                                                            className="ql-editor p-3"
                                                            dangerouslySetInnerHTML={{ __html: polamakan.rekomendasi }}
                                                        ></TableColumn>
                                                    </TableRow>
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </section>

                             <section className="border px-4">
                                <h3 className="text-foreground  p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                    Riwayat Perkembangan Gizi Balita
                                </h3>
                                <TableContainer className="relative">
                                    <Table className="w-full">
                                        <TableHead>
                                            <TableRow>
                                                <TableTh className="w-10 bg-blue-100">No.</TableTh>
                                                <TableTh className="px-0 bg-blue-100 whitespace-nowrap">Tanggal Pemeriksaan</TableTh>
                                                {attribut.length > 0 && attribut.map((item) => <TableTh className='bg-blue-100 text-xs whitespace-nowrap' key={item.id}> {item.nama}</TableTh>)}
                                                <TableTh className="w-10 bg-blue-100">Aksi</TableTh>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(dataPemeriksaanBalita ?? []).length > 0 &&
                                                dataPemeriksaanBalita.map((item: any, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableColumn>{index + 1}</TableColumn>
                                                        <TableColumn> {item.tgl_pemeriksaan} </TableColumn>
                                                        {attribut.length > 0 &&
                                                            attribut.map((attributs: any) => (
                                                                <TableColumn key={attributs.id}>
                                                                    {searchById(attributs.id, item.detailpemeriksaan)}
                                                                </TableColumn>
                                                            ))}

                                                        <TableColumn>
                                                            <div className="item-center gap-2 flex flex-row">
                                                                <FileDownloader
                                                                    pdfUrl={route('laporan.pemeriksaan', {
                                                                        balita: balita.id,
                                                                        pemeriksaan: item.id,
                                                                    })}
                                                                    fileName="Laporan-Pemeriksaan.pdf"
                                                                    icon={<File />}
                                                                    onDownloadStart={handleDownloadStart}
                                                                    onDownloadSuccess={handleDownloadSuccess}
                                                                    onDownloadError={handleDownloadError}

                                                                />
                                                                <Link href={route('pemeriksaan.show', { pemeriksaan: item.id, balita: balita.id })}>
                                                                    <Button
                                                                        type="submit"
                                                                        size={'xs'}
                                                                        className=" bg-blue-400 hover:bg-blue-500 md:w-16"
                                                                        tabIndex={4}
                                                                    >
                                                                        <LucideEye />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </TableColumn>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </section>
                             {dataPemeriksaanBalita.length > 1 && (
                                <section className="my-4">
                                    <GrowthChart url={defaultUrl + '/api/chart/balita/' + balita.id} title="perkembangan anak secara individual" />
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

import { useCallback, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableColumn, TableHead, TableRow, TableTh, TableContainer } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

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
    id: string;
    tgl_pemeriksaan: string;
    label: string;
}

interface DetailPemeriksaan {
    attribut: {
        nama: string;
    };
    nilai: number | string;
}

interface PemeriksaanProps {
    orangTua: OrangTua;
    balita: Balita;
    pemeriksaan: Pemeriksaan;
    detail: DetailPemeriksaan[];
    breadcrumb?: Array<{ title: string; href: string }>;
}

type CreateForm = {
    pemeriksaan_id: string;
    rekomendasi: string;
    catatan_dokter: string;
};

const DEFAULT_TEMPLATE = `<p>LAPORAN HASIL PEMERIKSAAN GIZI ANAK  </p><p>I. Riwayat Makan &amp; Pola Diet  </p><ol><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Frekuensi Makan Sehari:  </li></ol><p>   - Sarapan: ☐ Ya ☐ Tidak (Jenis: _________)  </p><p>   - Makan Siang: ☐ Ya ☐ Tidak (Jenis: _________)  </p><p>   - Makan Malam: ☐ Ya ☐ Tidak (Jenis: _________)  </p><p>   - Camilan: ____ kali/hari (Jenis: _________)</p><ol><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Kebiasaan Makan:  </li></ol><p>   - Nafsu Makan: ☐ Baik ☐ Sedang ☐ Kurang  </p><p>   - Alergi/Intoleransi Makanan: ☐ Ya (_________) ☐ Tidak  </p><p>   - Susu Formula: ☐ Ya (Jenis: _________) ☐ Tidak  </p><p>II. Asupan Gizi Harian (Estimasi)   </p><table><tbody><tr><td data-row="1">Zat Gizi </td><td data-row="1">Komsumsi Harian</td><td data-row="1">Kebutuhan Harian</td><td data-row="1">Keterangan</td></tr><tr><td data-row="2">Energi</td><td data-row="2">__________kkal</td><td data-row="2">__________kkal</td><td data-row="2">☐ Cukup ☐ Kurang ☐ Lebih</td></tr><tr><td data-row="3">Protein</td><td data-row="3">__________gram</td><td data-row="3">__________gram</td><td data-row="3">☐ Cukup ☐ Kurang ☐ Lebih</td></tr><tr><td data-row="4">Karbohidrat</td><td data-row="4">_________ gram</td><td data-row="4">_________ gram</td><td data-row="4">☐ Cukup ☐ Kurang ☐ Lebih</td></tr><tr><td data-row="5">Lemak</td><td data-row="5">_________ gram</td><td data-row="5">_________ gram</td><td data-row="5">☐ Cukup ☐ Kurang ☐ Lebih</td></tr><tr><td data-row="6">Vitamin &amp; mineral</td><td data-row="6">_____________</td><td data-row="6">_____________</td><td data-row="6">☐ Cukup ☐ Kurang ☐ Lebih</td></tr></tbody></table><p><span style="color: white;">III. Keluhan &amp; Masalah Gizi  </span></p><ol><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Keluhan Orang Tua: ________________________  </li></ol><p>IV.  Diagnisis Masalah Gizi:  </p><ol><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>☐ Kurang Energi Protein (KEP)  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>☐ Obesitas  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>☐ Stunting  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>☐ Anemia  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>☐ Lainnya: _______________  </li></ol><p>V. Rekomendasi &amp; Intervensi Gizi  </p><ol><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Diet: ________________________  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Suplementasi: ☐ Vitamin A ☐ Zat Besi ☐ Zinc ☐ Lainnya: ____  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Edukasi Gizi: ☐ Pola Makan Seimbang ☐ Higiene Makanan ☐ Lainnya: ____  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Rujukan: ☐ Dokter ☐ Puskesmas ☐ Rumah Sakit (Alasan: _________)  </li></ol><p>VI. Monitoring &amp; Evaluasi  </p><ol><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Tanggal Pemeriksaan Ulang: ____/____/____  </li><li data-list="bullet" class="ql-indent-1"><span class="ql-ui" contenteditable="false"></span>Target Perbaikan Gizi: ________________________  </li></ol><p><br></p>`;

export default function PolaMakanShow({ pemeriksaan, balita, orangTua, detail, breadcrumb }: PemeriksaanProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb]
    );
    // Memoize filtered details to avoid recalculating on every render
    const filteredDetails = useMemo(
        () => detail.filter(attr => !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase())),
        [detail]
    );

    const { data, setData, post, processing } = useForm<CreateForm>({
        pemeriksaan_id: pemeriksaan.id,
        rekomendasi: DEFAULT_TEMPLATE,
        catatan_dokter: '',
    });

    // Optimized form submission handler
    const submit = useCallback<FormEventHandler>((e) => {
        e.preventDefault();
        post(route('pola-makan.store'));
    }, [post]);

    // Optimized handlers for ReactQuill changes
    const handleRekomendasiChange = useCallback(
        (value: string) => setData('rekomendasi', value),
        [setData]
    );

    const handleCatatanDokterChange = useCallback(
        (value: string) => setData('catatan_dokter', value),
        [setData]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pola Makan Pemeriksaan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-0 lg:p-4 dark:bg-gray-950">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-gray-300 md:min-h-min dark:border-gray-700">
                    <div className="mx-auto max-w-7xl rounded-lg bg-white p-1 lg:p-8 shadow-lg dark:bg-gray-900 dark:text-white">
                        <h2 className="mb-6 text-xl font-bold tracking-tight">Detail Pemeriksaan</h2>

                        <TableContainer>
                            <Table className="w-full border-collapse">
                                <TableHead>
                                    <TableRow>
                                        <TableColumn className="text-lg">Tanggal Pemeriksaan</TableColumn>
                                        <TableColumn>{pemeriksaan.tgl_pemeriksaan}</TableColumn>
                                    </TableRow>
                                    <TableRow>
                                        <TableColumn className="text-lg">Status GIZI Anak</TableColumn>
                                        <TableColumn>{pemeriksaan.label}</TableColumn>
                                    </TableRow>
                                    <TableRow>
                                        <TableTh colSpan={2} className="bg-blue-100 p-4 text-left text-lg font-semibold text-foreground md:text-xl dark:bg-gray-800">
                                            Data Orang Tua
                                        </TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow className="border-b">
                                        <TableColumn className="w-1/3 p-3 font-medium text-foreground">Nama Orang Tua</TableColumn>
                                        <TableColumn className="p-3">{orangTua.name}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">Email Orang Tua</TableColumn>
                                        <TableColumn className="p-3">{orangTua.email}</TableColumn>
                                    </TableRow>
                                    <TableRow>
                                        <TableTh colSpan={2} className="bg-blue-100 p-4 text-left text-lg font-semibold text-foreground md:text-xl dark:bg-gray-800">
                                            Data Balita
                                        </TableTh>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">Nama Balita</TableColumn>
                                        <TableColumn className="p-3">{balita.nama}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">Tempat Lahir</TableColumn>
                                        <TableColumn className="p-3">{balita.tempat_lahir}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">Tanggal Lahir</TableColumn>
                                        <TableColumn className="p-3">{balita.tanggal_lahir}</TableColumn>
                                    </TableRow>
                                    <TableRow className="border-b">
                                        <TableColumn className="p-3 font-medium text-foreground">Jenis Kelamin</TableColumn>
                                        <TableColumn className="p-3">{balita.jenis_kelamin}</TableColumn>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <section className="mb-4">
                                <h2 className="bg-blue-100 text-foreground p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">
                                    Data Pemeriksaan Antropometri
                                </h2>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {filteredDetails.map((item, index) => (
                                                <TableRow key={`${item.attribut.nama}-${index}`} className="border-b py-1">
                                                    <TableColumn className="font-normal w-1/3 text-foreground">
                                                        {item.attribut.nama}:
                                                    </TableColumn>
                                                    <TableColumn>{item.nilai}</TableColumn>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </section>

                            <section className="mb-4">
                                <h2 className="bg-accent mb-4 border-b pb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    Pola Makan
                                </h2>
                                <div className="mb-2">
                                    <Label htmlFor="rekomendasi">Rekomendasi Makanan</Label>
                                    <ReactQuill
                                        theme="snow"
                                        value={data.rekomendasi}
                                        onChange={handleRekomendasiChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <Label htmlFor="catatan_dokter">Catatan Dokter</Label>
                                    <ReactQuill
                                        theme="snow"
                                        value={data.catatan_dokter}
                                        onChange={handleCatatanDokterChange}
                                    />
                                </div>
                            </section>

                            <section className="mb-3">
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    className="mt-2 w-full"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Simpan
                                </Button>
                            </section>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

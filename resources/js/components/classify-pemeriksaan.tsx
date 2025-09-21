/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import { SharedData } from '@/types';
import { fetchNutritionData } from '@/utils/api';
import { predictNutritionStatus } from '@/utils/naiveBayes/prediction';
import { trainModel } from '@/utils/naiveBayes/training';
import { NutritionData } from '@/utils/types';
import { usePage } from '@inertiajs/react';
import { LoaderCircle, SquareCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from './ui/toast';
interface OrangTua {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface BalitaTypes {
    id: string;
    nama: string;
    tanggal_lahir: string;
    tempat_lahir: string;
    orangtua: {
        name: string;
    };
    jenis_kelamin: string;
    alamat: string;
}

export interface PemeriksaanCreateProps {
    breadcrumb?: { title: string; href: string }[];
    balita: BalitaTypes[];
    attribut: {
        id: string;
        nama: string;
    }[];
    orangtua: OrangTua[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateForm = {
    orang_tua_id: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    tanggal_pemeriksaan: string;
    attribut: {
        nilai: string | null;
        attribut_id: string;
        name: string;
    }[];
    label: string;
    alasan: string;
    rekomendasi: string;
    usia_balita: string;
    detail: string[];
};

interface ClassifyPemeriksaanProps {
    data: any;

    setData: any;
    errors: any;
    processing: boolean;
    balita: BalitaTypes[];
    attribut: {
        id: string;
        nama: string;
    }[];
    orangtua: OrangTua[];
    submit: (e: any) => void;
    canSubmit?: boolean;
}
export default function ClassifyPemeriksaan({ data, setData, errors, attribut, processing, submit, canSubmit }: ClassifyPemeriksaanProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const today = new Date();
    const [attributError, setAttributError] = useState<string | null>(null);
    const [dataset, setDataset] = useState<NutritionData[]>([]);
    const [model, setModel] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        title: string;
        show: boolean;
        message: string;
        type: 'success' | 'default' | 'error';
    }>({
        title: '',
        show: false,
        message: '',
        type: 'success',
    });
    useEffect(() => {
        const initializeModel = async () => {
            try {
                setIsLoading(true);
                const data = await fetchNutritionData();
                setDataset(data.dataset);

                const trainedModel = await trainModel(data.dataset);
                setModel(trainedModel);
            } catch (err) {
                setError('Gagal memuat data atau melatih model');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeModel();
    }, []);
    const submitClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setAttributError('');
        if (!model) {
            setError('Model belum siap');
            return;
        }
        if (data.orang_tua_id !== '') {
            if (data.attribut.some((item: any) => item.nilai === null) || data.attribut.some((item: any) => item.nilai === '0')) {
                setAttributError(
                    'Nilai Tidak Valid!. Pastikan semua pengukuran (BB, TB, Lingkar Kepala, Lingkar Lengan) diisi dengan nilai yang benar dan tidak nol.',
                );
                return;
            } else {
                setIsLoading(false);
                setAttributError(null);
                const datauji: any = [];
                datauji.push({
                    ['jenis kelamin']: data.jenis_kelamin,
                });
                data.attribut.map((item: any) => {
                    datauji.push({
                        [item.name.toLowerCase()]: item.nilai,
                    });
                });
                const label = predictNutritionStatus(model, datauji);
                setError(null);
                setData('label', label);
                const usia = hitungBulanUsia(data.tanggal_lahir);
                setData('alasan', alasan.find((item) => item.gizi === label)?.alasan || '');
                setData('rekomendasi', rekomendasi(label, Number(usia), data.jenis_kelamin));
                setData('detail', datauji);
                setOpenDialog(true);
            }
        } else {
            setAttributError('Anda belum login, silahkan login terlebih dahulu');
        }
    };

    // Hitung tanggal minimum: 1 tahun lalu dari hari ini
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];

    const tanggalLahirRef = useRef<HTMLInputElement>(null);
    const handleChangeTanggalLahir = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tgl = e.target.value;
        if (tgl <= minDate) {
            const birthDate = new Date(tgl);
            const today = new Date();
            let usia = today.getFullYear() - birthDate.getFullYear();
            let bulan = today.getMonth() - birthDate.getMonth();

            if (bulan < 0) {
                usia--;
                bulan += 12;
            }
            if (usia > 0) {
                usia *= 12;
                usia += bulan;
            }
            if (usia > 60) {
                setToast({
                    title: 'Informasi',
                    show: true,
                    message: 'Usia Anak hanya untuk usia 12-60 bulan',
                    type: 'error',
                });
            } else {
                setData('tanggal_lahir', tgl);

                setData(
                    'attribut',
                    data.attribut.map((val: any) => {
                        if (val.name === 'Usia Balita (bulan)') {
                            return { ...val, nilai: usia.toString() };
                        }
                        return val;
                    }),
                );
            }
        }
    };
    const HandleChangeInputValue = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        item: {
            id: string;
            nama: string;
        },
    ) => {
        let input = e.target.value;
        // Validasi input untuk memastikan hanya angka yang diizinkan
        if (!/^\d*\.?\d*$/.test(input)) {
            return;
        } else {
            if (item.nama.toLowerCase() === 'lingkar kepala (cm)' || item.nama.toLowerCase() === 'lingkar lengan (cm)') {
                if (Number(input) > 60) {
                    input = '60';
                }
            }
            if (item.nama.toLowerCase() === 'tinggi badan (cm)') {
                if (Number(input) > 200) {
                    input = '200';
                }
            }
            setData(
                'attribut',
                data.attribut.map((val: any, i: any) => (i === index ? { nilai: input, attribut_id: item.id, name: item.nama } : val)),
            );
        }
        // Jika atribut adalah "Usia Balita (bulan)", hitung usia berdasarkan tanggal lah
    };
    return (
        <>
            <Toast
                open={toast.show}
                onOpenChange={() => setToast((prev) => ({ ...prev, show: false }))}
                title={toast.title}
                description={toast.message}
                duration={10000}
                variant={toast.type}
            />

            <form onSubmit={submitClass} className="flex flex-col gap-6">
                {error && (
                    <div className="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                <div className="grid gap-6">
                    <div className="flex items-center gap-4 border-b">
                        <Label htmlFor="tanggal_pemeriksaan">Tanggal Pemeriksaan</Label>

                        <div className="block">
                            <Input
                                id="tanggal_pemeriksaan"
                                type="date"
                                className="w-max"
                                required
                                readOnly
                                tabIndex={2}
                                autoComplete="tanggal_pemeriksaan"
                                value={data.tanggal_pemeriksaan}
                                onChange={(e) => setData('tanggal_pemeriksaan', e.target.value)}
                                disabled={isLoading}
                            />
                            <InputError message={errors.tanggal_pemeriksaan} />
                        </div>
                    </div>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableColumn>
                                        <div className="grid gap-2">
                                            <Label htmlFor="nama">Nama Balita</Label>
                                            <Input
                                                id="nama"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="nama"
                                                value={data.nama}
                                                onChange={(e) => setData('nama', e.target.value)}
                                                disabled={isLoading}
                                                placeholder="Nama Balita"
                                            />
                                            <InputError message={errors.nama} className="mt-2" />
                                        </div>
                                    </TableColumn>
                                    <TableColumn>
                                        <div className="grid gap-2">
                                            <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                            <div className="flex gap-2">
                                                <InputRadio
                                                    id="jenis1"
                                                    name="jenis_kelaim"
                                                    label="Laki-laki"
                                                    value="Laki-laki"
                                                    required
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="border-red-500"
                                                    labelClassName="text-gray-800 dark:text-white"
                                                />
                                                <InputRadio
                                                    id="jenis2"
                                                    name="jenis_kelaim"
                                                    label="Perempuan"
                                                    required
                                                    value="Perempuan"
                                                    onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                    className="border-red-500"
                                                    labelClassName="text-gray-800 dark:text-white"
                                                />
                                            </div>
                                            <InputError message={errors.jenis_kelamin} />
                                        </div>
                                    </TableColumn>

                                    <TableColumn>
                                        <div className="col-span-1 block">
                                            <Label htmlFor="tempat_lahir">Tempat/Tanggal Lahir</Label>
                                            <div className="item-center flex gap-0">
                                                <div>
                                                    <Input
                                                        id="tempat_lahir"
                                                        type="text"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="tempat_lahir"
                                                        value={data.tempat_lahir}
                                                        disabled={isLoading}
                                                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                                                        placeholder="Tempat lahir"
                                                    />
                                                    <InputError message={errors.tempat_lahir} />
                                                </div>
                                                <div className="col-span-2 grid gap-2">
                                                    <Input
                                                        id="tanggal_lahir"
                                                        type="date"
                                                        ref={tanggalLahirRef}
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="tanggal_lahir"
                                                        value={data.tanggal_lahir}
                                                        disabled={isLoading}
                                                        max={minDate}
                                                        onChange={(e) => handleChangeTanggalLahir(e)}
                                                    />
                                                    <InputError message={errors.tanggal_lahir} />
                                                </div>
                                            </div>
                                        </div>
                                    </TableColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableTh colSpan={2} className="text-center">
                                        Data Antropometri:
                                    </TableTh>
                                </TableRow>
                                <TableRow>
                                    {attributError && (
                                        <TableColumn colSpan={2} className="bg-white text-left text-red-500">
                                            {attributError}
                                        </TableColumn>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attribut
                                    .filter((item) => !['jenis kelamin', 'status'].includes(item.nama.toLowerCase()))
                                    .map((item, index) => {
                                        let ket: string | null = null;
                                        if (item.nama.includes('Lingkar Kepala')) {
                                            ket = '  Range normal usia 1-5 thn: 44-54 cm';
                                        } else if (item.nama.includes('Lingkar Lengan')) {
                                            ket = '  Range normal usia 1-5 thn:12-21 cm';
                                        }
                                        return (
                                            <TableRow key={item.id}>
                                                <TableColumn>
                                                    {item.nama} {ket && <span className="text-destructive text-xs">{ket}</span>}
                                                </TableColumn>
                                                <TableColumn>
                                                    <Input
                                                        type="text"
                                                        id={`kriteria.${index}`}
                                                        value={data.attribut[index].nilai ?? ''}
                                                        disabled={isLoading}
                                                        defaultValue={0}
                                                        max={item.nama.toLowerCase() === 'lingkar kepala (cm)' ? 60 : 200}
                                                        min={0}
                                                        required
                                                        placeholder={`masukkan ${item.nama}`}
                                                        readOnly={item.nama.toLowerCase() === 'usia balita (bulan)'}
                                                        onChange={(e) => HandleChangeInputValue(e, index, item)}
                                                    />
                                                    <InputError message={(errors as any)[`attribut.${index}.nilai`]} />
                                                    <InputError message={(errors as any)[`attribut.${index}.attribut_id`]} />
                                                </TableColumn>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button type="submit" variant="secondary" className="mt-2 w-full" tabIndex={5} disabled={isLoading}>
                        {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />} Proses Klasifikasi
                    </Button>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger />
                        <DialogContent>
                            <DialogTitle>
                                <div className="flex items-center justify-start gap-2">
                                    <SquareCheck className="size-5 bg-green-500 text-white" /> <span>Hasil Klasifikasi</span>
                                </div>
                            </DialogTitle>
                            <DialogDescription>
                                <div>
                                    <div className="block list-none space-y-1">
                                        <div className="flex gap-3">
                                            <span className="text-foreground font-semibold">Nama Anak:</span>
                                            <span className="text-foreground/90 font-normal">{data.nama}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-foreground font-semibold">Tanggal Lahir:</span>
                                            <span className="text-foreground/90 font-normal">{data.tanggal_lahir}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-foreground font-semibold">usia:</span>
                                            <span className="text-foreground/90 font-normal">{hitungUsia(data.tanggal_lahir)}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-foreground font-semibold">Status Gizi:</span>
                                            <span className="text-foreground/90 font-normal">{data.label}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-foreground font-semibold whitespace-nowrap">Alasan:</span>
                                            <span className="text-foreground/90 font-normal">{data.alasan}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-foreground font-semibold">Rekomendasi:</span>
                                            <span className="text-foreground/90 font-normal">{data.rekomendasi}</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogDescription>
                            {canSubmit ? (
                                <DialogFooter>
                                    <Button type="button" variant="default" size="sm" className="flex-1" disabled={processing} onClick={submit}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            ) : (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                    disabled={processing}
                                    onClick={() => setOpenDialog(false)}
                                >
                                    Keluar
                                </Button>
                            )}
                            <DialogClose />
                        </DialogContent>
                    </Dialog>
                </div>
            </form>
        </>
    );
}
const alasan = [
    {
        gizi: 'gizi buruk',
        alasan: 'Kondisi ini biasanya terjadi karena kurangnya asupan energi dan protein dalam waktu yang cukup lama dan disebabkan oleh faktor lingkungan dan pola asuh yang tidak baik',
    },
    {
        gizi: 'gizi kurang',
        alasan: 'Kondisi ini biasanya disebabkan oleh kurangnya konsumsi makanan berprotein atau disebabkan oleh faktor lingkungan dan pola asuh yang kurang baik',
    },
    {
        gizi: 'gizi baik',
        alasan: 'Kondisi ini menunjukkan bahwa asupan makanannya sudah cukup atau seimbang serta lingkungan dan pola asuh yang baik.',
    },
    {
        gizi: 'gizi lebih',
        alasan: 'Kondisi ini biasanya disebabkan oleh asupan makanan berlebihan seperti makanan tinggi kalori, lemak, dan gula atau pola makan yang tidak sehat.',
    },
];
function hitungUsia(tanggalLahir: string) {
    const birthDate = new Date(tanggalLahir);
    const today = new Date();

    let tahun = today.getFullYear() - birthDate.getFullYear();
    let bulan = today.getMonth() - birthDate.getMonth();
    let hari = today.getDate() - birthDate.getDate();

    if (hari < 0) {
        bulan--;
        hari += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // total hari bulan sebelumnya
    }

    if (bulan < 0) {
        tahun--;
        bulan += 12;
    }

    return `${tahun} tahun, ${bulan} bulan, ${hari} hari`;
}

function hitungBulanUsia(tanggalLahir: string) {
    const birthDate = new Date(tanggalLahir);
    const today = new Date();
    let usia = today.getFullYear() - birthDate.getFullYear();
    let bulan = today.getMonth() - birthDate.getMonth();

    if (bulan < 0) {
        usia--;
        bulan += 12;
    }
    if (usia > 0) {
        usia *= 12;
        usia += bulan;
    }
    return usia;
}

const rekomendasi = (label: string, usia: number, jenis_kelamin: string) => {
    let rekomendasi; // Declare rekomendasi before the switch statement

    console.log(label, usia, jenis_kelamin);
    if (jenis_kelamin === 'Laki-laki') {
        if (usia >= 11 && usia <= 23) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang kaya akan protein, mineral, dan vitamin, sajikan makanan secara bervariasi dan mudah dicerna seperti bubur bergizi yang dicampur dengan lauk hewani atau nabati. Berikan 3x makan utama dan 2x selingan setiap hari.  Tetap berikan ASI yang cukup untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 850 – 1.050 kcal/hari';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang yang mengandung protein, mineral, dan vitamin, sajikan makanan secara bervariasi dan teratur yang mudah dicerna oleh anak seperti bubur. Berikan 3x makan utama dan 2x selingan setiap hari., serta tetap dilengkapi dengan pemberian ASI yang cukup untuk mendukung pertumbuhan optimal, dengan kebutuhan energi totalnya sekitar 850 – 1.050 kcal/hari.';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan memberi makanan yang mengandung karbohidrat, protein, sayur, dan buah. Berikan 3x makan utama dan 2x selingan setiap hari. Sajikan makanan secara bervariasi, mudah dicerna, dan tetap lengkapi dengan ASI untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 850 – 1.050 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan 3x makan utama dan 2x selingan setiap hari. Berikan ASI sesuai kebutuhan dan dorong anak untuk aktif bergerak agar keseimbangan energi terjaga, dengan kebutuhan kalori/hari sekitar 850 – 1.050 kcal/hari';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        } else if (usia >= 24 && usia <= 35) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), ditambah sayur dan buah segar dan camilan bergizi seperti pisang atau biskuit bayi untuk meningkatkan asupan energi. Berikan 3x makan utama dan 2x selingan setiap hari. Tetap berikan ASI yang cukup untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 950 – 1.150 kcal/hari';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang seperti nasi, lauk hewani atau nabati (seperti ikan, ayam, telur), sayur, dan buah segar. Berikan 3x makan utama dan 2x camilan sehat setiap hari. Jika masih menyusui, tetap berikan ASI untuk mendukung pertumbuhan dan perbaikan gizi anak, dengan kebutuhan energi totalnya sekitar 950 – 1.150 kcal/hari';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan nasi, lauk hewani atau nabati, sayur, dan buah. Berikan 3x makan utama dan 2x camilan bergizi setiap hari. Berikan makanan yang bervariasi, mudah dikunyah, dan disukai anak. Jika masih menyusui, tetap berikan ASI untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 950 – 1.150 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan 3x makan utama dan 2x camilan bergizi setiap hari. Berikann ASI sesuai kebutuhan dan dorong anak untuk aktif bergerak agar keseimbangan energi terjaga, dengan kebutuhan kalori/hari sekitar 950 – 1.150 kcal/hari.';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        } else if (usia >= 36 && usia <= 47) {
            console.log('masuk 36-47');
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), sayur dan buah segar. Berikan 3x makan utama dan 2x cemilan bergizi setiap hari. Berikan cemilan bergizi seperti pisang, roti, atau biskuit sehat dan susu yang bernutrisi untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), sayur dan buah segar. Berikan 3x makan utama dan 2x cemilan bergizi setiap hari. Berikan cemilan bergizi seperti pisang, roti, atau biskuit sehat dan susu yang bernutrisi untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan memberikan nasi, lauk hewani atau nabati seperti (ayam, ikan, tahu, atau tempe), sayur, dan buah segar setiap hari. Sajikan 3x makan utama dan 2x kali cemilan sehat secara teratur. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari. ';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        } else if (usia >= 48 && usia < 60) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), sayur dan buah segar. Berikan 3x makan utama dan 2x cemilan bergizi setiap hari. Berikan cemilan bergizi seperti pisang, roti, atau biskuit sehat dan susu yang bernutrisi untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang seperti nasi, lauk hewani atau nabati (seperti ikan, ayam, tahu, atau tempe), sayur dan buah segar. Berikan 3x makan utama dan 2x camilan sehat setiap hari. Berikan susu yang bernutrisi untuk mendukung pertumbuhan dan perbaikan gizi anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan memberikan nasi, lauk hewani atau nabati seperti (ayam, ikan, tahu, atau tempe), sayur, dan buah segar setiap hari. Sajikan 3x makan utama dan 2x kali cemilan sehat secara teratur. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan 3x makan utama dan 2x camilan bergizi setiap hari. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari. ';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        }
    } else if (jenis_kelamin == 'Perempuan') {
        if (usia >= 11 && usia <= 23) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang kaya akan protein, mineral, dan vitamin, sajikan makanan secara bervariasi dan mudah dicerna seperti bubur bergizi yang dicampur dengan lauk hewani atau nabati. Berikan 3x makan utama dan 2x selingan setiap hari.  Tetap berikan ASI yang cukup untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 850 – 1.050 kcal/hari.';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang yang mengandung protein, mineral, dan vitamin, sajikan makanan secara bervariasi dan teratur yang mudah dicerna oleh anak seperti bubur. Berikan 3x makan utama dan 2x selingan setiap hari., serta tetap dilengkapi dengan pemberian ASI yang cukup untuk mendukung pertumbuhan optimal, dengan kebutuhan energi totalnya sekitar 850 – 1.050 kcal/hari.';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan memberi makanan yang mengandung karbohidrat, protein, sayur, dan buah. Berikan 3x makan utama dan 2x selingan setiap hari. Sajikan makanan secara bervariasi, mudah dicerna, dan tetap lengkapi dengan ASI untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 850 – 1.050 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan 3x makan utama dan 2x selingan setiap hari. Berikan ASI sesuai kebutuhan dan dorong anak untuk aktif bergerak agar keseimbangan energi terjaga, dengan kebutuhan kalori/hari sekitar 850 – 1.050 kcal/hari.';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        } else if (usia >= 24 && usia <= 35) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), ditambah sayur dan buah segar dan camilan bergizi seperti pisang atau biskuit bayi untuk meningkatkan asupan energi. Berikan 3x makan utama dan 2x selingan setiap hari. Tetap berikan ASI yang cukup untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 950 – 1.150 kcal/hari.';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang seperti nasi, lauk hewani atau nabati (seperti ikan, ayam, telur), sayur, dan buah segar. Berikan 3x makan utama dan 2x camilan sehat setiap hari. Jika masih menyusui, tetap berikan ASI untuk mendukung pertumbuhan dan perbaikan gizi anak, dengan kebutuhan energi totalnya sekitar 950 – 1.150 kcal/hari.';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan nasi, lauk hewani atau nabati, sayur, dan buah. Berikan 3x makan utama dan 2x camilan bergizi setiap hari. Berikan makanan yang bervariasi, mudah dikunyah, dan disukai anak. Jika masih menyusui, tetap berikan ASI untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 950 – 1.150 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan 3x makan utama dan 2x camilan bergizi setiap hari. Berikann ASI sesuai kebutuhan dan dorong anak untuk aktif bergerak agar keseimbangan energi terjaga, dengan kebutuhan kalori/hari sekitar 950 – 1.150 kcal/hari.';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        } else if (usia >= 36 && usia <= 47) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), sayur dan buah segar. Berikan 3x makan utama dan 2x cemilan bergizi setiap hari. Berikan cemilan bergizi seperti pisang, roti, atau biskuit sehat dan susu yang bernutrisi untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari.';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang seperti nasi, lauk hewani atau nabati (seperti ikan, ayam, tahu, atau tempe), sayur dan buah segar. Berikan 3x makan utama dan 2x camilan sehat setiap hari. Berikan susu yang bernutrisi untuk mendukung pertumbuhan dan perbaikan gizi anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari.';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan memberikan nasi, lauk hewani atau nabati seperti (ayam, ikan, tahu, atau tempe), sayur, dan buah segar setiap hari. Sajikan 3x makan utama dan 2x kali cemilan sehat secara teratur. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.050 – 1.250 kcal/hari.';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        } else if (usia >= 48 && usia < 60) {
            switch (label) {
                case 'gizi buruk':
                    rekomendasi =
                        'Berikan makanan yang tinggi kalori dan protein seperti nasi dengan lauk hewani (ikan, ayam, telur), sayur dan buah segar. Berikan 3x makan utama dan 2x cemilan bergizi setiap hari. Berikan cemilan bergizi seperti pisang, roti, atau biskuit sehat dan susu yang bernutrisi untuk mendukung pemulihan gizi anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break; // Don't forget break to prevent fall-through
                case 'gizi kurang':
                    rekomendasi =
                        'Berikan makanan bergizi seimbang seperti nasi, lauk hewani atau nabati (seperti ikan, ayam, tahu, atau tempe), sayur dan buah segar. Berikan 3x makan utama dan 2x camilan sehat setiap hari. Berikan susu yang bernutrisi untuk mendukung pertumbuhan dan perbaikan gizi anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break;
                case 'gizi baik':
                    rekomendasi =
                        'Pertahankan pola makan seimbang dengan memberikan nasi, lauk hewani atau nabati seperti (ayam, ikan, tahu, atau tempe), sayur, dan buah segar setiap hari. Sajikan 3x makan utama dan 2x kali cemilan sehat secara teratur. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break;
                case 'gizi lebih':
                    rekomendasi =
                        'Kurangi makanan tinggi lemak, gula, dan olahan seperti camilan kemasan. Atur porsi makan secara bertahap, tetap berikan makanan bergizi seimbang dengan sayur, buah, dan protein tanpa lemak. Berikan 3x makan utama dan 2x camilan bergizi setiap hari. Berikan susu yang bernutrisi untuk mendukung pertumbuhan anak, dengan kebutuhan energi totalnya sekitar 1.150 – 1.350 kcal/hari.';
                    break;
                default:
                    rekomendasi = 'Label gizi tidak dikenali.';
                    break;
            }
        }
    }

    return rekomendasi;
};

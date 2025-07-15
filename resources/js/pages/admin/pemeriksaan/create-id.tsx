import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, SquareCheck } from 'lucide-react';
import React, { FormEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
const alasan = [
    {gizi: 'gizi buruk', alasan: "Anak termasuk gizi buruk karena berat badan dan tinggi badan jauh di bawah standar usia menurut WHO (kurang dari -3 SD). Kondisi ini biasanya terjadi karena kurangnya asupan energi dan protein dalam waktu yang cukup lama."},
    {gizi: 'gizi kurang', alasan: "Anak termasuk gizi kurang karena berat badan dan tinggi badan berada di bawah standar usia menurut WHO (-3 SD sampai kurang dari -2 SD). Kondisi ini biasanya disebabkan oleh kurangnya konsumsi makanan berprotein seperti telur, ikan, dan daging."},
    {gizi: 'gizi baik', alasan: "Anak termasuk gizi baik karena berat badan dan tinggi badan sesuai dengan standar usia menurut WHO (-2 SD sampai +2 SD). Ini menunjukkan bahwa asupan makanannya sudah cukup dan seimbang."},
    {gizi: "gizi lebih", alasan:"Anak termasuk gizi lebih karena berat badan dan tinggi badan melebihi standar usia menurut WHO (lebih dari +2 SD). Kondisi ini biasanya disebabkan oleh kelebihan konsumsi makanan berkalori tinggi seperti makanan manis dan berlemak."},
]

export default function PemeriksaanCreate({ breadcrumb, balita, attribut, orangtua }: PemeriksaanCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const today = new Date();
    const day = today.toISOString().split('T')[0];
    const { data, setData, get, post, processing, errors } = useForm<CreateForm>({
        orang_tua_id: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        tanggal_pemeriksaan: day,
        attribut: attribut.map((attr) => ({ nilai: null, attribut_id: attr.id, name: attr.nama })),
        label: '',
        alasan: '',
        rekomendasi: '',
        usia_balita: '',
        detail: [],
    });
    // State for selected parent
    const [selectedOrangtua, setSelectedOrangtua] = useState<OrangTua | null>(null);
    const [idOrangTua, setIdOrangTua] = useState('');
    // Optimized parent search function
    const searchById = useCallback(
        (search: string): OrangTua | null => {
            if (!orangtua?.length || !search) return null;
            return orangtua.find((element) => element.id === search) ?? null;
        },
        [orangtua],
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [listOrangTua, setListOrangTua] = useState<OrangTua[]>([]);
    const [showlist, setShowList] = useState(false);
    const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSearchTerm(input);
        if (input.length > 2) {
            const filteredList = orangtua.filter(
                (orangtua) => orangtua.name.toLowerCase().includes(input.toLowerCase()) || orangtua.email.toLowerCase().includes(input.toLowerCase()),
            );
            setListOrangTua(filteredList);
            if (filteredList.length > 0) {
                setShowList(true);
            }
        } else {
            setListOrangTua([]);
            setShowList(false);
        }
    };

    // Effect for handling parent selection
    useEffect(() => {
        if (idOrangTua) {
            const foundParent = searchById(idOrangTua);
            setSelectedOrangtua(foundParent);
            if (foundParent) {
                setShowList(false);
                setData('orang_tua_id', foundParent.id);
            }
        }
    }, [idOrangTua, searchById, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pemeriksaan.store'), {
            onError: (err) => console.log(err),
        });
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const [isLoading, setIsLoading] = useState(false);
    const submitClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await axios
            .get(route('pemeriksaan.create-classification'), {
                params: {
                    attribut: data.attribut,
                    jenis_kelamin: data.jenis_kelamin,
                },
            })
            .then((response :any) => {
                if (response.status === 200) {
                    const { label, rekomendasi, detail } = response.data;
                    setData('label', label);
                    setData('alasan', alasan.find((item) => item.gizi === label)?.alasan || '');
                    setData('rekomendasi', rekomendasi);
                    setData('detail', detail);
                    setOpenDialog(true);
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    };
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
    // Hitung tanggal minimum: 1 tahun lalu dari hari ini
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];

    const tanggalLahirRef = useRef<HTMLInputElement>(null);
    const [usiaState, setUsiaState] = useState<number>(0);
    useEffect(() => {
        if (tanggalLahirRef && tanggalLahirRef.current) {
            if (tanggalLahirRef.current.value) {
                const tgl = tanggalLahirRef.current.value;
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
                setData(
                    'attribut',
                    data.attribut.map((val) => {
                        if (val.name === 'Usia Balita (bulan)') {
                            return { ...val, nilai: usia.toString() };
                        }
                        return val;
                    }),
                );
                setUsiaState(usia);
            }
        }
    }, [data.tanggal_lahir, setData]);

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
            if(item.nama.toLowerCase() === 'lingkar kepala (cm)' ||  item.nama.toLowerCase() === 'lingkar lengan (cm)'){
                if(Number(input) > 60){
                    input = '60';
                }
            }
            if(item.nama.toLowerCase() === 'tinggi badan (cm)'){
                if(Number(input) > 200){
                    input = '200';
                }
            }
            setData(
                'attribut',
                data.attribut.map((val, i) => (i === index ? { nilai: input, attribut_id: item.id, name: item.nama } : val)),
            );
        }
        // Jika atribut adalah "Usia Balita (bulan)", hitung usia berdasarkan tanggal lah
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form onSubmit={submitClass} className="flex flex-col gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="orang_tua">Nama Orang Tua</Label>
                                        <div className="relative w-full p-2">
                                            <Input
                                                type="search"
                                                id="orang_tua"
                                                placeholder="cari berdasarkan nama atau email yang terdaftar"
                                                required
                                                value={searchTerm}
                                                onChange={(e) => handleSearchUser(e)}
                                            />
                                            {showlist && (
                                                <div className="absolute top-10 rounded-xl bg-white p-2 shadow-lg">
                                                    <ul>
                                                        {listOrangTua.map((orangtua) => (
                                                            <li
                                                                key={orangtua.id}
                                                                onClick={() => setIdOrangTua(orangtua.id)}
                                                                className="cursor-pointer p-2 hover:bg-gray-200"
                                                            >
                                                                {orangtua.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.orang_tua_id} />
                                    </div>

                                    {selectedOrangtua && (
                                        <div className="block space-y-4 rounded-lg border p-2">
                                            <div className="flex gap-2">
                                                <Label className="text-muted-foreground">Nama Orang Tua:</Label>
                                                <Label className="font-normal">{selectedOrangtua.name}</Label>
                                            </div>
                                            <div className="flex gap-2">
                                                <Label className="text-muted-foreground">Email Orang Tua:</Label>
                                                <Label className="font-normal">{selectedOrangtua.email}</Label>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
                                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                                className="border-red-500"
                                                                labelClassName="text-gray-800 dark:text-white"
                                                            />
                                                            <InputRadio
                                                                id="jenis2"
                                                                name="jenis_kelaim"
                                                                label="Perempuan"
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
                                                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                                />
                                                                <InputError message={errors.tanggal_lahir} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableColumn>
                                            </TableRow>
                                            <TableRow>
                                                <TableColumn>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="alamat">alamat</Label>
                                                        <Input
                                                            id="alamat"
                                                            type="text"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            autoComplete="alamat"
                                                            value={data.alamat}
                                                            onChange={(e) => setData('alamat', e.target.value)}
                                                            disabled={isLoading}
                                                            placeholder="alamat Balita"
                                                        />
                                                        <InputError message={errors.alamat} className="mt-2" />
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
                                        </TableHead>
                                        <TableBody>
                                            {attribut
                                                .filter((item) => !['jenis kelamin', 'status'].includes(item.nama.toLowerCase()))
                                                .map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableColumn>{item.nama}</TableColumn>
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
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Button type="submit" variant="secondary" className="mt-2 w-full" tabIndex={5} disabled={isLoading}>
                                    {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />} Proses Klasifikasi
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
                    <DialogFooter>
                        <Button type="button" variant="default" size="sm" className="flex-1" disabled={processing} onClick={submit}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                    <DialogClose />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

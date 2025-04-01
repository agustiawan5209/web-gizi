import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

interface OrangTua {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface Attribute {
    id: string;
    nama: string;
}

interface AttributeValue {
    nilai: string;
    attribut_id: string;
}

interface PemeriksaanCreateProps {
    breadcrumb?: Array<{ title: string; href: string }>;
    orangtua: OrangTua[];
    attribut: Attribute[];
}

interface CreateForm {
    [key: string]: any;
    orang_tua_id: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    tanggal_pemeriksaan: string;
    attribut: AttributeValue[];
}

export default function PemeriksaanCreate({ breadcrumb, orangtua, attribut }: PemeriksaanCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => breadcrumb?.map((item) => ({ title: item.title, href: item.href })) ?? [], [breadcrumb]);

    // Initialize form data with proper types
    const initialFormData: CreateForm = useMemo(
        () => ({
            orang_tua_id: '',
            nama: '',
            tempat_lahir: '',
            tanggal_lahir: '',
            jenis_kelamin: '',
            tanggal_pemeriksaan: '',
            attribut: attribut.map((attr) => ({
                nilai: '',
                attribut_id: attr.id,
            })),
        }),
        [attribut],
    );

    const { data, setData, post, processing, errors } = useForm<CreateForm>(initialFormData);

    // State for selected parent
    const [selectedOrangtua, setSelectedOrangtua] = useState<OrangTua | null>(null);
    const [idOrangTua, setIdOrangTua] = useState('');

    // Memoize filtered attributes to avoid recalculating on every render
    const filteredAttributes = useMemo(() => attribut.filter((item) => !['jenis kelamin', 'status'].includes(item.nama.toLowerCase())), [attribut]);

    // Optimized parent search function
    const searchById = useCallback(
        (search: string): OrangTua | null => {
            if (!orangtua?.length || !search) return null;
            return orangtua.find((element) => element.name === search) ?? null;
        },
        [orangtua],
    );

    // Effect for handling parent selection
    useEffect(() => {
        if (idOrangTua) {
            const foundParent = searchById(idOrangTua);
            console.log(foundParent);
            setSelectedOrangtua(foundParent);
            if (foundParent) setData('orang_tua_id', foundParent.id);
        }
    }, [idOrangTua, searchById, setData]);

    // Optimized form submission handler
    const submit: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            post(route('pemeriksaan.store'));
        },
        [post],
    );

    // Optimized handler for attribute changes
    const handleAttributeChange = useCallback(
        (index: number, value: string) => {
            setData(
                'attribut',
                data.attribut.map((val, i) => (i === index ? { ...val, nilai: value } : val)),
            );
        },
        [data.attribut, setData],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="orang_tua">Pilih Berdasarkan Nama Orang Tua</Label>
                                    <Select value={idOrangTua} onValueChange={setIdOrangTua} disabled={processing}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Orang Tua" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Orang Tua</SelectLabel>
                                                {orangtua.map((item) => (
                                                    <SelectItem key={item.id} value={item.name}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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

                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama Balita</Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        required
                                        autoFocus
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        disabled={processing}
                                        placeholder="Nama Balita"
                                    />
                                    <InputError message={errors.nama} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                        <Input
                                            id="tempat_lahir"
                                            type="text"
                                            required
                                            value={data.tempat_lahir}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            disabled={processing}
                                            placeholder="Tempat lahir"
                                        />
                                        <InputError message={errors.tempat_lahir} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            required
                                            value={data.tanggal_lahir}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.tanggal_lahir} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Jenis Kelamin</Label>
                                    <div className="flex gap-4">
                                        <InputRadio
                                            id="jenis1"
                                            name="jenis_kelamin"
                                            label="Laki-laki"
                                            value="Laki-laki"
                                            checked={data.jenis_kelamin === 'Laki-laki'}
                                            disabled={processing}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        />
                                        <InputRadio
                                            id="jenis2"
                                            name="jenis_kelamin"
                                            label="Perempuan"
                                            value="Perempuan"
                                            checked={data.jenis_kelamin === 'Perempuan'}
                                            disabled={processing}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.jenis_kelamin} />
                                </div>

                                <div className="block py-2">
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableTh>Attribut</TableTh>
                                                    <TableTh>Input</TableTh>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableColumn>
                                                        <Label htmlFor="tanggal_pemeriksaan">Tanggal Pemeriksaan</Label>
                                                    </TableColumn>
                                                    <TableColumn>
                                                        <Input
                                                            id="tanggal_pemeriksaan"
                                                            type="date"
                                                            required
                                                            value={data.tanggal_pemeriksaan}
                                                            onChange={(e) => setData('tanggal_pemeriksaan', e.target.value)}
                                                            disabled={processing}
                                                        />
                                                        <InputError message={errors.tanggal_pemeriksaan} />
                                                    </TableColumn>
                                                </TableRow>

                                                {filteredAttributes.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableColumn>
                                                            <Label htmlFor={`attribut-${item.id}`}>{item.nama}</Label>
                                                        </TableColumn>
                                                        <TableColumn>
                                                            <Input
                                                                type="number"
                                                                id={`attribut-${item.id}`}
                                                                value={data.attribut[index]?.nilai || ''}
                                                                disabled={processing}
                                                                onChange={(e) => handleAttributeChange(index, e.target.value)}
                                                            />
                                                            <InputError message={errors[`attribut.${index}.nilai`] as string} />
                                                        </TableColumn>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                                <Button type="submit" variant="secondary" className="mt-2 w-full" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

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
import { FormEventHandler, useEffect, useState } from 'react';

export interface PemeriksaanCreateProps {
    breadcrumb?: { title: string; href: string }[];
    balita: {
        id: string;
        nama: string;
        tanggal_lahir: string;
        tempat_lahir: string;
        jenis_kelamin: string;
    }[];
    attribut: {
        id: string;
        nama: string;
    }[];
}

type CreateForm = {
    balita_id: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    tanggal_pemeriksaan: string;
    attribut: {
        nilai: string;
        attribut_id: string;
    }[];
};

export default function PemeriksaanCreate({ breadcrumb, balita, attribut }: PemeriksaanCreateProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb?.map((item) => ({ title: item.title, href: item.href })) ?? [];

    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        balita_id: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        tanggal_pemeriksaan: '',
        attribut: attribut.map((attr) => ({ nilai: '', attribut_id: attr.id })),
    });

    const [idBalita, setIdBalita] = useState('');

    const searchById = (search: string): PemeriksaanCreateProps['balita'][0] | null => {
        if (!balita || !search) return null;
        return balita.find((element) => String(element.id).includes(search)) ?? null;
    };

    useEffect(() => {
        if (idBalita) {
            const listbalita = searchById(idBalita);

            setData('balita_id', idBalita);
            if(listbalita){
                setData('nama', listbalita.nama);
                setData('tempat_lahir', listbalita.tempat_lahir);
                setData('tanggal_lahir', listbalita.tanggal_lahir);
                setData('jenis_kelamin', listbalita.jenis_kelamin);
            }
        }
    }, [idBalita]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.pemeriksaan.store-id'), {
            onError: (err) => console.log(err),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Pilih Berdasarkan Nama Balita</Label>
                                    <Select value={idBalita} onValueChange={(value) => setIdBalita(value)} disabled={processing}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Balita" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Nama Balita</SelectLabel>
                                                {balita.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.nama}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.balita_id} className="mt-2" />

                                </div>


                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama</Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        readOnly={true}
                                        disabled={processing}
                                        placeholder="Nama Balita"
                                    />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="col-span-1 grid gap-2">
                                        <Label htmlFor="tempat_lahir">Tempat</Label>
                                        <Input
                                            id="tempat_lahir"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            autoComplete="tempat_lahir"
                                            value={data.tempat_lahir}
                                            disabled={processing}
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            readOnly={true}
                                            placeholder="Tempat lahir"
                                        />
                                        <InputError message={errors.tempat_lahir} />
                                    </div>
                                    <div className="col-span-2 grid gap-2">
                                        <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            required
                                            tabIndex={2}
                                            autoComplete="tanggal_lahir"
                                            value={data.tanggal_lahir}
                                            disabled={processing}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            readOnly={true}
                                        />
                                        <InputError message={errors.tanggal_lahir} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Input
                                            id="jenis_kelamin"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            autoComplete="jenis_kelamin"
                                            value={data.jenis_kelamin}
                                            disabled={processing}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            readOnly={true}
                                        />
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
                                                            className="w-max"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="tanggal_pemeriksaan"
                                                            value={data.tanggal_pemeriksaan}
                                                            onChange={(e) => setData('tanggal_pemeriksaan', e.target.value)}
                                                            disabled={processing}
                                                        />
                                                        <InputError message={errors.tanggal_pemeriksaan} />
                                                    </TableColumn>
                                                </TableRow>
                                                {attribut
                                                    .filter((item) => !['jenis kelamin', 'status'].includes(item.nama.toLowerCase()))
                                                    .map((item, index) => (
                                                        <TableRow key={item.id}>
                                                            <TableColumn>{item.nama}</TableColumn>
                                                            <TableColumn>
                                                                <Input
                                                                    type="number"
                                                                    id={`kriteria.${index}`}
                                                                    value={data.attribut[index].nilai}
                                                                    disabled={processing}
                                                                    onChange={(e) =>
                                                                        setData(
                                                                            'attribut',
                                                                            data.attribut.map((val, i) =>
                                                                                i === index ? { nilai: e.target.value, attribut_id: item.id } : val,
                                                                            ),
                                                                        )
                                                                    }
                                                                />
                                                        <InputError message={(errors as any)[`attribut.${index}.nilai`]} />
                                                        <InputError message={(errors as any)[`attribut.${index}.attribut_id`]} />


                                                            </TableColumn>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                                <Button type="submit" variant="secondary" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Simpan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
export interface BalitaCreaterops {
    breadcrumb?: { title: string; href: string }[];
    orangtua: {
        id: string;
        name: string;
        email: string;
        password: string;
    }[];
}
type CreateForm = {
    orang_tua_id: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
};

export default function BalitaCreate({ breadcrumb, orangtua }: BalitaCreaterops) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];
    const { data, setData, get, post, processing, progress, errors, reset } = useForm<Required<CreateForm>>({
        orang_tua_id: '',
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
    });

    /**
     * Handles the form submission. Prevents the default form submission,
     * then makes a POST request to the server to store the new Balita.
     * If there's an error, logs the error to the console.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data.jenis_kelamin);
        post(route('admin.balita.store'), {
            onError: (err) => console.log(err),
        });
    };

    /** Get Data From orangtua */
    const [listOrangtua, setListOrangtua] = useState<{ id: string; name: string; email: string } | null>(null);
    const [idOrangTua, setIdOrangTua] = useState('');
    /**
     * Filters the list of orangtua by the given search string.
     * If the search string is empty, returns the original list.
     * If the orangtua list is empty, returns an empty list.
     * @param {string} search - The search string to filter by.
     * @returns {string[]} - The filtered list of orangtua.
     */
    const filter = (search: string): string[] => {
        if (!orangtua) {
            return [];
        }
        const filtered = orangtua
            .filter((element: any) => {
                if (!element || !element.name) {
                    return false;
                }
                return element.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((element: any) => element.name); // Add this line to extract the name property
        return filtered;
    };

    const searchById = (search: string): { id: string; name: string; email: string } | null => {
        if (!orangtua) {
            return null;
        }

        try {
            const filtered = orangtua
                ?.filter((element: any) => {
                    if (!element || !element.id) {
                        return false;
                    }

                    return String(element.id).includes(search);
                })
                .map((element: any) => element);

            return filtered[0] ?? null;
        } catch (error) {
            console.error('Error filtering orangtua by ID:', error);
            return null;
        }
    };
    useEffect(() => {
        if (idOrangTua) {
            setListOrangtua(searchById(idOrangTua));
            setData('orang_tua_id', idOrangTua);
        }
    }, [idOrangTua]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Pilih Berdasarkan Nama Orang Tua</Label>
                                    <Select defaultValue="0" value={idOrangTua} onValueChange={(value) => setIdOrangTua(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Orang Tua" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Pilih Orang Tua</SelectLabel>
                                                {orangtua.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {listOrangtua && (
                                    <div className="block space-y-4 p-2">
                                        <div className="flex gap-2">
                                            <Label htmlFor="email-orangtua" className="text-muted-foreground">
                                                Nama Orang Tua:{' '}
                                            </Label>
                                            <Label htmlFor="Nama-orangtua" className="font-normal">
                                                {listOrangtua?.name}
                                            </Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Label htmlFor="email-orangtua" className="text-muted-foreground">
                                                Email Orang Tua:{' '}
                                            </Label>
                                            <Label htmlFor="Nama-orangtua" className="font-normal">
                                                {listOrangtua?.email}
                                            </Label>
                                        </div>
                                    </div>
                                )}
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
                                            onChange={(e) => setData('tempat_lahir', e.target.value)}
                                            disabled={processing}
                                            placeholder="tempat_lahir......."
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
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            disabled={processing}
                                            placeholder="tanggal lahir......."
                                        />
                                        <InputError message={errors.tanggal_lahir} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
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
                                    <InputError message={errors.jenis_kelamin} />
                                </div>

                                <Button type="submit" variant={'secondary'} className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
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

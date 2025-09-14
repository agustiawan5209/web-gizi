import ClassifyPemeriksaan from '@/components/classify-pemeriksaan';
import InputError from '@/components/input-error';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
interface OrangTua {
    id: string;
    name: string;
    email: string;
    alamat: string;
    nohp: string;
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

export default function PemeriksaanCreate({ breadcrumb, balita, attribut, orangtua }: PemeriksaanCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const { auth } = usePage<SharedData>().props;
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pemeriksaan.store'), {
            onError: (err) => console.log(err),
        });
    };
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
            if (filteredList.length > 0) {
                setListOrangTua(filteredList);
                setShowList(true);
                errors.orang_tua_id = '';
            } else {
                errors.orang_tua_id = 'Nama Orang Tua/Wali Tidak Terdaftar';
            }
        } else {
            setListOrangTua([]);
            setShowList(false);
            errors.orang_tua_id = 'Nama Orang Tua/Wali Tidak Terdaftar';
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
                setData('alamat', foundParent.alamat);
            }
        }
    }, [idOrangTua, searchById, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />

            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Card>
                        <CardContent>
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
                                            <Label className="text-muted-foreground">
                                                Nama Orang Tua/<i>Mewakili</i>:
                                            </Label>
                                            <Label className="font-normal">{selectedOrangtua.name}</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Label className="text-muted-foreground">Email Orang Tua:</Label>
                                            <Label className="font-normal">{selectedOrangtua.email}</Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Label className="text-muted-foreground">Alamat Orang Tua:</Label>
                                            <Label className="font-normal">{selectedOrangtua.alamat}</Label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ClassifyPemeriksaan
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                attribut={attribut}
                                orangtua={orangtua}
                                balita={balita}
                                canSubmit={true}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

import ClassifyPemeriksaan from '@/components/classify-pemeriksaan';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import GuestLayout from '@/layouts/guest-layout';
import { SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
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

export default function PemeriksaanCreate({ balita, attribut, orangtua }: PemeriksaanCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculation
    const { auth } = usePage<SharedData>().props;
    const today = new Date();
    const day = today.toISOString().split('T')[0];
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        orang_tua_id: auth.user.id.toLocaleString(),
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: auth.user.alamat,
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

    return (
        <GuestLayout head="Pemeriksaan">
            <Head title="Pemeriksaan" />

            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Card>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="block space-y-4 rounded-lg border p-2">
                                    <div className="flex gap-2">
                                        <Label className="text-muted-foreground">
                                            Nama Orang Tua/<i>Mewakili</i>:
                                        </Label>
                                        <Label className="font-normal">{auth.user.name}</Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Label className="text-muted-foreground">Email Orang Tua:</Label>
                                        <Label className="font-normal">{auth.user.email}</Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Label className="text-muted-foreground">Alamat Orang Tua:</Label>
                                        <Label className="font-normal">{auth.user.alamat}</Label>
                                    </div>
                                </div>
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
        </GuestLayout>
    );
}

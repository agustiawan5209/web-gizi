import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';
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
    orang_tua_id: string | number;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
};

export default function BalitaCreate({ breadcrumb, orangtua }: BalitaCreaterops) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, post, processing, progress, errors, reset } = useForm<Required<CreateForm>>({
        orang_tua_id: auth.user.id,
        nama: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
    });

    /**
     * Handles the form submission. Prevents the default form submission,
     * then makes a POST request to the server to store the new Balita.
     * If there's an error, logs the error to the console.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data.jenis_kelamin);
        post(route('orangtua.balita.store'), {
            onError: (err) => console.log(err),
        });
    };
    // Hitung tanggal minimum: 1 tahun lalu dari hari ini
    const today = new Date();
    const tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    const minDate = tahunLalu.toISOString().split('T')[0];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
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

                                <div className="flex items-center gap-1">
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
                                            max={minDate}
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
                                <div className="col-span-1 grid gap-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        disabled={processing}
                                        placeholder="alamat......."
                                    />
                                    <InputError message={errors.alamat} />
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

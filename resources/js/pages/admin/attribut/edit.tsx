import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useMemo } from 'react';
export interface AttributUpdaterops {
    attribut: {
        id: number;
        nama: string;
        keterangan: string;
    };
    breadcrumb?: { title: string; href: string }[];
}
type UpdateForm = {
    nama: string;
    keterangan: string;
};

export default function AttributUpdate({ attribut, breadcrumb }: AttributUpdaterops) {
     // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb]
    );

    const { data, setData, put, processing, progress, errors, reset } = useForm<Required<UpdateForm>>({
        nama: attribut.nama,
        keterangan: attribut.keterangan,
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.attribut.update', { attribut: attribut.id }), {
            onError: (err) => console.log(err),
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update" />
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
                                        placeholder="Nama Attribut"
                                    />
                                    <InputError message={errors.nama} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Input
                                        id="keterangan"
                                        type="keterangan"
                                        required
                                        tabIndex={2}
                                        autoComplete="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        disabled={processing}
                                        placeholder="keterangan........"
                                    />
                                    <InputError message={errors.keterangan} />
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

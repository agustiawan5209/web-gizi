import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { useMemo } from 'react';
import { type BreadcrumbItem } from '@/types';
export interface OrangtuaUpdaterops {
    orangtua: {
        id: number,
        name: string,
        email: string,
        alamat: string,
        nohp: string,
        password: string,
    };
    breadcrumb?: { title: string; href: string }[];
}
type UpdateForm = {
    name: string;
    email: string;
    alamat: string;
    nohp: string;
    password: string;
};

export default function OrangtuaUpdate({ orangtua, breadcrumb }: OrangtuaUpdaterops) {
     // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb]
    );

    const { data, setData, put, processing, progress, errors, reset } = useForm<Required<UpdateForm>>({
        name: orangtua.name,
        email: orangtua.email,
        alamat: orangtua.alamat,
        nohp: orangtua.nohp,
        password: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.orangtua.update', {user: orangtua.id}), {
            onFinish: () => reset('password'),
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
                                <Label htmlFor="name">Nama Orang Tua</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

<div className="grid gap-2">
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
                            placeholder="alamat...."
                        />
                        <InputError message={errors.alamat} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nohp">No. HP</Label>
                        <Input
                            id="nohp"
                            type="number"
                            required
                            tabIndex={2}
                            autoComplete="nohp"
                            value={data.nohp}
                            onChange={(e) => setData('nohp', e.target.value)}
                            disabled={processing}
                            placeholder="nohp...."
                        />
                        <InputError message={errors.nohp} />
                    </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
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

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent,SelectGroup, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

export interface DatasetCreateProps {
    breadcrumb?: { title: string; href: string }[];
    orangtua: {
        id: string;
        name: string;
        email: string;
        password: string;
    }[];
    attribut: {
        id: string;
        nama: string;
    }[];
    statusLabel: string[];
}

type CreateForm = {
    dataset_id: string;
    jenis_kelamin: string;
    attribut: {
        nilai: string;
        attribut_id: string;
    }[];
    label: string;
};

export default function DatasetCreate({ breadcrumb, orangtua, attribut, statusLabel }: DatasetCreateProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb?.map((item) => ({ title: item.title, href: item.href })) ?? [];

    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        label: '',
        dataset_id: '',
        jenis_kelamin: '',
        attribut: attribut.map((attr) => ({ nilai: '', attribut_id: attr.id })),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data)
        post(route('admin.dataset.store'), {
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
                                <div>
                                    <Label htmlFor="label">Label</Label>
                                    <Select defaultValue="00" value={data.label} onValueChange={(e) => setData('label', e)}>
                                        <SelectTrigger className="text-black">
                                            <SelectValue placeholder="Data Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {statusLabel.length > 0 && statusLabel.map((item) => (
                                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                                                    <TableColumn>Jenis Kelamin</TableColumn>
                                                    <TableColumn>
                                                        <div className="flex flex-row gap-2 p-2">
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

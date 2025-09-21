/* eslint-disable @typescript-eslint/no-explicit-any */
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useCallback, useMemo } from 'react';

interface Attribute {
    id: string;
    nama: string;
}

interface Parent {
    id: string;
    name: string;
    email: string;
    password: string;
}

interface DatasetEditProps {
    breadcrumb?: Array<{ title: string; href: string }>;
    orangtua: Parent[];
    attribut: Attribute[];
    statusLabel: string[];
    dataset: {
        id: string;
        tgl: string;
        label: string;
        jenis_kelamin: string;
        fiturdataset: Array<{
            nilai: string;
            attribut_id: string;
        }>;
    };
}

interface EditForm {
    [key: string]: any;
    tgl: string;
    label: string;
    jenis_kelamin: string;
    attribut: {
        nilai: string;
        attribut_id: string;
    }[];
}

export default function DatasetEdit({ breadcrumb, attribut, statusLabel, dataset }: DatasetEditProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => breadcrumb?.map((item) => ({ title: item.title, href: item.href })) ?? [], [breadcrumb]);

    // Initialize form data with existing dataset values
    const initialFormData: EditForm = useMemo(
        () => ({
            tgl: dataset.tgl,
            label: dataset.label,
            jenis_kelamin: dataset.jenis_kelamin,
            attribut: attribut.map((attr) => {
                const existingValue = dataset.fiturdataset.find((av) => av.attribut_id === attr.id);

                return {
                    nilai: existingValue ? existingValue.nilai : '',
                    attribut_id: attr.id,
                };
            }),
        }),
        [attribut, dataset],
    );

    const { data, setData, put, processing, errors } = useForm<EditForm>(initialFormData);

    const filteredAttributes = useMemo(() => attribut.filter((item) => !['status'].includes(item.nama.toLowerCase())), [attribut]);

    const submit: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            put(route('admin.dataset.update', { dataset: dataset.id }), {
                onError: (err) => console.log(err),
            });
        },
        [put, dataset.id],
    );

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
            <Head title="Edit Dataset" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="space-y-2">
                                <Label htmlFor="tgl">Tanggal</Label>
                                <Input
                                    id="tgl"
                                    type="date"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="tgl"
                                    value={data.tgl}
                                    onChange={(e) => setData('tgl', e.target.value)}
                                    placeholder="yyyy-mm-dd"
                                    className="h-10"
                                />
                                <InputError message={errors.tgl} />
                            </div>
                            <div className="grid gap-6">
                                <div>
                                    <Label htmlFor="label">Label</Label>
                                    <Select value={data.label} onValueChange={(value) => setData('label', value)}>
                                        <SelectTrigger className="text-foreground">
                                            <SelectValue placeholder="Data Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {statusLabel.map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.label} />
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
                                                {filteredAttributes.map((item, index) => {
                                                    if (item.nama.toLowerCase().includes('jenis kelamin')) {
                                                        return (
                                                            <TableRow key={item.id}>
                                                                <TableColumn>{item.nama}</TableColumn>
                                                                <TableColumn>
                                                                    <div className="flex flex-row gap-2 p-2">
                                                                        <InputRadio
                                                                            id="jenis1"
                                                                            name="jenis_kelamin"
                                                                            label="Laki-laki"
                                                                            value="Laki-laki"
                                                                            checked={data.attribut[index]?.nilai === 'Laki-laki'}
                                                                            onChange={(e) => handleAttributeChange(index, e.target.value)}
                                                                            className="border-red-500"
                                                                            labelClassName="text-gray-800 dark:text-white"
                                                                        />
                                                                        <InputRadio
                                                                            id="jenis2"
                                                                            name="jenis_kelamin"
                                                                            label="Perempuan"
                                                                            value="Perempuan"
                                                                            checked={data.attribut[index]?.nilai === 'Perempuan'}
                                                                            onChange={(e) => handleAttributeChange(index, e.target.value)}
                                                                            className="border-red-500"
                                                                            labelClassName="text-gray-800 dark:text-white"
                                                                        />
                                                                    </div>
                                                                    <InputError message={errors.jenis_kelamin} />
                                                                </TableColumn>
                                                            </TableRow>
                                                        );
                                                    }
                                                    return (
                                                        <TableRow key={item.id}>
                                                            <TableColumn>{item.nama}</TableColumn>
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
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                                <Button type="submit" variant="secondary" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Update
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

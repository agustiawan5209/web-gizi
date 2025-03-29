import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input, InputRadio } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
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

interface DatasetCreateProps {
    breadcrumb?: Array<{ title: string; href: string }>;
    orangtua: Parent[];
    attribut: Attribute[];
    statusLabel: string[];
}

interface AttributeValue {
    nilai: string;
    attribut_id: string;
}

interface CreateForm {
    [key: string]: any;
    label: string;
    dataset_id: string;
    jenis_kelamin: string;
    attribut: {
      nilai: string;
      attribut_id: string;
    }[];
}

export default function DatasetCreate({ breadcrumb, orangtua, attribut, statusLabel }: DatasetCreateProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => breadcrumb?.map((item) => ({ title: item.title, href: item.href })) ?? [],
        [breadcrumb]
    );

    // Initialize form data with proper types
    const initialFormData: CreateForm = useMemo(() => ({
        label: '',
        dataset_id: '',
        jenis_kelamin: '',
        attribut: attribut.map((attr) => ({
            nilai: '',
            attribut_id: attr.id
        })),
    }), [attribut]);

    const { data, setData, post, processing, errors } = useForm<CreateForm>(initialFormData);

    // Memoize filtered attributes to avoid recalculating on every render
    const filteredAttributes = useMemo(() =>
        attribut.filter(item =>
            !['jenis kelamin', 'status'].includes(item.nama.toLowerCase())
        ),
        [attribut]
    );

    // Optimized form submission handler
    const submit: FormEventHandler = useCallback((e) => {
        e.preventDefault();
        post(route('admin.dataset.store'));
    }, [post]);

    // Optimized handler for attribute changes
    const handleAttributeChange = useCallback((index: number, value: string) => {
        setData('attribut',
            data.attribut.map((val, i) =>
                i === index ? { ...val, nilai: value } : val
            )
        );
    }, [data.attribut, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Dataset" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-4 md:p-6">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div>
                                    <Label htmlFor="label">Label</Label>
                                    <Select
                                        value={data.label}
                                        onValueChange={(value) => setData('label', value)}
                                    >
                                        <SelectTrigger className="text-black">
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
                                                <TableRow>
                                                    <TableColumn>Jenis Kelamin</TableColumn>
                                                    <TableColumn>
                                                        <div className="flex flex-row gap-2 p-2">
                                                            <InputRadio
                                                                id="jenis1"
                                                                name="jenis_kelamin"
                                                                label="Laki-laki"
                                                                value="Laki-laki"
                                                                checked={data.jenis_kelamin === 'Laki-laki'}
                                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                                className="border-red-500"
                                                                labelClassName="text-gray-800 dark:text-white"
                                                            />
                                                            <InputRadio
                                                                id="jenis2"
                                                                name="jenis_kelamin"
                                                                label="Perempuan"
                                                                value="Perempuan"
                                                                checked={data.jenis_kelamin === 'Perempuan'}
                                                                onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                                className="border-red-500"
                                                                labelClassName="text-gray-800 dark:text-white"
                                                            />
                                                        </div>
                                                        <InputError message={errors.jenis_kelamin} />
                                                    </TableColumn>
                                                </TableRow>

                                                {filteredAttributes.map((item, index) => (
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
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>

                                <Button
                                    type="submit"
                                    variant="secondary"
                                    className="mt-2 w-full"
                                    tabIndex={5}
                                    disabled={processing}
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    )}
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

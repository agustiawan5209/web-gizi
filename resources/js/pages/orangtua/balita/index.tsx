import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableAction, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, useMemo } from 'react';
export interface BalitaProps {
    balita: string[];
    breadcrumb?: { title: string; href: string }[];
    filter: {
        q: string;
        per_page: string;
        order_by: string;
    };
}

type GetForm = {
    q?: string;
    per_page?: string;
    order_by?: string;
};

export default function BalitaIndex({ balita, breadcrumb, filter }: BalitaProps) {
     // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb]
    );


    const { data, setData, get, processing, errors, reset } = useForm<GetForm>({
        // q: '',
        // per_page: '',
        // order_by: '',
    });

    /** START SEARCH */
    // store search query in state
    const [search, setSearch] = useState(filter?.q ?? '');

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        // clean search query
        const cleanedSearch = search.trim();
        if (cleanedSearch.length > 0) {
            // if search query is not empty, make request to server
            get(route('orangtua.balita.index', { q: cleanedSearch, per_page: filter?.per_page, order_by: filter?.order_by }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    };

    // clear search query when form is submitted
    const clearSearch: FormEventHandler = (e) => {
        e.preventDefault();
        setSearch('');
        reset();
        // make request to server when search query is cleared
        get(route('orangtua.balita.index'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {},
        });
    };
    /** END SEARCH */

    /** Start Order BY (ASC, DESC) */
    const [orderBy, setOrderBy] = useState(filter?.order_by ?? '');

    useEffect(() => {
        // clean search query
        const cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy.length > 0) {
            // if search query is not empty, make request to server
            get(route('orangtua.balita.index', { order_by: cleanedOrderBy, per_page: filter?.per_page, q: filter?.q }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    }, [orderBy]);
    /** END Order BY */

    /** Start Request Per_page */
    const [perPage, setPerPage] = useState(filter?.per_page ?? 10); // Default value lebih baik angka

    const submitPerPage: FormEventHandler = (e) => {
        e.preventDefault();
        const cleanedPerPage = perPage.toString().trim();
        const numericPerPage = parseInt(cleanedPerPage);

        // Validasi nilai per_page
        if (!isNaN(numericPerPage) && numericPerPage > 0) {
            get(
                route('orangtua.balita.index', {
                    per_page: numericPerPage,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true, // Hindari penumpukan history
                },
            );
        }
    };
    /** END Request Per_page */
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Balita" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-1 lg:p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex w-full flex-1 flex-col items-start justify-end md:gap-7 md:flex-row px-1 py-1 lg:px-4 lg:py-2 md:items-center md:justify-between">
                        <div className="flex w-full flex-1 flex-col gap-7 px-1 py-1 lg:px-4 lg:py-2 md:flex-row md:items-center">
                            <Link href={route('orangtua.balita.create')} className="col-span-1 cursor-pointer">
                                <Button variant="default" className="flex cursor-pointer items-center gap-2 bg-primary ">
                                    Tambah Data
                                </Button>
                            </Link>
                        </div>
                        <div className="col-span-1 px-1 py-1 lg:px-4 lg:py-2">
                            <Select defaultValue="" value={orderBy} onValueChange={(e) => setOrderBy(e)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tampilan Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Urutkan</SelectLabel>
                                        <SelectItem value="A-Z">A-Z</SelectItem>
                                        <SelectItem value="Z-A">Z-A</SelectItem>
                                        <SelectItem value="desc">Terbaru</SelectItem>
                                        <SelectItem value="asc">sTerlama</SelectItem>
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectLabel>Jenis Kelamin</SelectLabel>
                                        <SelectItem value="Laki-laki">Laki-Laki</SelectItem>
                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    </SelectGroup>
                                    <SelectSeparator />
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="lg:w-full overflow-hidden">
                        <TableContainer className="max-w-[400px] md:max-w-[768px] lg:max-w-full">
                            <Table className="w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableTh className="w-10">No.</TableTh>
                                        <TableTh>Orang Tua</TableTh>
                                        <TableTh>Nama</TableTh>
                                        <TableTh>Tempat/Tanggal Lahir</TableTh>
                                        <TableTh>Jenis Kelamin</TableTh>
                                        <TableTh>Aksi</TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={processing ? 'opacity-50' : ''}>
                                    {balita.length > 0 &&
                                        balita.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableColumn>{index + 1 }</TableColumn>
                                                <TableColumn> {item.orangtua.name} </TableColumn>
                                                <TableColumn> {item.nama} </TableColumn>
                                                <TableColumn> {item.tempat_lahir}/ {item.tanggal_lahir} </TableColumn>
                                                <TableColumn> {item.jenis_kelamin} </TableColumn>
                                                <TableAction
                                                    className="w-32"
                                                    show={route('orangtua.balita.show', { balita: item.id })}
                                                    edit={route('orangtua.balita.edit', { balita: item.id })}
                                                    delete="delete"
                                                    url={route('orangtua.balita.destroy', { balita: item.id })}
                                                    title={item.nama}
                                                    id={item.id}
                                                />
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>

                        </TableContainer>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableAction, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState, useMemo } from 'react';
export interface OrangtuaProps {
    orangtua?: {
        current_page: number;
        data: string[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url?: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
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

export default function OrangtuaIndex({ orangtua, breadcrumb, filter }: OrangtuaProps) {
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
            get(route('admin.orangtua.index', { q: cleanedSearch, per_page: filter?.per_page, order_by: filter?.order_by }), {
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
        get(route('admin.orangtua.index'), {
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
            get(route('admin.orangtua.index', { order_by: cleanedOrderBy, per_page: filter?.per_page, q: filter?.q }), {
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
                route('admin.orangtua.index', {
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
            <Head title="Orangtua" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex w-full flex-1 flex-row items-end justify-end gap-7 px-4 py-2 md:items-center md:justify-between">
                        <div className="flex w-full flex-1 flex-col gap-7 px-4 py-2 md:flex-row md:items-center">
                            <Link href={route('admin.orangtua.create')} className="col-span-1 cursor-pointer">
                                <Button variant="default" className="flex cursor-pointer items-center gap-2 bg-primary ">
                                    Tambah Data
                                </Button>
                            </Link>
                            <div className="col-span-2 flex items-center gap-2">
                                <label htmlFor="search" className="sr-only">
                                    Cari
                                </label>
                                <Input
                                    type="text"
                                    id="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan nama atau email"
                                />
                                <Button variant="secondary" type="button" onClick={submitSearch} className="flex items-center gap-2 text-xs">
                                    Cari
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={clearSearch}
                                    className="flex items-center gap-2 border-red-500 text-xs"
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-1 px-4 py-2">
                            <Select defaultValue="" value={orderBy} onValueChange={(e) => setOrderBy(e)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tampilan Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="A-Z">A-Z</SelectItem>
                                        <SelectItem value="Z-A">Z-A</SelectItem>
                                        <SelectItem value="asc">Terbaru</SelectItem>
                                        <SelectItem value="desc">Terlama</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="w-full min-w-full">
                        <TableContainer className="relative">
                            <Table className="w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableTh className="w-10">No.</TableTh>
                                        <TableTh>Nama</TableTh>
                                        <TableTh>Email</TableTh>
                                        <TableTh>Aksi</TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={processing ? 'opacity-50' : ''}>
                                    {(orangtua?.data ?? []).length > 0 &&
                                        orangtua?.data.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableColumn>{index + 1 + (orangtua?.current_page - 1) * orangtua?.per_page}</TableColumn>
                                                <TableColumn> {item.name} </TableColumn>
                                                <TableColumn> {item.email} </TableColumn>
                                                <TableAction
                                                    className="w-32"
                                                    edit={route('admin.orangtua.edit', { user: item.id })}
                                                    delete="delete"
                                                    url={route('admin.orangtua.destroy', { user: item.id })}
                                                    title={item.name}
                                                    id={item.id}
                                                />
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-between gap-7 border-x-2 border-b-2 p-2">
                                <div className="flex items-center gap-7 px-4 py-2">
                                    <div className='flex flex-row gap-2'>
                                        <Select defaultValue="10" value={perPage} onValueChange={(e) => setPerPage(e.toString())}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Jumlah Data" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="10">10</SelectItem>
                                                    <SelectItem value="20">20</SelectItem>
                                                    <SelectItem value="50">50</SelectItem>
                                                    <SelectItem value="100">100</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" type="button" onClick={submitPerPage} className="flex items-center gap-2 text-xs">
                                            Tampilkan
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {' '}
                                        halaman {orangtua?.from} ke {orangtua?.to} dari {orangtua?.total} total
                                    </div>
                                </div>
                                <PaginationTable links={orangtua?.links ?? []} data={filter} />
                            </div>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

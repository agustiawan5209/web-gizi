import CollapsibleRow from '@/components/collapsible-table';
import DetailPemeriksaan from '@/components/detail-pemeriksaan';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

interface PemeriksaanProps {
    pemeriksaan?: {
        current_page: number;
        data: Array<{
            id: string;
            tgl_pemeriksaan: string;
            label: string;
            balita: {
                nama: string;
                orangtua: { name: string };
                tempat_lahir: string;
                tanggal_lahir: string;
            };
            detailpemeriksaan: any;
        }>;
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
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    breadcrumb?: Array<{ title: string; href: string }>;
    filter: {
        q: string;
        per_page: string;
        order_by: string;
        date: string;
    };
    statusLabel: string[];
    can: {
        add: boolean;
        edit: boolean;
        read: boolean;
        delete: boolean;
    };
}

type GetForm = {
    q?: string;
    per_page?: string;
    order_by?: string;
    date?: string;
};

export default function PemeriksaanIndex({ pemeriksaan, breadcrumb, filter, statusLabel, can }: PemeriksaanProps) {
    // Memoize breadcrumbs to prevent unnecessary recalculations
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { get, processing } = useForm<GetForm>();

    // State management
    const [search, setSearch] = useState(filter?.q ?? '');
    const [TglPemeriksaan, setTglPemeriksaan] = useState(filter?.date ?? '');
    const [orderBy, setOrderBy] = useState(filter?.order_by ?? '');
    const [perPage, setPerPage] = useState(filter?.per_page ?? '10');
    const [dialogOpen, setDialogOpen] = useState(false);

    // Memoized route parameters to avoid recalculations
    const routeParams = useMemo(
        () => ({
            q: search.trim(),
            per_page: perPage,
            order_by: orderBy,
            date: TglPemeriksaan,
        }),
        [search, perPage, orderBy, TglPemeriksaan],
    );

    // Optimized filter submission using useCallback
    const submitFilter = useCallback(() => {
        const cleanedSearch = search.trim();
        const cleanedDate = TglPemeriksaan.trim();
        const numericPerPage = parseInt(perPage.toString());

        // Only make request if there are valid changes
        if (cleanedSearch || cleanedDate || !isNaN(numericPerPage)) {
            get(route('pemeriksaan.index', routeParams), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    }, [get, routeParams]);

    // Handle search submission
    const submitSearch: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            submitFilter();
        },
        [submitFilter],
    );

    // Handle per page submission
    const submitPerPage: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            submitFilter();
        },
        [submitFilter],
    );

    // Handle date submission
    const submitTglPemeriksaan = useCallback(() => {
        submitFilter();
    }, [submitFilter]);

    // Clear all filters
    const clearSearch: FormEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            setSearch('');
            setTglPemeriksaan('');
            setPerPage('10');
            setOrderBy('');

            get(route('pemeriksaan.index'), {
                preserveState: true,
                preserveScroll: true,
            });
        },
        [get],
    );

    // Effect for orderBy changes
    useEffect(() => {
        const cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy) {
            get(
                route('pemeriksaan.index', {
                    order_by: cleanedOrderBy,
                    per_page: perPage,
                    q: search,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    }, [orderBy, get, perPage, search]);

    // Memoize table rows to prevent unnecessary re-renders
    const tableRows = useMemo(() => {
        if (!pemeriksaan?.data?.length) return null;

        return pemeriksaan.data.map((item, index) => {
            let read_url = null;
            if (can.read) {
                read_url = route('pemeriksaan.show', { pemeriksaan: item.id });
            }
            let delete_url = null;
            if (can.delete) {
                delete_url = route('pemeriksaan.destroy', { pemeriksaan: item.id });
            }
            return (
                <CollapsibleRow
                    key={item.id} // Using item.id as key is better than index
                    num={index + 1 + (pemeriksaan.current_page - 1) * pemeriksaan.per_page}
                    title={item.tgl_pemeriksaan}
                    columnData={[item.balita.nama, item.balita.orangtua.name, `${item.balita.tempat_lahir}/${item.balita.tanggal_lahir}`, item.label]}
                    delete="delete"
                    url={delete_url ?? ''}
                    id={item.id}
                    show={read_url ?? ''}
                >
                    <DetailPemeriksaan detail={item.detailpemeriksaan} />
                </CollapsibleRow>
            );
        });
    }, [pemeriksaan]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex w-full flex-1 flex-col items-start justify-start gap-7 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex w-full flex-1 flex-col gap-7 px-4 py-2 md:items-start lg:flex-row">
                           {can.add &&  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" size="lg" tabIndex={4} className="bg-primary flex cursor-pointer items-center gap-2">
                                        Tambah Data
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Pilih Cara Penambahan Data!!</DialogTitle>
                                    <DialogDescription>
                                        <section className="flex gap-4">
                                            <div className="block space-y-3 border-x p-4">
                                                <p className="text-left">Tambah Data Dengan Memilih berdasarkan id Bayi</p>
                                                <Link href={route('pemeriksaan.create-id')} className="col-span-1 cursor-pointer">
                                                    <Button
                                                        type="button"
                                                        className="flex w-full cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Mulai
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="block space-y-3 border-x p-4">
                                                <p>Tambah Data pemeriksaan secara langsung dengan menginputkan data bayi</p>
                                                <Link href={route('pemeriksaan.create')} className="col-span-1 cursor-pointer">
                                                    <Button
                                                        type="button"
                                                        className="flex w-full cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Mulai
                                                    </Button>
                                                </Link>
                                            </div>
                                        </section>
                                    </DialogDescription>
                                    <DialogClose />
                                </DialogContent>
                            </Dialog>}
                            <div className="col-span-2 flex items-center gap-2">
                                <label htmlFor="search" className="sr-only">
                                    Cari
                                </label>
                                <Input
                                    type="text"
                                    id="search-text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari berdasarkan nama atau keterangan"
                                />
                                <Input
                                    type="date"
                                    id="search-date"
                                    value={TglPemeriksaan}
                                    onChange={(e) => setTglPemeriksaan(e.target.value)}
                                    className="max-w-fit"
                                    placeholder="Cari berdasarkan tanggal"
                                />
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={submitSearch}
                                    className="flex items-center gap-2 text-xs"
                                    disabled={processing}
                                >
                                    Cari
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={clearSearch}
                                    className="flex items-center gap-2 border-red-500 text-xs"
                                    disabled={processing}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-1 px-4 py-2">
                            <Select value={orderBy} onValueChange={setOrderBy}>
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
                                    <SelectGroup>
                                        <SelectLabel>berdasarkan Gizi</SelectLabel>
                                        {statusLabel.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectLabel>Jenis Kelamin</SelectLabel>
                                        <SelectItem value="Laki-laki">Laki-Laki</SelectItem>
                                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="overflow-hidden lg:w-full">
                        <TableContainer className="max-w-[400px] md:max-w-[768px] lg:max-w-full">
                            <Table className="w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableTh className="w-10">No.</TableTh>
                                        <TableTh>Tanggal Pemeriksaan</TableTh>
                                        <TableTh>Nama Balita</TableTh>
                                        <TableTh>Nama Orang Tua</TableTh>
                                        <TableTh>Tempat/Tanggal Lahir</TableTh>
                                        <TableTh>Hasil Pemeriksaan Gizi</TableTh>
                                        <TableTh>Aksi</TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={processing ? 'opacity-50' : ''}>{tableRows}</TableBody>
                            </Table>

                            <div className="flex flex-col items-center justify-between gap-7 border-x-2 border-b-2 p-2 md:flex-row">
                                <div className="flex items-center gap-7 px-4 py-2">
                                    <div className="flex flex-row gap-2">
                                        <Select value={perPage} onValueChange={setPerPage}>
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
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={submitPerPage}
                                            className="flex items-center gap-2 text-xs"
                                            disabled={processing}
                                        >
                                            Tampilkan
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        halaman {pemeriksaan?.from} ke {pemeriksaan?.to} dari {pemeriksaan?.total} total
                                    </div>
                                </div>
                                <PaginationTable links={pemeriksaan?.links ?? []} data={filter} />
                            </div>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

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
import { FormEventHandler, useEffect, useState } from 'react';
export interface PemeriksaanProps {
    pemeriksaan?: {
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
        date: string;
    };
    statusLabel: string[];
}

type GetForm = {
    q?: string;
    per_page?: string;
    order_by?: string;
    date?: string;
};

export default function PemeriksaanIndex({ pemeriksaan, breadcrumb, filter, statusLabel }: PemeriksaanProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    const { data, setData, get, processing, errors, reset } = useForm<GetForm>({
        // q: '',
        // per_page: '',
        // order_by: '',
    });

    /** Search By tanggal Pemeriksaan */
    const [TglPemeriksaan, setTglPemeriksaan] = useState(filter?.per_page ?? null); // Default value lebih baik angka

    const submitTglPemeriksaan = () => {
        const cleanedDate = TglPemeriksaan;

        console.log(cleanedDate);
        // Validasi nilai per_page
        if (cleanedDate) {
            get(
                route('admin.pemeriksaan.index', {
                    date: cleanedDate,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true, // Hindari penumpukan history
                },
            );
        }
    };
    /** End tanggal Pemeriksaan */

    /** START SEARCH */
    // store search query in state
    const [search, setSearch] = useState(filter?.q ?? '');

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        const cleanedDate = TglPemeriksaan;
        // clean search query
        const cleanedSearch = search.trim();
        if (cleanedSearch.length > 0) {
            // if search query is not empty, make request to server
            get(route('admin.pemeriksaan.index', { q: cleanedSearch, per_page: filter?.per_page, order_by: filter?.order_by, date: filter?.date }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {},
            });
        } else if (cleanedDate.length > 0) {
            submitTglPemeriksaan();
        }
    };
    /** END SEARCH */

    /** Start Order BY (ASC, DESC) */
    const [orderBy, setOrderBy] = useState(filter?.order_by ?? '');

    useEffect(() => {
        // clean search query
        const cleanedOrderBy = orderBy.trim();
        if (cleanedOrderBy.length > 0) {
            // if search query is not empty, make request to server
            get(route('admin.pemeriksaan.index', { order_by: cleanedOrderBy, per_page: filter?.per_page, q: filter?.q }), {
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
                route('admin.pemeriksaan.index', {
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

    // clear search query when form is submitted
    const clearSearch: FormEventHandler = (e) => {
        e.preventDefault();
        setSearch('');
        reset();
        setTglPemeriksaan('yyyy-mm-dd');
        setPerPage('10');
        // make request to server when search query is cleared
        get(route('admin.pemeriksaan.index'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {},
        });
    };
    // End Filter //

    /**
     * Kode untuk melakukan pemilihan
     * apakah ingin menambah berdasarkan id bayi
     * atau menambah secara langsung data bayi
     * @agustiawan5209
     */

    const [open, setOpen] = useState(false);

    /** END  */
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemeriksaan" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex w-full flex-1 flex-row items-end justify-end gap-7 px-4 py-2 md:items-center md:justify-between">
                        <div className="flex w-full flex-1 flex-col gap-7 px-4 py-2 md:flex-row md:items-center">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant={'destructive'}
                                        size={'lg'}
                                        tabIndex={4}
                                        className="flex cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                    >
                                        Tambah Data
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Pilih Cara Penambahan Data!!</DialogTitle>
                                    <DialogDescription>
                                        <section className="flex gap-4">
                                            <div className="block space-y-3 border-x p-4">
                                                <p className="text-left">Tambah Data Dengan Memilih berdasarkan id Bayi</p>
                                                <Link href={route('admin.pemeriksaan.create-id')} className="col-span-1 cursor-pointer">
                                                    <Button
                                                        type="button"
                                                        variant="default"
                                                        className="flex w-full cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Mulai
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="block space-y-3 border-x p-4">
                                                <p>Tambah Data pemeriksaan secara langsung dengan menginputkan data bayi</p>
                                                <Link href={route('admin.pemeriksaan.create')} className="col-span-1 cursor-pointer">
                                                    <Button
                                                        type="button"
                                                        variant="default"
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
                            </Dialog>
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
                                <Button variant="outline" type="button" onClick={submitSearch} className="flex items-center gap-2 text-xs">
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
                                        <SelectLabel>Urutkan</SelectLabel>
                                        <SelectItem value="A-Z">A-Z</SelectItem>
                                        <SelectItem value="Z-A">Z-A</SelectItem>
                                        <SelectItem value="asc">Terbaru</SelectItem>
                                        <SelectItem value="desc">Terlama</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>berdasarkan Gizi</SelectLabel>
                                        {statusLabel.length > 0 &&
                                            statusLabel.map((item) => (
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
                                    <SelectSeparator />
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
                                        <TableTh>Tanggal Pemeriksaan</TableTh>
                                        <TableTh>Nama Balita</TableTh>
                                        <TableTh>Nama Orang Tua</TableTh>
                                        <TableTh>Tempat/Tanggal Lahir</TableTh>
                                        <TableTh>Hasil Pemeriksaan Gizi</TableTh>
                                        <TableTh>Aksi</TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={processing ? 'opacity-50' : ''}>
                                    {(pemeriksaan?.data ?? []).length > 0 &&
                                        pemeriksaan?.data.map((item: any, index: number) => (
                                            // <TableRow key={index}>
                                            //     <TableColumn>{index + 1 + (pemeriksaan?.current_page - 1) * pemeriksaan?.per_page}</TableColumn>
                                            //     <TableColumn>

                                            //     </TableColumn>
                                            //     <TableColumn> {item.balita.nama} </TableColumn>
                                            //     <TableColumn> {item.balita.orangtua.name} </TableColumn>
                                            //     <TableColumn>
                                            //         {' '}
                                            //         {item.balita.tempat_lahir}/ {item.balita.tanggal_lahir}{' '}
                                            //     </TableColumn>
                                            //     <TableColumn> {item.label} </TableColumn>
                                            //     <TableAction
                                            //         className="w-32"
                                            //         delete="delete"
                                            //         url={route('admin.pemeriksaan.destroy', { pemeriksaan: item.id })}
                                            //         title={item.tgl_pemeriksaan}
                                            //         id={item.id}
                                            //         show={route('admin.pemeriksaan.show', { pemeriksaan: item.id })}
                                            //     />
                                            // </TableRow>
                                            <CollapsibleRow
                                                key={index}
                                                num={index + 1 + (pemeriksaan?.current_page - 1) * pemeriksaan?.per_page}
                                                title={item.tgl_pemeriksaan}
                                                columnData={[
                                                    item.balita.nama,
                                                    item.balita.orangtua.name,
                                                    `${item.balita.tempat_lahir}/${item.balita.tanggal_lahir}`,
                                                    item.label,
                                                ]}
                                                delete="delete"
                                                url={route('admin.pemeriksaan.destroy', { pemeriksaan: item.id })}
                                                id={item.id}
                                                show={route('admin.pemeriksaan.show', { pemeriksaan: item.id })}
                                            >
                                                <DetailPemeriksaan key={index} detail={item.detailpemeriksaan} />
                                            </CollapsibleRow>
                                        ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-between gap-7 border-x-2 border-b-2 p-2">
                                <div className="flex items-center gap-7 px-4 py-2">
                                    <div className="flex flex-row gap-2">
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

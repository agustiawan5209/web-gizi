import { Button } from '@/components/ui/button';
import { Table, TableAction, TableBody, TableColumn, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
export interface OrangtuaProps {
    orangtua?: {
        current_page: number;
        data: string[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: string[];
        next_page_url?: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    };
    breadcrumb?: { title: string; href: string }[];
}

export default function OrangtuaIndex({ orangtua, breadcrumb }: OrangtuaProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orangtua" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="w-full flex flex-1 flex-col md:flex-row gap-7 items-center px-4 py-2 ">
                        <Link href={route('admin.orangtua.create')} className="cursor-pointer col-span-1">
                            <Button variant="default" className="flex cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600">
                                Tambah Data
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2 col-span-2">
                            <label htmlFor="search" className="sr-only">
                                Cari
                            </label>
                            <input
                                type="search"
                                id="search"
                                className="dark:bg-elevation-2 border-input-border ring-input-ring focus:ring-primary flex-1 rounded-md border bg-white p-2 text-xs md:text-sm ring-1 outline-none focus:ring-2 dark:text-white dark:placeholder:text-white/70"
                                placeholder="Cari berdasarkan nama atau email"
                            />
                            <Button variant="outline" className="flex items-center text-xs md:text-sm gap-2">
                                Filter
                            </Button>
                        </div>
                    </div>
                    <div className="min-w-full overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableTh className="w-10">No.</TableTh>
                                    <TableTh>Nama</TableTh>
                                    <TableTh>Email</TableTh>
                                    <TableTh>Aksi</TableTh>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orangtua?.data.length &&
                                    orangtua.data.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableColumn>{index + 1 + (orangtua?.current_page - 1) * orangtua?.per_page}</TableColumn>
                                            <TableColumn> {item.name} </TableColumn>
                                            <TableColumn> {item.email} </TableColumn>
                                            <TableAction className="w-32" show="test" edit="test" delete="delete" />
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

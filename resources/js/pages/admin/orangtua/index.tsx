import PaginationTable from '@/components/pagination-table';
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
}

export default function OrangtuaIndex({ orangtua, breadcrumb }: OrangtuaProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    const onPageChange = (pageNumber: any) => {
        console.log(`Page changed to ${pageNumber}`);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orangtua" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex w-full flex-1 flex-col items-center gap-7 px-4 py-2 md:flex-row">
                        <Link href={route('admin.orangtua.create')} className="col-span-1 cursor-pointer">
                            <Button variant="default" className="flex cursor-pointer items-center gap-2 bg-blue-500 hover:bg-blue-600">
                                Tambah Data
                            </Button>
                        </Link>
                        <div className="col-span-2 flex items-center gap-2">
                            <label htmlFor="search" className="sr-only">
                                Cari
                            </label>
                            <input
                                type="search"
                                id="search"
                                className="dark:bg-elevation-2 border-input-border ring-input-ring focus:ring-primary flex-1 rounded-md border bg-white p-2 text-xs ring-1 outline-none focus:ring-2 md:text-sm dark:text-white dark:placeholder:text-white/70 placeholder:text-xs"
                                placeholder="Cari berdasarkan nama atau email"
                            />
                            <Button variant="outline" className="flex items-center gap-2 text-xs">
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

                       <div className='border-x-2 border-b-2  p-2'>
                       <PaginationTable links={orangtua?.links ?? []} />
                       </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

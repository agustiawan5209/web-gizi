import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableAction, TableBody, TableColumn, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HomePage from '@/components/page/home-page';
import { Head } from '@inertiajs/react';

export interface DashboardProps {
    balita?: {
        id: string;
        nama: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        usia: string;
        jenis_kelamin: string;
        orangtua: {
            name: string;
        };
        pemeriksaan: {
            tgl_pemeriksaan: string;
            detailpemeriksaan: {
                attribut_id: string;
                nilai: string;
            };
        }[];
    }[];
}

export default function Dashboard({ balita }: DashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
               <HomePage className='p-0 md:h-[50vh]'/>
                <div>
                    <TableContainer className="max-w-[400px] md:max-w-[768px] lg:max-w-full">
                        {balita && (
                            <Table className="w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableTh className="w-10">No.</TableTh>
                                        <TableTh>Orang Tua</TableTh>
                                        <TableTh>Nama</TableTh>
                                        <TableTh>Tempat/Tanggal Lahir</TableTh>
                                        <TableTh>Jenis Kelamin</TableTh>
                                        <TableTh></TableTh>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {balita.length > 0 &&
                                        balita.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableColumn>{index + 1}</TableColumn>
                                                <TableColumn> {item.orangtua.name} </TableColumn>
                                                <TableColumn> {item.nama} </TableColumn>
                                                <TableColumn>
                                                    {' '}
                                                    {item.tempat_lahir}/ {item.tanggal_lahir}{' '}
                                                </TableColumn>
                                                <TableColumn> {item.jenis_kelamin} </TableColumn>
                                                <TableAction
                                                    className="w-32"
                                                    show={route('orangtua.balita.show', { balita: item.id })}
                                                />
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </div>
            </div>
        </AppLayout>
    );
}

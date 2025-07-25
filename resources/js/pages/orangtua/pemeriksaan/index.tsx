import CollapsibleRow from '@/components/collapsible-table';
import DetailPemeriksaan from '@/components/detail-pemeriksaan';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableTh } from '@/components/ui/table';
import GuestLayout from '@/layouts/guest-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
    pemeriksaan: {
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
        alasan: string;
    }[];
}

export default function PemeriksaanView({ balita, pemeriksaan }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    // Memoize table rows to prevent unnecessary re-renders
    const tableRows = useMemo(() => {
        if (!pemeriksaan?.length) return null;

        return pemeriksaan.map((item, index) => {
            let read_url = null;

            return (
                <CollapsibleRow
                    key={item.id} // Using item.id as key is better than index
                    num={index + 1}
                    title={item.tgl_pemeriksaan}
                    columnData={[item.balita.nama, item.balita.orangtua.name, `${item.balita.tempat_lahir}/${item.balita.tanggal_lahir}`, item.label]}
                    delete="delete"
                    show={route('orangtua.balita.show', { pemeriksaan: item.id })}
                    id={item.id}
                >
                    <DetailPemeriksaan pemeriksaan={item} detail={item.detailpemeriksaan} />
                </CollapsibleRow>
            );
        });
    }, [pemeriksaan]);
    return (
        <GuestLayout head="Dashboard">
            <Head title="Dashboard" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <TableContainer>
                        <div className="max-w-[300px] md:max-w-[768px] lg:max-w-full">
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
                                <TableBody>{tableRows}</TableBody>
                            </Table>
                        </div>
                    </TableContainer>
                </div>
            </div>
        </GuestLayout>
    );
}

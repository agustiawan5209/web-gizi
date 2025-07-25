import TipsGizi from '@/components/page/tipsGizi';
import GuestLayout from '@/layouts/guest-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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

export default function Dashboard({ balita }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <GuestLayout head="Dashboard">
            <Head title="Dashboard" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <TipsGizi />
            </div>
        </GuestLayout>
    );
}

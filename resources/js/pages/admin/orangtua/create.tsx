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

export default function OrangtuaCreate({ orangtua, breadcrumb }: OrangtuaProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <div className="dark:bg-elevation-1 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">

                </div>
            </div>
        </AppLayout>
    );
}

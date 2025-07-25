import { Head } from '@inertiajs/react';
import React from 'react';

interface MainLayoutProps {
    head: string;
    children: React.ReactNode;
}

export default function MainLayout({ head, children }: MainLayoutProps) {
    return (
        <>
            <section id="main-page" className="relative min-h-screen min-w-full bg-[url('/image/svg/wave.svg')] bg-cover p-0">
                {/* HEADER */}
                <Head title={head} />

                <main className="container mx-auto h-auto">{children}</main>
            </section>
        </>
    );
}

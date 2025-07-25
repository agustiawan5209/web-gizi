import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface GuestLayoutProps {
    head: string;
    children: React.ReactNode;
}

export default function GuestLayout({ head, children }: GuestLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    const [isMobileView, setIsMobileView] = useState(false);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobileView(window.innerWidth < 1024); // lg breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            <section id="main-page" className="relative min-w-full bg-[url('/image/svg/wave.svg')] bg-cover p-0">
                {/* HEADER */}
                <Head title={head} />
                {/* <div className="fixed h-full w-full">
                    <div className="box">
                        <div className="wave -one"></div>
                        <div className="wave -two"></div>
                        <div className="wave -three"></div>
                    </div>
                </div> */}

                {/* Konten */}
                <main className="container mx-auto h-auto">{children}</main>
            </section>
        </>
    );
}

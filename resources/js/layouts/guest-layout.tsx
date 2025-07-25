import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Navbar from './navbar-guest';

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
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format waktu menjadi 2 digit (contoh: 05:09:02)
    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value;
    };

    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const seconds = formatTime(time.getSeconds());

    return (
        <>
            <section id="main-page" className="relative min-w-full min-h-screen bg-[url('/image/svg/wave.svg')] bg-cover p-0">
                {/* HEADER */}
                <Head title={head} />
               <Navbar />
                <main className="container mx-auto h-auto">
                    <div className="rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 p-6 text-white shadow-lg">
                    <div className="flex flex-col items-start justify-between gap-4">
                        {/* Greeting and subtitle */}
                        <div className="item-start flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-black md:text-3xl">Welcome, {auth.user.name}!</h1>
                                 <p className="mt-1 text-black">Selamat datang di sistem klasifikasi anak menggunakan metode naive bayes</p>
                            </div>

                            {/* Stats section */}
                            <div className="flex flex-col gap-6 sm:flex-row">
                                {/* Deals closed */}
                                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="text-2xl font-bold">{formattedDate}</div>
                                </div>
                                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="text-2xl font-bold">
                                        {hours}:{minutes}:{seconds}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {children}</main>
            </section>
        </>
    );
}

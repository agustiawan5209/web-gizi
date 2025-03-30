import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
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
            <section id="main-page" className="relative min-w-full p-0">
                {/* HEADER */}
                <Head title={head} />
               {!isMobileView && (
                    <header id="header" className='bg-background p-2'>
                    <nav className='flex w-full items-center justify-center border-b pb-2 md:w-auto'>
                        <div className="bg-background flex w-full flex-col items-center justify-between px-0 md:flex-row md:px-7">
                            <div className="w-full hidden lg:block border-b pb-2 md:border-0 md:pb-0 lg:w-max">
                                <div className="flex w-full items-center justify-center lg:flex-col">
                                    <AppLogo />
                                </div>
                            </div>
                            <nav className="flex items-center justify-end gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                        >
                                            <Button type='button' variant={'link'}>Masuk</Button>
                                        </Link>
                                        <Link
                                            href={route('register')}
                                        >
                                            <Button type='button' variant={'outline'}>Daftar</Button>

                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </nav>
                </header>
               )}

                {/* Konten */}
                <main className="bg-accent container mx-auto h-auto">{children}</main>
            </section>
        </>
    );
}

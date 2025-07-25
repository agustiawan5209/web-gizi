import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileX, LogOut, MenuSquareIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppLogoIcon from '../app-logo-icon';
import { Button } from '../ui/button';

// Strongly typed Page and Props
type Page = {
    id: string;
    title: string;
    component: React.ReactNode;
    icon?: React.ReactNode;
};

type CarouselSliderProps = {
    pages: Page[];
    initialPageId?: string;
    className?: string;
};

// Animation variants as constants to prevent recreation on every render
const pageVariants = {
    enter: (direction: 'left' | 'right') => ({
        x: direction === 'right' ? '100%' : '-100%',
        opacity: 0,
        scale: 0.98,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: (direction: 'left' | 'right') => ({
        x: direction === 'right' ? '-100%' : '100%',
        opacity: 0,
        scale: 0.98,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const MOBILE_BREAKPOINT = 1024;

const CarouselSlider: React.FC<CarouselSliderProps> = ({ pages, initialPageId, className = '' }) => {
    const { auth } = usePage<SharedData>().props;
    const [currentPageId, setCurrentPageId] = useState<string>(initialPageId || pages[0]?.id || '');
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // Memoized current page to avoid recalculating
    const currentPage = useMemo(() => pages.find((page) => page.id === currentPageId) || pages[0], [currentPageId, pages]);

    // Check screen size with debounce
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsMobileView(window.innerWidth < MOBILE_BREAKPOINT);
            }, 100);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    // Stable navigation function
    const navigateTo = useCallback(
        (pageId: string) => {
            const newIndex = pages.findIndex((page) => page.id === pageId);
            const currentIndex = pages.findIndex((page) => page.id === currentPageId);

            setDirection(newIndex > currentIndex ? 'right' : 'left');
            setCurrentPageId(pageId);

            if (isMobileView) {
                setIsMobileMenuOpen(false);
            }
        },
        [currentPageId, isMobileView, pages],
    );

    // Memoized auth links to prevent unnecessary re-renders
    const authLinks = useMemo(() => {
        if (!auth.user) {
            return (
                <>
                    <Link href={route('login')}>
                        <Button type="button" variant="link">
                            Masuk
                        </Button>
                    </Link>
                    <Link href={route('register')}>
                        <Button type="button" variant="outline">
                            Daftar
                        </Button>
                    </Link>
                </>
            );
        }
        return (
            <Link
                href={route('orangtua.dashboard')}
                className="inline-block rounded-sm border bg-primary border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
            >
                Dashboard
            </Link>
        );
    }, [auth.user]);

    return (
        <div className={`flex h-screen flex-col overflow-hidden rounded-2xl bg-transparent shadow-xl lg:h-[100vh] lg:flex-row ${className}`}>
            {/* Mobile Header */}
            {isMobileView && (
                <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 lg:hidden">
                    <h2 className="text-lg font-semibold text-gray-800">{currentPage.title}</h2>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FileX size={24} /> : <MenuSquareIcon size={24} />}
                    </button>
                </div>
            )}

            {/* Navigation Bar */}
            {(isMobileMenuOpen || !isMobileView) && (
                <section className="flex bg-transparent p-6 z-[99]">
                    <motion.nav
                        initial={isMobileView ? { opacity: 0, y: -20 } : {}}
                        animate={isMobileView ? { opacity: 1, y: 0 } : {}}
                        exit={isMobileView ? { opacity: 0, y: -20 } : {}}
                        transition={{ duration: 0.2 }}
                        className={`flex flex-col  justify-center ${isMobileView ? 'w-full border-b border-gray-200' : ''}`}
                    >
                        <div className="hidden w-full pb-2 md:border-0 md:pl-10 lg:block lg:w-max">
                            <div className="flex w-full items-center justify-start">
                                    <AppLogoIcon className="w-10 h-10 bg-transparent text-white" />
                                <div className="ml-1 grid flex-1 text-left text-white text-lg">
                                    <span className="mb-0.5 truncate leading-none font-semibold">WEB GIZI</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-primary flex h-full max-w-full flex-wrap justify-center gap-2 rounded-2xl p-4 lg:w-64 lg:flex-col lg:justify-start lg:gap-1">
                            {pages.map((page) => (
                                <button
                                    key={page.id}
                                    onClick={() => navigateTo(page.id)}
                                    className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                                        currentPageId === page.id
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-100 hover:bg-gray-100 hover:text-blue-600'
                                    }`}
                                    aria-current={currentPageId === page.id ? 'page' : undefined}
                                >
                                    {page.icon && <span className="mr-3 text-lg">{page.icon}</span>}
                                    <span className="text-sm font-medium md:text-base">{page.title}</span>
                                </button>
                            ))}

                            <div className="mt-auto flex items-center justify-end gap-4 lg:hidden">{authLinks}</div>

                        </div>
                    </motion.nav>
                </section>
            )}

            {/* Content Area */}
            <div className="relative flex-1 overflow-hidden">
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={currentPageId}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 overflow-auto"
                    >
                        {!isMobileView && (
                            <header id="header" className="bg-transparent">
                                <nav className="flex w-full items-center justify-center pb-2 md:w-auto">
                                    <div className="flex w-full flex-col items-center justify-end bg-transparent px-0 md:flex-row md:py-6 md:pr-20">
                                        <nav className="flex items-center justify-end gap-4">
                                            {auth.user ? (
                                                <>
                                                    <Link
                                                        href={route('orangtua.dashboard')}
                                                        className="inline-block bg-primary rounded-sm border border-[#19140035] px-5 py-1.5 text-base leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] text-[#EDEDEC] dark:hover:border-[#62605b]"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        className="inline-flex rounded-sm border bg-destructive border-[#19140035] px-5 py-1.5 text-base leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] text-[#EDEDEC] dark:hover:border-[#62605b]"
                                                        method="post"
                                                        href={route('logout')}
                                                        as="button"
                                                    >
                                                        <LogOut className="mr-2" />
                                                        Keluar
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href={route('login')}>
                                                        <Button type="button" className="text-lg" variant={'default'}>
                                                            Masuk
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('register')}>
                                                        <Button type="button" className="text-lg" variant={'secondary'}>
                                                            Daftar
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}
                                        </nav>
                                    </div>
                                </nav>
                            </header>
                        )}
                        <div className="mx-auto max-w-7xl">{currentPage?.component}</div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CarouselSlider;

import { AnimatePresence, motion } from 'framer-motion';
import { FileX, MenuSquareIcon } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '../ui/button';
import type { SharedData } from '@/types';

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

const CarouselSlider: React.FC<CarouselSliderProps> = ({
    pages,
    initialPageId,
    className = ''
}) => {
    const { auth } = usePage<SharedData>().props;
    const [currentPageId, setCurrentPageId] = useState<string>(initialPageId || pages[0]?.id || '');
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // Memoized current page to avoid recalculating
    const currentPage = useMemo(
        () => pages.find((page) => page.id === currentPageId) || pages[0],
        [currentPageId, pages]
    );

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
        [currentPageId, isMobileView, pages]
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
                href={route('dashboard')}
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
            >
                Dashboard
            </Link>
        );
    }, [auth.user]);

    return (
        <div
            className={`flex h-screen flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl lg:h-[90vh] lg:flex-row ${className}`}
        >
            {/* Mobile Header */}
            {isMobileView && (
                <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 lg:hidden">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {currentPage.title}
                    </h2>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <FileX size={24} />
                        ) : (
                            <MenuSquareIcon size={24} />
                        )}
                    </button>
                </div>
            )}

            {/* Navigation Bar */}
            {(isMobileMenuOpen || !isMobileView) && (
                <motion.nav
                    initial={isMobileView ? { opacity: 0, y: -20 } : {}}
                    animate={isMobileView ? { opacity: 1, y: 0 } : {}}
                    exit={isMobileView ? { opacity: 0, y: -20 } : {}}
                    transition={{ duration: 0.2 }}
                    className={`flex max-w-full flex-wrap justify-center gap-2 bg-gradient-to-b from-gray-50 to-white p-4 lg:w-64 lg:flex-col lg:justify-start lg:gap-1 lg:border-r lg:border-gray-200 ${
                        isMobileView ? 'w-full border-b border-gray-200' : ''
                    }`}
                >

                    {pages.map((page) => (
                        <button
                            key={page.id}
                            onClick={() => navigateTo(page.id)}
                            className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                                currentPageId === page.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                            aria-current={currentPageId === page.id ? 'page' : undefined}
                        >
                            {page.icon && (
                                <span className="mr-3 text-lg">{page.icon}</span>
                            )}
                            <span className="text-sm font-medium md:text-base">
                                {page.title}
                            </span>
                        </button>
                    ))}

                    <div className="mt-auto flex items-center justify-end gap-4 lg:hidden">
                        {authLinks}
                    </div>

                    {!isMobileView && (
                        <div className="mt-auto hidden border-t border-gray-200 pt-4 lg:block">
                            <div className="px-4 py-2 text-xs text-gray-500">
                                Current:{' '}
                                <span className="font-medium text-gray-700">
                                    {currentPage.title}
                                </span>
                            </div>
                        </div>
                    )}
                </motion.nav>
            )}

            {/* Content Area */}
            <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={currentPageId}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 overflow-auto p-6 md:p-8 lg:p-10"
                    >
                        <div className="mx-auto max-w-6xl">
                            {currentPage?.component}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CarouselSlider;

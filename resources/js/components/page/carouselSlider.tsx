import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

// types.ts
type Page = {
    id: string;
    title: string;
    component: React.ReactNode;
};

type CarouselSliderProps = {
    pages: Page[];
    initialPageId?: string;
};

const CarouselSlider = ({ pages, initialPageId }: CarouselSliderProps) => {
    const [currentPageId, setCurrentPageId] = useState(initialPageId || pages[0]?.id || '');
    const [direction, setDirection] = useState<'left' | 'right'>('right');

    const currentPageIndex = pages.findIndex((page) => page.id === currentPageId);

    const navigateTo = (pageId: string) => {
        const newIndex = pages.findIndex((page) => page.id === pageId);
        setDirection(newIndex > currentPageIndex ? 'right' : 'left');
        setCurrentPageId(pageId);
    };

    const currentPage = pages.find((page) => page.id === currentPageId) || pages[0];

    const pageVariants = {
        enter: (direction: string) => ({
            x: direction === 'right' ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        },
        exit: (direction: string) => ({
            x: direction === 'right' ? '-100%' : '100%',
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: 'easeInOut',
            },
        }),
    };

    return (
        <div className="flex h-[90vh] flex-col lg:flex-row">
            {/* Navigation Bar */}
            <nav className="max-w-md w-[13rem] flex flex-wrap lg:flex-col justify-center gap-4 bg-gray-100 p-2 shadow-md">
                {pages.map((page) => (
                    <button
                        key={page.id}
                        onClick={() => navigateTo(page.id)}
                        className={`rounded-md px-6 py-2 transition-all duration-300 text-xs md:text-sm lg:text-base ${
                            currentPageId === page.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                        aria-current={currentPageId === page.id ? 'page' : undefined}
                    >
                        {page.title}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <div className="relative flex-1 overflow-hidden bg-white">
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={currentPageId}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 overflow-auto p-4 md:p-8"
                    >
                        {currentPage?.component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CarouselSlider;

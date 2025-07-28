import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, ClipboardList, Home, Menu, Phone, User2Icon, X } from 'lucide-react';
import React, { useState } from 'react';
interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    current?: boolean;
}

const StaticNavbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const page = usePage<SharedData>();
    const currentUrl = `${page.props.defaultUrl +page.url}`
    console.log(route('orangtua.dashboard'))
    console.log(currentUrl)

    const navigation: NavItem[] = [
        { name: 'Home', href: route('orangtua.dashboard'), icon: <Home className="h-5 w-5" />, current:   route('orangtua.dashboard') == currentUrl},
        { name: 'Lihat Hasil Pemeriksaan Gizi', href: route('orangtua.pemeriksaan.index'), icon: <ClipboardList className="h-5 w-5" /> , current:   route('orangtua.pemeriksaan.index') == currentUrl},
        { name: 'Periksa Gizi Balita', href: route('orangtua.pemeriksaan.create'), icon: <ClipboardList className="h-5 w-5" /> , current:   route('orangtua.pemeriksaan.create') == currentUrl},
        { name: 'Impelementasi Algortima', href: route('orangtua.naiveBayes'), icon: <Phone className="h-5 w-5" /> , current:    route('orangtua.naiveBayes') == currentUrl},
    ];
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    return (
        <nav className="static w-full border-b bg-primary border-blue-500/20 mb-4 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and desktop navigation */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold text-white">Posyandu</span>
                        </div>
                        <div className="ml-10 hidden md:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                                            item.current ? 'bg-blue-100/50 text-white' : 'text-white hover:bg-blue-100/30 hover:text-white'
                                        }`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Auth buttons - desktop */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex flex-row p-2 gap-2  rounded-md items-center text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group">
                                        <UserInfo user={auth.user} />
                                        <User2Icon className="ml-auto size-4" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                    align="end"
                                    side={isMobile ? 'bottom' : 'bottom'}
                                >
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-100/30 hover:text-blue-800 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="space-y-1 rounded-b-lg bg-white/95 px-2 pt-2 pb-3 shadow-lg sm:px-3">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                                item.current ? 'bg-blue-100/50 text-white' : 'text-white hover:bg-blue-100/30 hover:text-white'
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                    <div className="border-t border-blue-100 pt-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group">
                                    <UserInfo user={auth.user} />
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                align="end"
                                side={isMobile ? 'bottom' : 'bottom'}
                            >
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default StaticNavbar;

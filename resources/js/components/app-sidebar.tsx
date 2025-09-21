import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookUser, Folder, LayoutGrid, LucideHome, PlaySquare, Table2Icon } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LucideHome,
    },
    {
        title: 'Manajemen User',
        href: '/admin/orangtua/',
        icon: Folder,
    },
    {
        title: 'Attribut Kriteria',
        href: '/admin/attribut/',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Kelola Balita',
    //     href: '/admin/balita/',
    //     icon: BookUser,
    // },
    {
        title: 'Pemeriksaan',
        href: '/pemeriksaan/',
        icon: PlaySquare,
    },
    {
        title: 'Dataset',
        href: '/admin/dataset/',
        icon: Table2Icon,
    },
];
const orangTuaNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LucideHome,
    },
    {
        title: 'Balita',
        href: '/orangtua/balita/',
        icon: BookUser,
    },
    {
        title: 'Pemeriksaan',
        href: '/pemeriksaan/',
        icon: PlaySquare,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { role } = page.props;

    let mainNavItems: NavItem[] = [];
    if (role === 'orangtua') {
        mainNavItems = orangTuaNavItems;
    } else if (role === 'admin') {
        mainNavItems = adminNavItems;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

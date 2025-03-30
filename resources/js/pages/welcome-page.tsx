import GuestLayout from "@/layouts/guest-layout"
import HomePage from "@/components/page/home-page";
import AboutPage from "@/components/page/about-page";
import { FiturPage } from "@/components/page/fitur-page";
import CarouselSlider from "@/components/page/carouselSlider";
import { Home, UserX, LayoutGrid } from "lucide-react";
export default function WelcomePage(){
    const pages = [
        { id: "home", title: "Home", component: <HomePage />, icon: <Home /> },
        { id: "about", title: "Tentang Kami", component: <AboutPage />, icon: <UserX/> },
        { id: "fitur", title: "Fitur Website", component: <FiturPage />, icon: <LayoutGrid/> },
      ];
    return <>
        <GuestLayout head="Home">
           {/* component HEADER */}
           <section id="header">
                <CarouselSlider pages={pages} initialPageId="home" />
           </section>
        </GuestLayout>
    </>
}

import GuestLayout from "@/layouts/guest-layout"
import HomePage from "@/components/page/home-page";
import AboutPage from "@/components/page/about-page";
import { FiturPage } from "@/components/page/fitur-page";
import CarouselSlider from "@/components/page/carouselSlider";
import { Home, UserX, LayoutGrid, ChartBarIcon, InfoIcon } from "lucide-react";
import NaiveBayesNutritionExplanation from "@/components/page/naive-bayes";
import EdukasiGiziAnak from "@/components/page/edukasi";
export default function WelcomePage(){
    const pages = [
        { id: "home", title: "Home", component: <HomePage />, icon: <Home /> },
        { id: "about", title: "Tentang Kami", component: <AboutPage />, icon: <UserX/> },
        { id: "fitur", title: "Fitur Website", component: <FiturPage />, icon: <LayoutGrid/> },
        { id: "naive-bayes", title: "Naive bayes", component: <NaiveBayesNutritionExplanation />, icon: <ChartBarIcon/> },
        { id: "Edukasi-gizi", title: "edukasi gizi", component: <EdukasiGiziAnak />, icon: <InfoIcon/> },
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

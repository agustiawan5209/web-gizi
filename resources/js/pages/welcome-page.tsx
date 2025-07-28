import MainLayout from "@/layouts/main-layout"
import HomePage from "@/components/page/home-page";
import AboutPage from "@/components/page/about-page";
import CarouselSlider from "@/components/page/carouselSlider";
import NaiveBayesNutritionExplanation from "@/components/page/naive-bayes";
import { Home, UserX, ChartBarIcon, InfoIcon } from "lucide-react";

import EdukasiGiziAnak from "@/components/page/edukasi";

export default function WelcomePage(){
    const pages = [
        { id: "home", title: "Home", component: <HomePage />, icon: <Home /> },
        { id: "about", title: "Tentang Kami", component: <AboutPage />, icon: <UserX/> },
        // { id: "fitur", title: "Fitur Website", component: <FiturPage />, icon: <LayoutGrid/> },
        { id: "naive-bayes", title: "Naive bayes", component: <NaiveBayesNutritionExplanation />, icon: <ChartBarIcon/> },
        { id: "Edukasi-gizi", title: "edukasi gizi", component: <EdukasiGiziAnak />, icon: <InfoIcon/> },
      ];
    return <>
        <MainLayout head="Home">
           {/* component HEADER */}
           <section id="header">
                <CarouselSlider pages={pages} initialPageId="home" />
           </section>
        </MainLayout>
    </>
}

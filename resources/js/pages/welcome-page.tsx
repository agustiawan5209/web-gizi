import GuestLayout from "@/layouts/guest-layout"
import HomePage from "@/components/page/home-page";
import AboutPage from "@/components/page/about-page";
import CarouselSlider from "@/components/page/carouselSlider";
export default function WelcomePage(){
    const pages = [
        { id: "home", title: "Home", component: <HomePage /> },
        { id: "about", title: "About", component: <AboutPage /> },
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

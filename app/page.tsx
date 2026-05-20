import { CultureCards } from "@/components/CultureCards";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HistorySection } from "@/components/HistorySection";
import { LuhakSection } from "@/components/LuhakSection";
import { MapSection } from "@/components/MapSection";
import { Navbar } from "@/components/Navbar";
import { TourismCards } from "@/components/TourismCards";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LuhakSection />
        <MapSection />
        <TourismCards />
        <CultureCards />
        <HistorySection />
      </main>
      <Footer />
    </>
  );
}

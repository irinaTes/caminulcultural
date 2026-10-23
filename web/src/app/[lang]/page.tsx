import { DirectionsSection } from "@/components/sections/directions/DirectionsSection";
import { GiftSection } from "@/components/sections/gift/GiftSection";
import { Hero } from "@/components/sections/hero/Hero";
import { PosterBoard } from "@/components/sections/poster-board/PosterBoard";
import { RegisterSection } from "@/components/sections/register/RegisterSection";
import { RentSection } from "@/components/sections/rent/RentSection";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { sectionIds } from "@/config/site";

export default function Home() {
  return (
    <>
      <Header />
      <main id={sectionIds.content}>
        <Hero />
        <PosterBoard />
        <RentSection />
        <GiftSection />
        <RegisterSection />
        <DirectionsSection />
      </main>
      <Footer />
    </>
  );
}

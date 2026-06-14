import { CultureCards } from "@/components/CultureCards";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HistorySection } from "@/components/HistorySection";
import { LuhakSection } from "@/components/LuhakSection";
import { MapSection } from "@/components/MapSection";
import { Navbar } from "@/components/Navbar";
import { TourismCards } from "@/components/TourismCards";
import { FeaturedArticles } from "@/components/articles/FeaturedArticles";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  });

  const latestArticles = await prisma.article.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LuhakSection />
        <MapSection
          destinations={destinations.map((destination) => ({
            id: destination.id,
            title: destination.title,
            description: destination.description,
            image: destination.image,
            location: destination.location,
            category: destination.category,
            latitude: destination.latitude,
            longitude: destination.longitude
          }))}
        />
        <TourismCards
          destinations={destinations.map((destination) => ({
            id: destination.id,
            title: destination.title,
            description: destination.description,
            image: destination.image,
            location: destination.location,
            category: destination.category,
            latitude: destination.latitude,
            longitude: destination.longitude,
            creator: destination.creator
          }))}
        />
        <FeaturedArticles
          articles={latestArticles.map((article) => ({
            id: article.id,
            title: article.title,
            category: article.category,
            content: article.content,
            image: article.image,
            createdAt: article.createdAt.toISOString(),
            creatorName: article.creator.name
          }))}
        />
        <CultureCards />
        <HistorySection />
      </main>
      <Footer />
    </>
  );
}

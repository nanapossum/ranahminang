import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "RanahMinang | Tourism & Culture Exchange",
  description:
    "Interactive cultural tourism platform for Minangkabau heritage, hidden destinations, and historical geography in West Sumatra."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

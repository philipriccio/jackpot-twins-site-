import type { Metadata } from "next";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const condensed = Bebas_Neue({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: "400",
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jackpot Twins",
  description:
    "Jackpot Twins is a world premiere comedy by Philip Riccio, produced by The Company Theatre in association with Mirvish Productions.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "Jackpot Twins",
    description:
      "A world premiere comedy by Philip Riccio, produced by The Company Theatre in association with Mirvish Productions.",
    type: "website",
    url: "https://jackpottwins.ca",
    images: [
      {
        url: "https://jackpottwins.ca/images/poster-web-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Jackpot Twins poster",
      },
    ],
  },
  alternates: {
    canonical: "https://jackpottwins.ca",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${condensed.variable} ${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0a] font-[var(--font-sans)] text-white">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Bebas_Neue, Inter, Oswald } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const subheading = Oswald({
  variable: "--font-subheading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html
      lang="en"
      className={`${display.variable} ${subheading.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--black)] font-[var(--font-sans)] text-[var(--black)]">
        {children}
      </body>
    </html>
  );
}

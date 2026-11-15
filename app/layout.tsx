import SiteAnalytics from "./site-analytics";
import Script from "next/script";
import type { Metadata } from "next";
import { Bebas_Neue, Inter, Luckiest_Guy, Nunito, Oswald } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Runtime kill switch must also remove the homepage invitation without rebuilding.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL("https://jackpottwins.ca"),
  title: "Jackpot Twins — Toronto Comedy | March 9–28, 2027",
  description:
    "Seana McKenna and Nora McLellan star in Philip Riccio’s new comedy. March 9–28, 2027 at Toronto’s CAA Theatre. Explore the show and buy official Mirvish tickets.",
  keywords: [
    "Jackpot Twins",
    "Philip Riccio",
    "Company Theatre",
    "Mirvish Productions",
    "CAA Theatre",
    "Toronto theatre",
    "world premiere",
    "new comedy",
    "Seana McKenna",
    "Nora McLellan",
    "Tony Nappo",
    "Colin Doyle",
    "Caroline Toal",
    "Canadian theatre",
    "Off Mirvish",
    "2027",
  ],
  authors: [{ name: "The Company Theatre" }],
  creator: "The Company Theatre",
  publisher: "Mirvish Productions",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://jackpottwins.ca",
  },
  openGraph: {
    title: "Jackpot Twins — March 9–28, 2027 · Toronto",
    description:
      "A sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted. Starring Seana McKenna & Nora McLellan. CAA Theatre, Toronto.",
    url: "https://jackpottwins.ca",
    siteName: "Jackpot Twins",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/images/search-social-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Jackpot Twins — A New Comedy by Philip Riccio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jackpot Twins — March 9–28, 2027 · Toronto",
    description:
      "A sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted.",
    images: ["/images/search-social-1200x630.jpg"],
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
      className={`${bebasNeue.variable} ${luckiestGuy.variable} ${nunito.variable} ${oswald.variable} ${inter.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KCPDK21Y7G"
          strategy="afterInteractive"
        />
      </head>
      <body><a className="skip-link" href="#main-content">Skip to main content</a>{children}<SiteAnalytics metaPixelId={process.env.NODE_ENV === 'production' ? process.env.META_PIXEL_ID : undefined} />
        </body>
    </html>
  );
}

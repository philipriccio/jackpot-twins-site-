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

export const metadata: Metadata = {
  metadataBase: new URL("https://jackpottwins.ca"),
  title: "Jackpot Twins — A New Comedy by Philip Riccio | World Premiere 2027",
  description:
    "Jackpot Twins — A sharp-witted, irreverent new comedy by Philip Riccio. World Premiere Spring 2027 at the CAA Theatre, Toronto. Starring Seana McKenna, Nora McLellan, Tony Nappo, Colin A Doyle & Caroline Toal. A Company Theatre & Mirvish Productions co-production.",
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
    title: "Jackpot Twins — World Premiere Spring 2027",
    description:
      "A sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted. Starring Seana McKenna & Nora McLellan. CAA Theatre, Toronto.",
    url: "https://jackpottwins.ca",
    siteName: "Jackpot Twins",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/images/poster-web-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Jackpot Twins — A New Comedy by Philip Riccio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jackpot Twins — World Premiere Spring 2027",
    description:
      "A sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted.",
    images: ["/images/poster-web-1200x630.jpg"],
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
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KCPDK21Y7G');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}

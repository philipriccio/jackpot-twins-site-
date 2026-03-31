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
  title: "JACKPOT TWINS — jackpottwins.ca",
  description:
    "Jackpot Twins — A New Comedy by Philip Riccio. World Premiere Spring 2027 at the CAA Theatre, Toronto. Starring Seana McKenna & Nora McLellan.",
  openGraph: {
    title: "Jackpot Twins — World Premiere",
    description:
      "A sharp-witted, irreverent new comedy about the heavy price of getting everything you ever wanted.",
    url: "https://jackpottwins.ca",
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

import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ShepherdWidget from "@/components/shepherd/ShepherdWidget";

// Display: a warm, distinctive serif for headings. Body: Inter for everything else.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jide Ojo Ministry International | Glorifying the Finished Works of Christ",
    template: "%s | Jide Ojo Ministry International",
  },
  description:
    "An apostolic ministry taking the revelation of the finished works of Christ to cities and nations through services, conferences, training and apostolic missions.",
  keywords: [
    "Jide Ojo",
    "JOMI",
    "apostolic ministry",
    "finished works of Christ",
    "Abuja church",
    "grace teaching",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Scroll reveals start at opacity 0 and are animated in by JavaScript.
            Without JS there is nothing to animate them, so show everything. */}
        <noscript>
          <style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased bg-white text-ink-800">
        <SiteHeader />
        {children}
        <Footer />
        <ShepherdWidget />
      </body>
    </html>
  );
}

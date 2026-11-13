// app/layout.js
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import { BRAND } from "@/lib/brand";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QueryProvider from '@/providers/QueryProvider';
import ClientProviders from "./ClientProviders";
import ScrollbarVisibility from "@/components/ScrollbarVisibility";
import Footer from "@/components/organisms/Footer";
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

/* Avenir Next is not on Google Fonts; Nunito Sans loads as the web fallback.
   Mac/iOS users with Avenir Next installed will get the brand font via the CSS stack. */
const bodyFont = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-avenir-fallback",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: BRAND.fullTitle,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.defaultDescription,
  keywords: [...BRAND.keywords],
  authors: [{ name: BRAND.name, url: BRAND.url }],
  creator: BRAND.name,
  publisher: BRAND.name,
  openGraph: {
    title: BRAND.fullTitle,
    description: BRAND.defaultDescription,
    url: BRAND.url,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.png?v=3", type: "image/png", sizes: "any" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    apple: "/apple-icon.png?v=3",
    shortcut: "/icon.png?v=3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${bodyFont.variable}`}>
      <body className={bodyFont.className}>
        <QueryProvider>
          <ClientProviders>
            <ScrollbarVisibility />
            {children}
            <Footer />
          </ClientProviders>
        </QueryProvider>
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}
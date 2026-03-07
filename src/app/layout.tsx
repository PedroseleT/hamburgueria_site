import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../context/CartContext";
import CookieBanner from "@/components/CookieBanner";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "The Flame Grill",
  description: "O Brasil em cada mordida",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={oswald.variable}>
      <body
        className={oswald.className}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0a0a0a',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <CartProvider>
          {/* ALTERAÇÃO SOLICITADA: navbar superior oculta no mobile */}
          <div className="desktop-navbar">
            <Navbar />
          </div>

          <main style={{ flex: 1 }}>
            {children}
          </main>

          <Footer />
          <CookieBanner />
        </CartProvider>

        <style>{`
          .desktop-navbar { display: none; }
          @media (min-width: 992px) {
            .desktop-navbar { display: block; }
          }
        `}</style>
      </body>
    </html>
  );
}
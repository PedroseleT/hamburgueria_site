import type { Metadata } from "next";
import BottomNavMobile from "@/components/BottomNavMobile";
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
  // # ALTERAÇÃO SOLICITADA: Registro nativo do manifest para o PWA/Notificações
  manifest: "/manifest.json",
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
      <head>
        {/* # ALTERAÇÃO SOLICITADA: Fallback direto no head para garantir compatibilidade com o Safari do iOS */}
        <link rel="manifest" href="/manifest.json" />
      </head>
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
          <BottomNavMobile />
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
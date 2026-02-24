import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext"; // Adicionado

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Pedro Burger Grill",
  description: "O Brasil em cada mordida",
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
          minHeight: '100vh'
        }}
      >
        <CartProvider> {/* Envolvendo para o carrinho funcionar */}
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
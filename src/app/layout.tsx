import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "../context/CartContext";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "The Flame Grill",
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
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Garante que o corpo ocupe a tela toda
        }}
      >
        <CartProvider>
          {/* A Navbar fica no topo de todas as páginas */}
          <Navbar />
          
          {/* O children representa o conteúdo de cada página (/cardapio, /sobre, etc) */}
          {/* O flex: 1 faz com que o conteúdo empurre o rodapé para o fim da página */}
          <main style={{ flex: 1 }}>
            {children}
          </main>

          {/* O Footer aqui será replicado em ABSOLUTAMENTE TODAS as páginas */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
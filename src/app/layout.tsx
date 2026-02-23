import "./globals.css"; // A linha que traz o Tailwind para o projeto
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" style={{ backgroundColor: '#0a0a0a' }}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: 'white' }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
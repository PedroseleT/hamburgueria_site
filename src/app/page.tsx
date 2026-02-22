"use client";

import { MessageCircle } from 'lucide-react';

export default function Home() {

  return (
    <main className="main-container" style={{
      margin: 0,
      padding: 0,
      paddingTop: '80px',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      width: '100%',
      color: '#fff',
      fontFamily: '"Oswald", sans-serif',
      position: 'relative'
    }}>

      <div className="flame-overlay"></div>

      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: #0a0a0a;
          scroll-behavior: smooth;
        }

        .flame-overlay {
          position: fixed;
          inset: 0;
          background-image: url("/chamas-overlay.png");
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 1;
        }

        /* 🔥 EFEITO DE PREENCHIMENTO DO BOTÃO VER CARDÁPIO */
        .btn-cardapio-completo {
          display: inline-block;
          padding: 15px 40px;
          background-color: transparent;
          border: 2px solid #b91c1c;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        .btn-cardapio-completo:hover {
          background-color: #b91c1c !important;
          color: #fff !important;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(185, 28, 28, 0.4);
        }

        /* 📱 AJUSTE MOBILE DEFINITIVO */
        @media (max-width: 768px) {
          .hero-section {
            height: 85vh !important;
            background-image: url("/design_mobile.jpg") !important; 
            background-position: center top !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            overflow: visible !important;
          }

          .hero-content {
            padding: 0 !important;
            width: 100% !important;
            position: absolute !important;
            bottom: -20px !important; 
            z-index: 100 !important; 
            display: flex !important;
            justify-content: center !important;
          }

          .hero-text h1 {
            font-size: 30px !important; 
            line-height: 1.1 !important;
            text-shadow: none !important;
            margin: 0 !important;
            padding: 0 15px !important;
          }

          .hero-text p {
            display: none !important; /* REMOVE APENAS NO MOBILE */
          }

          #cardapio {
            padding-top: 100px !important;
          }

          .cardapio-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="hero-section" style={{
        position: 'relative',
        height: '90vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url("/burger-destaque.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat'
      }}>
        
        <div className="hero-content" style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '8%',
          position: 'relative',
          zIndex: 3
        }}>
          <div className="hero-text" style={{
            textAlign: 'right',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: 'clamp(40px, 7vw, 90px)',
              lineHeight: '0.85',
              fontWeight: '900',
              textTransform: 'uppercase',
              fontFamily: 'Impact, sans-serif',
              textShadow: '3px 3px 15px rgba(0,0,0,0.8)' 
            }}>
              O BRASIL EM<br />
              CADA MORDIDA
            </h1>

            <p style={{
              marginTop: '15px',
              fontSize: '28px',
              fontFamily: '"Brush Script MT", cursive',
              color: '#eee',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
            }}>
              PEDRO Burger Grill
            </p>
          </div>
        </div>
      </section>

      {/* ================= SEÇÃO CARDÁPIO (PRODUTOS) ================= */}
      <section id="cardapio" style={{
        padding: '120px 20px 80px',
        backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)), url("/grunge-black-concrete-textured-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <span style={{ color: '#fff', fontSize: '18px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '5px' }}>Nosso</span>
        <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 60px 0' }}>CARDÁPIO</h2>
        
        {/* GRID DOS PRODUTOS COM PLACEHOLDERS */}
        <div className="cardapio-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <Card 
            foto="[Foto Produto]" 
            nome="[Nome/Foto Produto]" 
            desc="[Descrição]" 
          />
          <Card 
            foto="[Foto Produto]" 
            nome="[Nome/Foto Produto]" 
            desc="[Descrição]" 
          />
          <Card 
            foto="[Foto Produto]" 
            nome="[Nome/Foto Produto]" 
            desc="[Descrição]" 
          />
        </div>

        <div style={{ marginTop: '70px' }}>
          {/* Botão com a classe CSS para o efeito hover vermelho */}
          <a href="/cardapio" className="btn-cardapio-completo">
            VER CARDÁPIO COMPLETO
          </a>
        </div>
      </section>

      <a href="https://wa.me/seunumero" target="_blank" style={whatsappFloat}>
        <MessageCircle size={35} color="#fff" />
      </a>
    </main>
  );
}

// COMPONENTE DO CARD DE PRODUTO
function Card({ foto, nome, desc }: { foto: string, nome: string, desc: string }) {
  return (
    <div style={{
      backgroundColor: 'rgba(17, 17, 17, 0.95)',
      padding: '40px 30px',
      borderRadius: '15px',
      textAlign: 'center',
      border: '1px solid #333',
      transition: '0.3s'
    }}>
      {/* Placeholder de imagem se não for uma URL de imagem válida */}
      <div style={{ width: '100%', height: '200px', backgroundColor: '#333', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontWeight: 'bold' }}>
        {foto}
      </div>
      
      <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase', color: '#fff' }}>{nome}</h3>
      <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '25px', lineHeight: '1.6', minHeight: '45px' }}>{desc}</p>
      <button style={{
        padding: '10px 25px',
        backgroundColor: 'transparent',
        border: '2px solid #fff',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        textTransform: 'uppercase'
      }}>
        PEDIR AGORA
      </button>
    </div>
  );
}

const whatsappFloat: React.CSSProperties = { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', padding: '15px', borderRadius: '50%', zIndex: 1000 };
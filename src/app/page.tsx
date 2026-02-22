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

      {/* 🔥 OVERLAY GLOBAL DE CHAMAS */}
      <div className="flame-overlay"></div>

      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: #0a0a0a;
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
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

        main > section {
          position: relative;
          z-index: 2;
        }

        /* 📱 AJUSTES EXCLUSIVOS MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            height: 90vh !important;
            /* 👇 RENOMEIE SUA FOTO NOVA PARA 'burger-mobile.jpg' OU USE O NOME ABAIXO */
            background-image: url("/design_mobile.jpg") !important; 
            background-position: center center !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important; 
            padding-bottom: 40px !important;
          }

          .hero-content {
            padding-right: 0 !important;
            justify-content: center !important;
            text-align: center !important;
            /* Gradiente suave para o texto não sumir na madeira */
            background: linear-gradient(transparent, rgba(0,0,0,0.85) 60%) !important;
            width: 100% !important;
            padding: 40px 20px !important;
          }

          .hero-text {
            text-align: center !important;
            max-width: 100% !important;
          }

          .hero-text h1 {
            font-size: 42px !important;
            line-height: 0.9 !important;
          }

          .hero-text p {
            font-size: 24px !important;
          }

          .cardapio-grid {
            grid-template-columns: 1fr !important;
            padding: 0 15px !important;
          }

          .banner-title {
            font-size: 26px !important;
            padding: 0 10px;
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
        overflow: 'hidden',
        backgroundImage: 'url("/burger-destaque.jpg")', // Foto horizontal original (PC)
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

      {/* ================= SEÇÃO CARDÁPIO ================= */}

      <section id="cardapio" style={{
        padding: '120px 20px 80px',
        backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)), url("/grunge-black-concrete-textured-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center'
      }}>
        <span style={{
          color: '#fff', fontSize: '20px', textTransform: 'uppercase',
          fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '-10px'
        }}>Nosso</span>
        
        <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 50px 0' }}>CARDÁPIO</h2>
        
        <div className="cardapio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <Card />
          <Card />
          <Card />
        </div>

        <div style={{ marginTop: '60px' }}>
          <a href="/cardapio" style={{
            display: 'inline-block',
            padding: '15px 40px',
            backgroundColor: 'transparent',
            border: '2px solid #b91c1c',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            transition: '0.3s',
            borderRadius: '5px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            VER O CARDÁPIO COMPLETO
          </a>
        </div>
      </section>

      {/* ================= BANNER ================= */}

      <section style={{
        height: '350px',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/banner-fome.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 className="banner-title" style={{ fontSize: '45px', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center' }}>
          PREPARE-SE PARA O EXAGERO!
        </h2>
        <button style={btnOrderNow}>FAZER PEDIDO AGORA</button>
      </section>

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/seunumero" target="_blank" style={whatsappFloat}>
        <MessageCircle size={35} color="#fff" />
      </a>

    </main>
  );
}

function Card() {
  return (
    <div style={cardStyle}>
      <img src="/piscina-cacador.png" alt="Produto" style={imgStyle} />
      <h3 style={titleCardStyle}>NOME DO PRODUTO</h3>
      <p style={textCardStyle}>[DESCRIÇÃO DO PRODUTO]</p>
      <button style={btnCardStyle}>PEDIR AGORA</button>
    </div>
  );
}

const cardStyle: React.CSSProperties = { backgroundColor: 'rgba(17, 17, 17, 0.95)', padding: '40px 30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #333' };
const imgStyle: React.CSSProperties = { width: '180px', marginBottom: '20px' };
const titleCardStyle: React.CSSProperties = { fontSize: '20px', fontWeight: '900', marginBottom: '15px', textTransform: 'uppercase' };
const textCardStyle: React.CSSProperties = { fontSize: '13px', color: '#ccc', marginBottom: '25px', lineHeight: '1.4' };
const btnCardStyle: React.CSSProperties = { padding: '10px 25px', backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
const btnOrderNow: React.CSSProperties = { marginTop: '20px', padding: '12px 30px', backgroundColor: '#b91c1c', color: '#fff', border: 'none', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' };
const whatsappFloat: React.CSSProperties = { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', padding: '15px', borderRadius: '50%', zIndex: 1000 };
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

        main > section {
          position: relative;
          z-index: 2;
        }

        /* 📱 AJUSTES MOBILE ESPECÍFICOS */
        @media (max-width: 768px) {
          .hero-section {
            height: 75vh !important; /* Reduzi um pouco a altura para o texto encaixar melhor abaixo */
            background-image: url("/design_mobile.jpg") !important; 
            background-position: center top !important;
            display: flex !important;
            align-items: flex-end !important;
            justify-content: center !important;
            padding-bottom: 0 !important;
          }

          .hero-content {
            padding-right: 0 !important;
            width: 100% !important;
            /* Posiciona o texto exatamente na transição da foto para o cardápio */
            position: absolute !important;
            bottom: -40px !important; 
            z-index: 10 !important;
          }

          .hero-text {
            text-align: center !important;
            width: 100% !important;
          }

          .hero-text h1 {
            font-size: 32px !important;
            text-shadow: none !important; /* REMOVE A SOMBRA NO MOBILE */
            margin: 0 !important;
            background-color: transparent !important;
          }

          /* ESCONDE O NOME NO MOBILE */
          .hero-text p {
            display: none !important;
          }

          /* Ajuste de margem no cardápio para não colar no texto subido */
          #cardapio {
            padding-top: 100px !important;
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

      {/* ================= SEÇÃO CARDÁPIO ================= */}
      <section id="cardapio" style={{
        padding: '120px 20px 80px',
        backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)), url("/grunge-black-concrete-textured-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center'
      }}>
        <span style={{ color: '#fff', fontSize: '20px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '-10px' }}>Nosso</span>
        <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 50px 0' }}>CARDÁPIO</h2>
        
        {/* ... Restante do seu código (Cards, etc) ... */}
      </section>

      <a href="https://wa.me/seunumero" target="_blank" style={whatsappFloat}>
        <MessageCircle size={35} color="#fff" />
      </a>
    </main>
  );
}

const whatsappFloat: React.CSSProperties = { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', padding: '15px', borderRadius: '50%', zIndex: 1000 };
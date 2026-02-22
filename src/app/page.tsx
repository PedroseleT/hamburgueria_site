"use client";

import { Instagram, Facebook, MessageCircle } from 'lucide-react'; // Importando os ícones

export default function Home() {
  return (
    <main style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      width: '100%',
      color: '#fff',
      fontFamily: '"Oswald", sans-serif',
    }}>
      
      {/* 1. SEÇÃO HERO */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/burger-destaque.jpg")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
          }}></div>
        </div>

        <header style={{
          position: 'relative',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '30px 60px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px', lineHeight: '1' }}>
              GARAGE BURGER<br/>
              <span style={{ fontSize: '12px', letterSpacing: '5px' }}>GRILL</span>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: '25px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
            <a href="#cardapio" style={{ textDecoration: 'none', color: '#fff' }}>Cardápio</a>
            <a href="#historia" style={{ textDecoration: 'none', color: '#fff' }}>História</a>
            <a href="#" style={{ textDecoration: 'none', color: '#fff' }}>Promoções</a>
            <a href="#contato" style={{ textDecoration: 'none', color: '#fff' }}>Trabalhe Conosco</a>
          </nav>
        </header>

        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          height: 'calc(100vh - 100px)',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8%'
        }}>
          <div style={{ textAlign: 'right', maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(40px, 7vw, 90px)',
              lineHeight: '0.85',
              fontWeight: '900',
              margin: 0,
              textTransform: 'uppercase',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '-1px'
            }}>
              O BRASIL EM<br />
              CADA MORDIDA
            </h1>
            <p style={{ marginTop: '15px', fontSize: '32px', fontFamily: '"Brush Script MT", cursive', color: '#eee', opacity: 0.9 }}>
              Garage Burger Grill
            </p>
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO CARDÁPIO */}
      <section id="cardapio" style={{ padding: '80px 60px', backgroundColor: '#000', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ fontSize: '50px', fontWeight: '900', textTransform: 'uppercase', borderBottom: '4px solid #fff', display: 'inline-block', marginBottom: '30px' }}>
            NOSSOS BURGERS
          </h2>
          <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '40px', lineHeight: '1.6' }}>
            [ESPAÇO PARA SUA DESCRIÇÃO: Fale sobre a alma da sua hamburgueria, a qualidade da carne e o tempero exclusivo.]
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ border: '1px solid #333', padding: '20px' }}>
              <h3 style={{ textTransform: 'uppercase', color: '#9c845c' }}>Acompanhamentos</h3>
              <p>[Sua lista de batatas e entradas]</p>
            </div>
            <div style={{ border: '1px solid #333', padding: '20px' }}>
              <h3 style={{ textTransform: 'uppercase', color: '#9c845c' }}>Sobremesas</h3>
              <p>[Sua lista de doces e shakes]</p>
            </div>
          </div>
        </div>
        
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            width: '100%', 
            height: '400px', 
            backgroundColor: '#111', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '10px',
            border: '2px dashed #333' 
          }}>
            [ESPAÇO PARA FOTO DO BURGER PRINCIPAL]
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO HISTÓRIA */}
      <section id="historia" style={{ padding: '100px 60px', backgroundColor: '#fff', color: '#000', textAlign: 'center' }}>
        <h2 style={{ fontSize: '45px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>NOSSA HISTÓRIA</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '20px', lineHeight: '1.8' }}>
          <p>
            [CONTE SUA TRAJETÓRIA: Desde a abertura da primeira Garage até o conceito atual de Grill artesanal.]
          </p>
          <button style={{ marginTop: '30px', padding: '15px 40px', backgroundColor: '#9c845c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>
            Saiba Mais
          </button>
        </div>
      </section>

      {/* 4. SEÇÃO CONTATO/FOOTER ATUALIZADA */}
      <section id="contato" style={{ padding: '80px 60px', backgroundColor: '#0a0a0a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>RECEBA NOVIDADES</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <input type="text" placeholder="NOME" style={inputStyle} />
            <input type="email" placeholder="E-MAIL" style={inputStyle} />
            <button style={{ padding: '15px', backgroundColor: '#9c845c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ENVIAR</button>
          </div>
        </div>

        <div style={{ flex: '1', textAlign: 'right', minWidth: '250px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' }}>ENTRE EM CONTATO</h2>
          <p style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>[contato]</p>
          
          {/* ÍCONES DE REDES SOCIAIS */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
              <Instagram size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
              <Facebook size={24} />
            </a>
            <a href="https://wa.me/seunumeroaqui" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
              <MessageCircle size={24} />
            </a>
          </div>

          <div style={{ fontSize: '12px', color: '#444' }}>
            Copyright© 2026 Garage Burger Grill
          </div>
        </div>
      </section>

      <style jsx global>{`
        body { margin: 0; background-color: #0a0a0a; scroll-behavior: smooth; }
        a:hover { opacity: 0.7; transition: 0.3s; }
      `}</style>
    </main>
  );
}

const inputStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #333',
  padding: '15px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none'
};

const socialIconStyle = {
  color: '#fff',
  transition: 'color 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
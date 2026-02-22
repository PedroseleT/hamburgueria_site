"use client";

import { Instagram, Facebook, MessageCircle } from 'lucide-react';

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
      
      {/* 1. SEÇÃO HERO (MANTIDA) */}
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
            <a href="#sobre" style={{ textDecoration: 'none', color: '#fff' }}>Sobre Nós</a>
            <a href="#contato" style={{ textDecoration: 'none', color: '#fff' }}>Contato</a>
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

      {/* 2. SEÇÃO CARDÁPIO (ESTILO IMAGEM 1) */}
      <section id="cardapio" style={{ 
        padding: '80px 20px', 
        backgroundColor: '#0a0a0a', 
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")', // Textura de papel escuro
        textAlign: 'center' 
      }}>
        <p style={{ fontSize: '14px', textTransform: 'lowercase', marginBottom: '5px', color: '#ccc' }}>conheça nosso</p>
        <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 50px 0', textTransform: 'uppercase' }}>CARDÁPIO:</h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          {/* Burger 1 */}
          <div style={cardStyle}>
            <img src="/lenda-da-selva.png" alt="Lenda da Selva" style={imgStyle} />
            <h3 style={titleCardStyle}>LENDA DA SELVA</h3>
            <p style={textCardStyle}>Suculento hambúrguer artesanal de 150g de carne angus, cheddar inglês derretido, anel de cebola enrolado com bacon, creme de cheddar artesanal e cebola crispy no pão de brioche.</p>
            <button style={btnCardStyle}>PEDIR AGORA</button>
          </div>

          {/* Burger 2 */}
          <div style={cardStyle}>
            <img src="/piscininha.png" alt="Piscininha do Caçador" style={imgStyle} />
            <h3 style={titleCardStyle}>PISCININHA DO CAÇADOR</h3>
            <p style={textCardStyle}>Suculento hambúrguer artesanal de 150g de carne angus, cheddar inglês derretido, bacon cubos e maionese verde artesanal no pão de brioche. Finalizado na churrasqueira.</p>
            <button style={btnCardStyle}>PEDIR AGORA</button>
          </div>

          {/* Burger 3 */}
          <div style={cardStyle}>
            <img src="/cacador-queijos.png" alt="Caçador de Queijos" style={imgStyle} />
            <h3 style={titleCardStyle}>CAÇADOR DE QUEIJOS</h3>
            <p style={textCardStyle}>Suculento hambúrguer artesanal de 150g de carne angus, mix de queijos empanado (cheddar, gorgonzola e mussarela), alface americano, tomate e maionese artesanal.</p>
            <button style={btnCardStyle}>PEDIR AGORA</button>
          </div>
        </div>

        <button style={{ 
          marginTop: '50px', 
          padding: '15px 30px', 
          backgroundColor: '#b91c1c', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>VER CARDÁPIO COMPLETO</button>
      </section>

      {/* 3. SEÇÃO SOBRE NÓS (ESTILO IMAGEM 2) */}
      <section id="sobre" style={{ 
        padding: '100px 60px', 
        backgroundColor: '#f5f5dc', // Fundo bege claro
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '60px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          flex: '1', 
          minWidth: '300px', 
          maxWidth: '500px',
          border: '5px solid #333',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '20px 20px 0px #000'
        }}>
          <img src="/burger-sobre.jpg" alt="Sobre Nós" style={{ width: '100%', display: 'block' }} />
        </div>

        <div style={{ flex: '1', minWidth: '300px', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '50px', fontWeight: '900', color: '#b91c1c', marginBottom: '20px' }}>SOBRE NÓS:</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333', marginBottom: '30px' }}>
            Somos uma hamburgueria 100% artesanal, focada em proporcionar a melhor experiência para você. 
            Queremos que passe os seus melhores momentos conosco, sempre acompanhado de suas melhores companhias 
            e desfrutando das nossas delícias. Esqueça aqueles hambúrgueres industrializados e cheios de conservantes, 
            aqui é hambúrguer de verdade, 100% artesanal, no ponto que você preferir.
          </p>
          <p style={{ fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px' }}>LIBERTE SEU INSTINTO</p>
          <button style={{ 
            padding: '12px 25px', 
            backgroundColor: 'transparent', 
            border: '2px solid #b91c1c', 
            color: '#b91c1c', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>LEIA NOSSA DESCRIÇÃO COMPLETA</button>
        </div>
      </section>

      {/* 4. BANNER INTERMEDIÁRIO (ESTILO IMAGEM 3) */}
      <section style={{ 
        height: '200px', 
        backgroundImage: 'url("/banner-fome.jpg")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
        <h2 style={{ position: 'relative', zIndex: 2, fontSize: '40px', fontWeight: '900', color: '#fff' }}>LIBERTE A SUA FOME!</h2>
        <button style={{ 
          position: 'relative', 
          zIndex: 2, 
          marginTop: '15px', 
          padding: '10px 25px', 
          backgroundColor: '#b91c1c', 
          color: '#fff', 
          border: 'none', 
          fontWeight: 'bold',
          borderRadius: '5px'
        }}>FAZER PEDIDO AGORA</button>
      </section>

      {/* FOOTER (MANTIDO) */}
      <footer id="contato" style={{ padding: '60px', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px' }}>
          <Instagram size={30} />
          <Facebook size={30} />
          <MessageCircle size={30} />
        </div>
        <p style={{ fontSize: '12px', opacity: 0.5 }}>© 2026 Garage Burger Grill - Todos os direitos reservados.</p>
      </footer>

    </main>
  );
}

// ESTILOS DOS CARDS (IMAGEM 1)
const cardStyle: React.CSSProperties = {
  backgroundColor: '#111',
  padding: '40px 30px',
  borderRadius: '15px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid #222'
};

const imgStyle: React.CSSProperties = {
  width: '200px',
  height: 'auto',
  marginBottom: '20px'
};

const titleCardStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '900',
  marginBottom: '15px',
  color: '#fff'
};

const textCardStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#aaa',
  marginBottom: '25px',
  flexGrow: 1
};

const btnCardStyle: React.CSSProperties = {
  padding: '10px 30px',
  backgroundColor: 'transparent',
  border: '2px solid #fff',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  borderRadius: '5px'
};
"use client";

import React from 'react';

export default function Sobre() {
  return (
    <main style={{ 
      backgroundColor: '#0a0a0a', 
      minHeight: '100vh', 
      color: '#fff',
      margin: 0,
      padding: 0,
      width: '100%',
      overflowX: 'hidden',
      paddingTop: '80px'
    }}>
      {/* CABEÇALHO */}
      <section style={headerSection}>
        <span style={subtitleStyle}>Conheça nossa</span>
        <h1 style={titleStyle}>HISTÓRIA</h1>
      </section>

      {/* CONTEÚDO COM TEXTO E FOTO */}
      <section style={contentSectionStyle}>
        
        {/* LADO ESQUERDO: TEXTO */}
        <div style={textContainerStyle}>
          <p style={paragraphStyle}>
            A **Pedro Burger Grill** nasceu do desejo de resgatar a essência do churrasco feito na brasa e transformá-la em uma experiência única entre dois pães artesanais. Localizada no coração da cidade, nossa jornada começou com um objetivo simples, mas ambicioso.
          </p>
          <p style={paragraphStyle}>
            Diferente das grandes redes, aqui o tempo corre de outra forma. Respeitamos o ponto da carne, selecionamos cada blend diariamente e utilizamos apenas ingredientes frescos de produtores locais.
          </p>
          <p style={paragraphStyle}>
            Para nós, cada hambúrguer é um compromisso com o seu paladar. Não entregamos apenas comida; entregamos dedicação, suculência e o orgulho de sermos especialistas no que fazemos.
          </p>
        </div>

        {/* LADO DIREITO: ESPAÇO PARA FOTO */}
        <div style={photoPlaceholderStyle}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>
            SUA FOTO AQUI
          </span>
        </div>

      </section>
    </main>
  );
}

// ESTILOS ATUALIZADOS
const headerSection: React.CSSProperties = {
  height: "400px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/banner-fome.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  margin: 0
};

const contentSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap', // Para ficar um embaixo do outro no celular
  gap: '40px',
  padding: '80px 20px',
  maxWidth: '1100px',
  margin: '0 auto',
  alignItems: 'center',
  justifyContent: 'center'
};

const textContainerStyle: React.CSSProperties = {
  flex: '1',
  minWidth: '300px'
};

const photoPlaceholderStyle: React.CSSProperties = {
  flex: '1',
  minWidth: '300px',
  height: '400px',
  backgroundColor: '#1a1a1a', // Cinza escuro
  border: '2px dashed #333', // Borda tracejada para indicar placeholder
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px'
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '20px',
  lineHeight: '1.6',
  color: '#ccc',
  fontFamily: '"Oswald", sans-serif',
  textAlign: 'justify',
  marginBottom: '20px'
};

const subtitleStyle: React.CSSProperties = { 
  color: '#fff', 
  fontSize: '18px', 
  textTransform: 'uppercase', 
  fontWeight: 'bold', 
  letterSpacing: '4px', 
  display: 'block', 
  marginBottom: '5px' 
};

const titleStyle: React.CSSProperties = { 
  fontSize: 'clamp(40px, 8vw, 80px)', 
  fontWeight: '900', 
  color: '#b91c1c', 
  margin: 0,
  textTransform: 'uppercase',
  fontFamily: 'Impact, sans-serif'
};
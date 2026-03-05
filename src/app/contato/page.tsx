"use client";

import React from 'react';

export default function Contato() {
  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#fff', 
      minHeight: '100vh', 
      paddingTop: '80px',
      paddingBottom: '120px' // Espaçamento igual ao do cardápio antes do footer
    }}>
      {/* CABEÇALHO - AGORA IGUAL AO CARDÁPIO */}
      <section style={headerSection}>
        <span style={subtitleStyle}>Fale</span>
        <h1 style={titleStyle}>CONOSCO</h1>
      </section>

      <section style={{ padding: "80px 20px", textAlign: "center", position: 'relative', zIndex: 2 }}>
        <p style={{ color: "#ccc", maxWidth: "600px", margin: "0 auto 40px", fontSize: '18px' }}>
          Quer falar com a gente?
          Envie sua dúvida, sugestão, elogio ou venha fazer parte do nosso time!
        </p>

        <form
          style={{
            maxWidth: "600px",
            marginInline: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <input placeholder="Seu nome" style={inputStyle} />
          <input placeholder="Seu e-mail" style={inputStyle} />
          <textarea placeholder="Sua mensagem..." style={textareaStyle} />
          <button style={btnStyle} className="btn-enviar-hover">ENVIAR</button>
        </form>
      </section>

      <style jsx>{`
        .btn-enviar-hover { transition: all 0.3s ease; }
        .btn-enviar-hover:hover { background-color: #991b1b !important; transform: scale(1.02); }
      `}</style>
    </div>
  );
}

// ESTILOS SINCRONIZADOS COM O CARDÁPIO
const headerSection: React.CSSProperties = {
  height: "300px", 
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

const subtitleStyle: React.CSSProperties = { 
  color: '#fff', 
  fontSize: '14px', 
  textTransform: 'uppercase', 
  letterSpacing: '4px', 
  marginBottom: '10px' 
};

const titleStyle: React.CSSProperties = { 
  fontSize: '70px', 
  fontWeight: '900', 
  color: '#b91c1c', 
  margin: 0, 
  textTransform: 'uppercase', 
  fontFamily: 'Impact, sans-serif' 
};

const inputStyle = { 
  padding: "15px", 
  background: "#111", 
  border: "1px solid #333", 
  color: "#fff", 
  borderRadius: "5px",
  outline: 'none'
};

const textareaStyle = { 
  padding: "15px", 
  height: "150px", 
  background: "#111", 
  border: "1px solid #333", 
  color: "#fff", 
  borderRadius: "5px",
  outline: 'none',
  resize: 'none' as const
};

const btnStyle = { 
  padding: "15px", 
  background: "#b91c1c", 
  border: "none", 
  color: "#fff", 
  fontWeight: "bold" as const, 
  borderRadius: "5px", 
  cursor: "pointer",
  fontSize: '16px',
  letterSpacing: '1px'
};
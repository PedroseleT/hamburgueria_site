"use client";

import React from 'react';

export default function Contato() {
  return (
    <main style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <section style={headerSection}>
        <span style={subtitleStyle}>Fale</span>
        <h1 style={titleStyle}>CONOSCO</h1>
      </section>

      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <p style={{ color: "#ccc", maxWidth: "600px", margin: "0 auto 40px" }}>
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
          <button style={btnStyle}>ENVIAR</button>
        </form>
      </section>
    </main>
  );
}

const headerSection: React.CSSProperties = {
  height: "400px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/banner-fome.jpg')", // Usando o mesmo banner para manter o padrão
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const subtitleStyle: React.CSSProperties = { color: '#fff', fontSize: '18px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '4px', display: 'block', marginBottom: '5px' };
const titleStyle: React.CSSProperties = { fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: '900', color: '#b91c1c', margin: 0, textTransform: 'uppercase', fontFamily: 'Impact, sans-serif' };

const inputStyle = { padding: "15px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "5px" };
const textareaStyle = { padding: "15px", height: "150px", background: "#111", border: "1px solid #333", color: "#fff", borderRadius: "5px" };
const btnStyle = { padding: "15px", background: "#b91c1c", border: "none", color: "#fff", fontWeight: "bold", borderRadius: "5px", cursor: "pointer" };
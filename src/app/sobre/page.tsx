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
      overflowX: 'hidden'
    }}>
      {/* SEÇÃO DE CABEÇALHO COM IMAGEM DE FUNDO */}
      <section style={headerSection}>
        <h1 style={{ 
          fontSize: 'clamp(40px, 8vw, 80px)', 
          fontWeight: '900', 
          color: '#b91c1c', 
          fontFamily: 'Impact, sans-serif',
          margin: 0,
          textTransform: 'uppercase'
        }}>
          SOBRE NÓS
        </h1>
      </section>

      {/* CONTEÚDO DE TEXTO */}
      <section style={{ 
        padding: '80px 20px', 
        maxWidth: '900px', 
        margin: '0 auto', 
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: '30px' }}>
          <span style={{ 
            color: '#fff', 
            fontSize: '18px', 
            textTransform: 'uppercase', 
            letterSpacing: '4px',
            fontWeight: '300'
          }}>
            Nossa História
          </span>
        </div>
        
        <p style={{ 
          fontSize: '22px', 
          lineHeight: '1.8', 
          color: '#ccc',
          fontFamily: '"Oswald", sans-serif',
          textAlign: 'justify'
        }}>
          [descrição]
        </p>
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
  backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/banner-fome.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  margin: 0
};
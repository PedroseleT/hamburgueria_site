"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* COLUNA 1 – MARCA */}
        <div style={styles.column}>
          <h2 style={styles.brandTitle}>
            PEDRO BURGER <span style={{ color: '#b91c1c' }}>GRILL</span>
          </h2>
          <p style={styles.tagline}>"O Brasil em cada mordida."</p>
          <p style={styles.description}>
            Elevando o conceito de hambúrguer artesanal com ingredientes premium e o verdadeiro sabor do fogo.
          </p>
        </div>

        {/* COLUNA 2 – CONTATO */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>Contato</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <MapPin size={18} color="#b91c1c" /> 
              <span>Av. Principal, 1234 - Centro</span>
            </li>
            <li style={styles.listItem}>
              <Phone size={18} color="#b91c1c" /> 
              <span>(11) 99999-9999</span>
            </li>
            <li style={styles.listItem}>
              <Clock size={18} color="#b91c1c" /> 
              <span>Seg à Dom – 18h às 23h</span>
            </li>
          </ul>
        </div>

        {/* COLUNA 3 – LINKS RÁPIDOS */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>Links Rápidos</h3>
          <nav style={styles.list}>
            <Link href="/" style={styles.link}>Início</Link>
            <Link href="/cardapio" style={styles.link}>Cardápio</Link>
            <Link href="/sobre" style={styles.link}>Sobre Nós</Link>
            <Link href="/contato" style={styles.link}>Fale Conosco</Link>
          </nav>
        </div>

        {/* COLUNA 4 – REDES SOCIAIS */}
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>Siga-nos</h3>
          <div style={styles.socialGroup}>
            <a href="#" style={styles.socialBtn} className="social-hover"><Instagram size={20} /></a>
            <a href="#" style={styles.socialBtn} className="social-hover"><Facebook size={20} /></a>
            <a href="#" style={styles.socialBtn} className="social-hover"><Youtube size={20} /></a>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          © 2026 PEDRO BURGER GRILL – Todos os direitos reservados.
        </p>
      </div>

      <style jsx>{`
        .social-hover {
          transition: all 0.3s ease;
          background-color: #111;
          color: white;
        }
        .social-hover:hover {
          background-color: #b91c1c;
          transform: translateY(-3px);
        }
        a:hover {
          color: #b91c1c !important;
        }
      `}</style>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#000',
    borderTop: '1px solid #222',
    padding: '80px 60px 20px 60px',
    color: '#fff',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  brandTitle: {
    fontSize: '1.5rem',
    fontWeight: '900',
    letterSpacing: '1px',
    margin: 0,
  },
  tagline: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
  description: {
    color: '#ccc',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  columnTitle: {
    fontSize: '1.1rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '10px',
    borderLeft: '4px solid #b91c1c',
    paddingLeft: '10px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ccc',
    fontSize: '0.9rem',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: '0.3s',
  },
  socialGroup: {
    display: 'flex',
    gap: '12px',
  },
  socialBtn: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    textDecoration: 'none',
  },
  bottomBar: {
    marginTop: '60px',
    paddingTop: '20px',
    borderTop: '1px solid #222',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '0.75rem',
    color: '#777',
    letterSpacing: '1px',
  },
};

export default Footer;
"use client";

import React from 'react';
import { Instagram, Facebook, Youtube, MapPin, Phone, Clock, CreditCard, Banknote, Landmark, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      
      {/* DIVISOR DE ONDA ANIMADO */}
      <div style={styles.divisorOndaAnimado}>
        <svg 
          viewBox="0 24 150 28" 
          preserveAspectRatio="none" 
          shapeRendering="auto" 
          style={styles.svgOnda}
        >
          <defs>
            <path 
              id="gentle-wave" 
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" 
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(185, 28, 28, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(185, 28, 28, 0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(185, 28, 28, 0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#000000" />
          </g>
        </svg>
      </div>

      <div style={styles.container}>
        <div style={styles.column}>
          <h2 style={styles.brandTitle}>
            PEDRO BURGER <span style={{ color: '#b91c1c' }}>GRILL</span>
          </h2>
          <p style={styles.tagline}>"O Brasil em cada mordida."</p>
          <p style={styles.description}>
            Elevando o conceito de hambúrguer artesanal com ingredientes premium e o verdadeiro sabor do fogo.
          </p>
        </div>

        <div style={styles.column}>
          <h3 style={styles.columnTitle}>Contato</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}><MapPin size={18} color="#b91c1c" /> <span>Av. Principal, 1234 - Centro</span></li>
            <li style={styles.listItem}><Phone size={18} color="#b91c1c" /> <span>(11) 99999-9999</span></li>
            <li style={styles.listItem}><Clock size={18} color="#b91c1c" /> <span>Seg à Dom – 18h às 23h</span></li>
          </ul>
        </div>

        <div style={styles.columnPayment}>
          <h3 style={styles.columnTitle}>FORMAS DE PAGAMENTO</h3>
          <div style={styles.paymentIconsRow}>
            <div style={styles.iconBox}><Smartphone size={24} color="#32bcad" /><span style={styles.miniLabel}>PIX</span></div>
            <div style={styles.iconBox}><CreditCard size={24} color="#ccc" /><span style={styles.miniLabel}>CARTÃO</span></div>
            <div style={styles.iconBox}><Landmark size={24} color="#f59e0b" /><span style={styles.miniLabel}>VR/VA</span></div>
            <div style={styles.iconBox}><Banknote size={24} color="#22c55e" /><span style={styles.miniLabel}>DINHEIRO</span></div>
          </div>
        </div>

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
        <p style={styles.copyright}>© 2026 PEDRO BURGER GRILL – Todos os direitos reservados.</p>
      </div>

      <style jsx>{`
        .social-hover { transition: all 0.3s ease; background-color: #111; color: white; }
        .social-hover:hover { background-color: #b91c1c; transform: translateY(-3px); }
        
        .parallax > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }
        .parallax > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
        .parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
        .parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
        .parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }

        @keyframes move-forever {
          0% { transform: translate3d(-90px,0,0); }
          100% { transform: translate3d(85px,0,0); }
        }

        @media (max-width: 768px) {
          .svgOnda { height: 40px; min-height: 40px; }
          .divisorOndaAnimado { top: -40px; }
        }
      `}</style>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#000',
    color: '#fff',
    width: '100%',
    position: 'relative',
    marginTop: '50px', // Espaço para a onda não bater no botão do cardápio
  },
  divisorOndaAnimado: {
    position: 'absolute',
    top: '-100px', 
    left: 0,
    width: '100%',
    height: '100px',
    zIndex: 10,
    lineHeight: 0,
  },
  svgOnda: {
    width: '100%',
    height: '100px',
    minHeight: '100px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 60px 60px 60px', 
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    position: 'relative',
    zIndex: 11
  },
  column: { display: 'flex', flexDirection: 'column', gap: '15px' },
  columnPayment: { display: 'flex', flexDirection: 'column', gap: '15px' },
  brandTitle: { fontSize: '1.5rem', fontWeight: '900', margin: 0 },
  tagline: { color: '#b91c1c', fontWeight: 'bold', fontSize: '0.9rem' },
  description: { color: '#ccc', fontSize: '0.85rem', lineHeight: '1.6' },
  columnTitle: { fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', borderLeft: '4px solid #b91c1c', paddingLeft: '10px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', fontSize: '0.9rem' },
  paymentIconsRow: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  iconBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  miniLabel: { fontSize: '0.6rem', color: '#666', fontWeight: 'bold' },
  socialGroup: { display: 'flex', gap: '12px' },
  socialBtn: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' },
  bottomBar: { marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #222', textAlign: 'center' },
  copyright: { fontSize: '0.75rem', color: '#777', paddingBottom: '20px' },
};

export default Footer;
import React from 'react';

const Hero = () => {
  return (
    <section style={styles.heroContainer}>
      <div style={styles.overlay} />
      
      <div style={styles.content} className="fade-in-section">
        <h1 style={styles.title}>PEDRO BURGUER GRILL</h1>
        <h2 style={styles.subtitle}>O BRASIL EM CADA MORDIDA</h2>
        <p style={styles.description}>
          Experiência artesanal com fogo de verdade e ingredientes selecionados.
        </p>
        <div style={styles.buttonGroup}>
          <button className="btn-primary" style={styles.mainBtn}>VER CARDÁPIO</button>
          <button style={styles.secondaryBtn}>NOSSA HISTÓRIA</button>
        </div>
      </div>

      {/* Overlay de Chamas Obrigatório */}
      <div className="chamas-overlay" />
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  heroContainer: {
    position: 'relative',
    /* Ocupa a altura total da tela menos os 90px da Navbar */
    height: 'calc(100vh - 90px)', 
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: "url('/burger-destaque.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: '0 20px',
    maxWidth: '900px',
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-2px',
    lineHeight: '1',
    marginBottom: '10px',
    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
  },
  subtitle: {
    fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
    color: '#b91c1c', 
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },
  description: {
    color: '#ccc',
    fontSize: '1.1rem',
    marginBottom: '35px',
    maxWidth: '600px',
    marginInline: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  mainBtn: {
    padding: '18px 40px',
    fontSize: '1.1rem',
    backgroundColor: '#b91c1c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
  },
  secondaryBtn: {
    padding: '18px 40px',
    fontSize: '1.1rem',
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: '0.3s',
    fontWeight: '600',
  }
};

export default Hero;
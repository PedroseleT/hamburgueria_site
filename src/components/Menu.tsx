import React from 'react';

interface Produto {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  imagem: string;
}

const produtos: Produto[] = [
  {
    id: 1,
    nome: "Picanha Burger",
    preco: "R$ 45,00",
    descricao: "Hambúrguer de picanha 200g, queijo coalho grelhado e maionese de ervas.",
    imagem: "/burger-destaque.jpg"
  },
  // Adicione outros produtos conforme necessário
];

const Menu = () => {
  return (
    <section style={styles.menuContainer} className="fade-in-section">
      <h2 style={styles.title}>Nossas Especialidades</h2>
      <div style={styles.grid}>
        {produtos.map((produto) => (
          <div key={produto.id} style={styles.card} className="product-card">
            <div style={{ ...styles.imageWrapper, backgroundImage: `url(${produto.imagem})` }}>
              <div style={styles.priceTag}>{produto.preco}</div>
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.productName}>{produto.nome}</h3>
              <p style={styles.description}>{produto.descricao}</p>
              <button className="btn-primary" style={{ width: '100%', marginTop: '15px' }}>
                PEDIR AGORA
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .product-card {
          transition: transform 0.4s ease, border-color 0.4s ease;
          border: 1px solid var(--border-color);
        }
        .product-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary-red);
        }
      `}</style>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  menuContainer: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '50px',
    textTransform: 'uppercase',
    color: '#fff',
    letterSpacing: '2px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    height: '250px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  priceTag: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'var(--primary-red)',
    padding: '5px 15px',
    fontWeight: 'bold',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  cardContent: {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: '1.4rem',
    marginBottom: '10px',
    color: '#fff',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
};

export default Menu;
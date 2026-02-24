"use client";

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { addToCart } = useCart();
  const router = useRouter();

  const produtos = [
    {
      id: "1",
      nome: "Bacon Handcrafted",
      desc: "Blend bovino 180g, camadas generosas de queijo cheddar derretido e bacon crocante no pão brioche artesanal.",
      preco: 38.90,
      foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg"
    },
    {
      id: "2",
      nome: "Smoky Texas Grill",
      desc: "Hambúrguer grelhado na brasa, bacon rústico, queijo prato e molho especial defumado com toque de ervas.",
      preco: 42.00,
      foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg"
    },
    {
      id: "3",
      nome: "Double Cheddar Board",
      desc: "Dois smash burgers, cheddar duplo, cebola caramelizada e acompanhamento de fritas crocantes na tábua.",
      preco: 45.90,
      foto: "/still-life-delicious-american-hamburger.jpg"
    }
  ];

  // Lógica profissional sem Pop-up
  const handleAddToCart = (p: any) => {
    const isLogged = document.cookie.includes("user_session");

    if (!isLogged) {
      // Se não estiver logado, vai direto para o login sem avisos irritantes
      router.push("/login?callback=/"); 
      return;
    }

    addToCart({ id: p.id, name: p.nome, price: p.preco, image: p.foto });
    // Opcional: Redirecionar para o carrinho após adicionar, ou apenas deixar o ícone atualizar
    router.push("/carrinho");
  };

  return (
    <main className="main-container" style={{
      margin: 0,
      padding: 0,
      paddingTop: '80px',
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      width: '100%',
      color: '#fff',
      fontFamily: '"Oswald", sans-serif',
      position: 'relative'
    }}>

      <div className="flame-overlay"></div>

      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: #0a0a0a;
          scroll-behavior: smooth;
        }

        .flame-overlay {
          position: fixed;
          inset: 0;
          background-image: url("/chamas-overlay.png");
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 1;
        }

        .btn-cardapio-completo {
          display: inline-block;
          padding: 15px 40px;
          background-color: transparent;
          border: 2px solid #b91c1c;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        .btn-cardapio-completo:hover {
          background-color: #b91c1c !important;
          color: #fff !important;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(185, 28, 28, 0.4);
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 85vh !important;
            background-image: url("/design_mobile.jpg") !important; 
            background-position: center top !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
          }

          .hero-content {
            padding: 0 !important;
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
            position: absolute !important;
            bottom: 20px !important; 
            z-index: 100 !important; 
            display: flex !important;
            justify-content: center !important;
          }

          .hero-text {
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .hero-text h1 {
            font-size: 32px !important; 
            line-height: 1.1 !important;
            text-shadow: 2px 2px 10px rgba(0,0,0,0.9) !important;
            margin: 0 auto !important;
            padding: 0 10px !important;
            display: block !important;
            width: 100% !important;
          }

          .hero-text p {
            display: none !important;
          }

          #cardapio {
            padding-top: 80px !important;
          }

          .cardapio-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="hero-section" style={{
        position: 'relative',
        height: '90vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url("/burger-destaque.jpg")', 
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat'
      }}>
        
        <div className="hero-content" style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '8%',
          position: 'relative',
          zIndex: 3
        }}>
          <div className="hero-text" style={{
            textAlign: 'right',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: 'clamp(40px, 7vw, 90px)',
              lineHeight: '0.85',
              fontWeight: '900',
              textTransform: 'uppercase',
              fontFamily: 'Impact, sans-serif',
              textShadow: '3px 3px 15px rgba(0,0,0,0.8)' 
            }}>
              O BRASIL EM<br />
              CADA MORDIDA
            </h1>

            <p style={{
              marginTop: '15px',
              fontSize: '28px',
              fontFamily: '"Brush Script MT", cursive',
              color: '#eee',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
            }}>
              Pedro Burger Grill
            </p>
          </div>
        </div>
      </section>

      {/* ================= SEÇÃO CARDÁPIO ================= */}
      <section id="cardapio" style={{
        padding: '120px 20px 80px',
        backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)), url("/grunge-black-concrete-textured-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        <span style={{ color: '#fff', fontSize: '18px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '5px' }}>Nosso</span>
        <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 60px 0' }}>CARDÁPIO</h2>
        
        <div className="cardapio-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          {produtos.map((p) => (
            <Card 
              key={p.id}
              foto={p.foto} 
              nome={p.nome} 
              desc={p.desc}
              preco={p.preco}
              onAdd={() => handleAddToCart(p)}
            />
          ))}
        </div>

        <div style={{ marginTop: '70px' }}>
          <Link href="/cardapio" className="btn-cardapio-completo">
            VER CARDÁPIO COMPLETO
          </Link>
        </div>
      </section>

      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={whatsappFloat}>
        <MessageCircle size={35} color="#fff" />
      </a>
    </main>
  );
}

function Card({ foto, nome, desc, preco, onAdd }: any) {
  return (
    <div style={{
      backgroundColor: 'rgba(17, 17, 17, 0.95)',
      padding: '40px 30px',
      borderRadius: '15px',
      textAlign: 'center',
      border: '1px solid #333',
      transition: '0.3s'
    }}>
      <div style={{ width: '100%', height: '220px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '10px' }}>
        <img 
            src={foto} 
            alt={nome} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300/333/999?text=SEM+FOTO"; }} 
        />
      </div>
      
      <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase', color: '#fff' }}>{nome}</h3>
      <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px', lineHeight: '1.6', minHeight: '45px' }}>{desc}</p>
      
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '20px' }}>
        R$ {preco.toFixed(2).replace('.', ',')}
      </div>

      <button 
        onClick={onAdd}
        style={{
          padding: '12px 25px',
          backgroundColor: 'transparent',
          border: '2px solid #b91c1c',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
          transition: '0.3s',
          width: '100%',
          borderRadius: '5px'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        PEDIR AGORA
      </button>
    </div>
  );
}

const whatsappFloat: React.CSSProperties = { 
    position: 'fixed', 
    bottom: '30px', 
    right: '30px', 
    backgroundColor: '#25d366', 
    padding: '15px', 
    borderRadius: '50%', 
    zIndex: 1000,
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
};
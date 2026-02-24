"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importado para o redirecionamento

export default function CardapioCompleto() {
  const { addToCart } = useCart();
  const router = useRouter(); // Instanciando o roteador
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const produtos = [
    { id: "1", nome: "Bacon Handcrafted", desc: "Blend bovino 180g, queijo cheddar e bacon crocante.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "2", nome: "Smoky Texas Grill", desc: "Hambúrguer na brasa, bacon rústico e molho especial.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "3", nome: "Double Cheddar Board", desc: "Dois smash burgers, cheddar duplo e fritas.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" }
  ];

  const handleAdd = (p: any) => {
    // Verifica se o cookie de sessão existe
    const isLogged = document.cookie.includes("user_session");

    if (!isLogged) {
      // Redireciona para o login caso não esteja logado
      router.push("/login");
      return;
    }

    addToCart({ id: p.id, name: p.nome, price: p.preco, image: p.foto });
    setLastAdded(p.id);
    setTimeout(() => setLastAdded(null), 1000);
  };

  const handleViewCart = (e: React.MouseEvent) => {
    const isLogged = document.cookie.includes("user_session");
    
    if (!isLogged) {
      e.preventDefault(); // Impede a navegação do Link
      router.push("/login");
    }
  };

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", paddingBottom: "100px" }}>
      <section style={headerSection}>
        <span style={subtitleStyle}>Nosso</span>
        <h1 style={titleStyle}>CARDÁPIO</h1>
      </section>
      
      <div style={{ padding: "40px 20px" }}>
        <div className="menu-grid">
          {produtos.map((p) => (
            <div key={p.id} style={cardStyle}>
              <div style={{ overflow: 'hidden', borderRadius: '8px', height: '180px' }}>
                <img src={p.foto} alt={p.nome} style={imgStyle} />
              </div>
              <h3 style={{ marginTop: "15px", textTransform: 'uppercase', fontWeight: '900' }}>{p.nome}</h3>
              <p style={{ color: "#ccc", fontSize: "14px", height: "50px" }}>{p.desc}</p>
              <div style={{ color: "#b91c1c", fontWeight: "bold", fontSize: "24px", margin: "15px 0" }}>
                R$ {p.preco.toFixed(2).replace(".", ",")}
              </div>
              <button 
                onClick={() => handleAdd(p)} 
                style={{ 
                  ...btnStyle, 
                  backgroundColor: lastAdded === p.id ? "#22c55e" : "transparent", 
                  borderColor: lastAdded === p.id ? "#22c55e" : "#b91c1c",
                  transition: "0.3s"
                }}
              >
                {lastAdded === p.id ? "✔ ADICIONADO" : "ADICIONAR"}
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "60px" }}>
          {/* Validação também no botão de ver carrinho */}
          <Link 
            href="/carrinho" 
            onClick={handleViewCart}
            className="btn-finalizar"
          >
            VER MEU CARRINHO →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .btn-finalizar {
          display: inline-block; padding: 20px 40px; background-color: #b91c1c; color: #fff;
          font-weight: bold; text-decoration: none; text-transform: uppercase; border-radius: 5px;
          transition: 0.3s;
        }
        .btn-finalizar:hover {
          background-color: #991b1b;
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
           .menu-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

const headerSection: React.CSSProperties = { height: "350px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/banner-fome.jpg')", backgroundSize: "cover", backgroundPosition: "center" };
const subtitleStyle: React.CSSProperties = { color: '#fff', fontSize: '16px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '4px' };
const titleStyle: React.CSSProperties = { fontSize: 'clamp(40px, 10vw, 70px)', fontWeight: '900', color: '#b91c1c', fontFamily: 'Impact' };
const cardStyle: React.CSSProperties = { background: "rgba(17, 17, 17, 0.8)", padding: "20px", borderRadius: "10px", border: "1px solid #333", textAlign: "center" };
const imgStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
const btnStyle: React.CSSProperties = { width: "100%", padding: "12px", color: "#fff", border: "2px solid #b91c1c", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
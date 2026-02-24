"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();

  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const session = document.cookie.includes("user_session");
    setIsLogged(session);
  }, [pathname]);

  // Fecha o menu ao mudar de página
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LADO ESQUERDO: LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo_hamburgueria.png" 
            alt="Pedro Burger Grill" 
            style={{ height: "65px", width: "auto", cursor: "pointer" }} 
          />
        </Link>

        {/* LADO DIREITO: CARRINHO + MENU (MOBILE) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* ÍCONE DO CARRINHO - SEMPRE VISÍVEL NO MOBILE AO LADO DO MENU */}
          <div className="mobile-cart-visible">
            <Link href="/carrinho" style={{ color: "#fff", position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={30} />
              {totalItens > 0 && <span style={badgeStyle}>{totalItens}</span>}
            </Link>
          </div>

          {/* BOTÃO TRÊS PONTINHOS */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            style={menuButtonStyle} 
            className="mobile-btn"
          >
            {isOpen ? <X size={35} color="#b91c1c" /> : <Menu size={35} color="#fff" />}
          </button>
        </div>

        {/* MENU QUE ABRE/FECHA */}
        <div style={{ ...navLinksContainerStyle, display: isOpen ? "flex" : "none" }} className="nav-menu">
          <div style={linksGroupStyle} className="links-group">
            <Link href="/" style={linkStyle(pathname === "/")}>INÍCIO</Link>
            <Link href="/cardapio" style={linkStyle(pathname === "/cardapio")}>CARDÁPIO</Link>
            <Link href="/sobre" style={linkStyle(pathname === "/sobre")}>SOBRE NÓS</Link>
            <Link href="/contato" style={linkStyle(pathname === "/contato")}>FALE CONOSCO</Link>
          </div>

          <div style={actionGroupStyle} className="action-group">
            <Link href={isLogged ? "/perfil" : "/login"} style={{ color: "#fff", display: 'flex', alignItems: 'center' }}>
              <User size={28} style={{ color: isLogged ? "#b91c1c" : "#fff" }} />
              <span className="mobile-label">MINHA CONTA</span>
            </Link>
            
            {/* Carrinho dentro do menu Desktop */}
            <Link href="/carrinho" className="desktop-cart-only" style={{ color: "#fff", position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={28} />
              {totalItens > 0 && <span style={badgeStyle}>{totalItens}</span>}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* MOBILE FIRST ADJUSTMENTS */
        .mobile-cart-visible { display: flex; }
        .desktop-cart-only { display: none; }
        .mobile-label { display: none; }

        @media (max-width: 991px) {
          .nav-menu {
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background: #000; flex-direction: column !important; 
            justify-content: center !important; align-items: center !important;
            gap: 40px !important; z-index: 999;
          }
          .links-group { flex-direction: column; gap: 20px; align-items: center; }
          .action-group { border: none !important; padding: 0 !important; flex-direction: column; gap: 20px; }
          .mobile-label { display: inline; margin-left: 10px; font-weight: bold; font-size: 18px; }
          .mobile-btn { z-index: 1001; position: relative; }
        }

        /* DESKTOP ADJUSTMENTS */
        @media (min-width: 992px) {
          .nav-menu { display: flex !important; }
          .mobile-btn, .mobile-cart-visible { display: none !important; }
          .desktop-cart-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

const navStyle: React.CSSProperties = {
  width: "100%", height: "90px", backgroundColor: "#000", display: "flex", 
  justifyContent: "center", position: "fixed", zIndex: 1000, top: 0, left: 0,
  borderBottom: "1px solid #1a1a1a"
};

const containerStyle: React.CSSProperties = {
  width: "100%", maxWidth: "1300px", display: "flex", justifyContent: "space-between", 
  alignItems: "center", padding: "0 20px"
};

const navLinksContainerStyle: React.CSSProperties = { alignItems: "center", gap: "40px" };
const linksGroupStyle: React.CSSProperties = { display: "flex", gap: "5px" };
const menuButtonStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center' };

const linkStyle = (active: boolean): React.CSSProperties => ({
  color: active ? "#b91c1c" : "#fff",
  textDecoration: "none",
  fontSize: "16px",
  textTransform: "uppercase",
  padding: "10px 15px",
  fontWeight: "900",
  letterSpacing: "1.5px"
});

const actionGroupStyle: React.CSSProperties = {
  display: "flex", gap: "30px", borderLeft: "2px solid #1a1a1a", paddingLeft: "30px", alignItems: 'center'
};

const badgeStyle: React.CSSProperties = {
  position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#b91c1c',
  color: '#fff', borderRadius: '50%', width: '20px', height: '20px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold'
};
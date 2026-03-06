"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();

  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const session = document.cookie.includes("user_session");
    setIsLogged(session);

    // Lê o role do cookie user_session
    try {
      const match = document.cookie.match(/user_session=([^;]+)/);
      if (match) {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setIsAdmin(data.role === "ADMIN" || data.role === "ATTENDANT");
      }
    } catch {
      setIsAdmin(false);
    }
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo_hamburgueria.png" alt="Pedro Burger Grill" style={{ height: "65px", width: "auto", cursor: "pointer" }} />
        </Link>

        {/* MOBILE: carrinho + botão menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="mobile-cart-visible">
            <Link href="/carrinho" style={{ color: "#fff", position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={30} />
              {totalItens > 0 && <span style={badgeStyle}>{totalItens}</span>}
            </Link>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} style={menuButtonStyle} className="mobile-btn">
            {isOpen ? <X size={35} color="#b91c1c" /> : <Menu size={35} color="#fff" />}
          </button>
        </div>

        {/* MENU */}
        <div style={{ ...navLinksContainerStyle, display: isOpen ? "flex" : "none" }} className="nav-menu">
          <div style={linksGroupStyle} className="links-group">
            <Link href="/"          style={linkStyle(pathname === "/")}>INÍCIO</Link>
            <Link href="/cardapio"  style={linkStyle(pathname === "/cardapio")}>CARDÁPIO</Link>
            <Link href="/sobre"     style={linkStyle(pathname === "/sobre")}>SOBRE NÓS</Link>
            <Link href="/contato"   style={linkStyle(pathname === "/contato")}>FALE CONOSCO</Link>
            <Link href="/my-orders" style={linkStyle(pathname === "/my-orders")}>MEUS PEDIDOS</Link>
          </div>

          <div style={actionGroupStyle} className="action-group">

            {/* Link admin — só aparece para ADMIN/ATTENDANT */}
            {isAdmin && (
              <Link
                href="/admin"
                title="Painel Admin"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: pathname === "/admin" ? "#b91c1c" : "#555",
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")}
                onMouseLeave={e => (e.currentTarget.style.color = pathname === "/admin" ? "#b91c1c" : "#555")}
              >
                <LayoutDashboard size={20} />
                <span className="mobile-label" style={{ fontSize: 18, fontWeight: 'bold' }}>PAINEL ADMIN</span>
              </Link>
            )}

            <Link href={isLogged ? "/perfil" : "/login"} style={{ color: "#fff", display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <User size={28} style={{ color: isLogged ? "#b91c1c" : "#fff" }} />
              <span className="mobile-label">MINHA CONTA</span>
            </Link>

            <Link href="/carrinho" className="desktop-cart-only" style={{ color: "#fff", position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={28} />
              {totalItens > 0 && <span style={badgeStyle}>{totalItens}</span>}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          .mobile-label { display: inline; margin-left: 10px; }
          .mobile-btn { z-index: 1001; position: relative; }
        }

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
  width: "100%", maxWidth: "100%", display: "flex", justifyContent: "space-between",
  alignItems: "center", padding: "0 40px"
};
const navLinksContainerStyle: React.CSSProperties = { alignItems: "center", gap: "30px" };
const linksGroupStyle: React.CSSProperties = { display: "flex", gap: "2px" };
const menuButtonStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center' };
const actionGroupStyle: React.CSSProperties = {
  display: "flex", gap: "25px", borderLeft: "2px solid #1a1a1a", paddingLeft: "25px", alignItems: 'center'
};
const linkStyle = (active: boolean): React.CSSProperties => ({
  color: active ? "#b91c1c" : "#fff", textDecoration: "none", fontSize: "14px",
  textTransform: "uppercase", padding: "10px 10px", fontWeight: "900", letterSpacing: "1px"
});
const badgeStyle: React.CSSProperties = {
  position: 'absolute', top: '-8px', right: '-12px', backgroundColor: '#b91c1c',
  color: '#fff', borderRadius: '50%', width: '20px', height: '20px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold'
};
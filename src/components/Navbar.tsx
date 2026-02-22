"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, MessageCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav style={navStyle}>
      <div style={containerStyle} className="nav-container">
        {/* LOGO */}
        <Link href="/">
          <img 
            src="/logo_hamburgueria.png" 
            alt="Logo" 
            style={{ height: "50px", width: "auto", cursor: "pointer" }} 
          />
        </Link>

        {/* BOTÃO HAMBÚRGUER - Agora posicionado logo após a logo no mobile */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={menuButtonStyle}
          className="mobile-menu-btn"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* LINKS + SOCIAIS */}
        <div style={{ 
          ...navLinksContainerStyle, 
          display: isOpen ? "flex" : "none" 
        }} className="nav-menu">
          <div style={linksGroupStyle}>
            <Link href="/" onClick={() => setIsOpen(false)} style={{ ...linkStyle, backgroundColor: isActive("/") ? "#b91c1c" : "transparent" }}>Início</Link>
            <Link href="/cardapio" onClick={() => setIsOpen(false)} style={{ ...linkStyle, backgroundColor: isActive("/cardapio") ? "#b91c1c" : "transparent" }}>Cardápio</Link>
            <Link href="/sobre" onClick={() => setIsOpen(false)} style={{ ...linkStyle, backgroundColor: isActive("/sobre") ? "#b91c1c" : "transparent" }}>Sobre Nós</Link>
            <Link href="/contato" onClick={() => setIsOpen(false)} style={{ ...linkStyle, backgroundColor: isActive("/contato") ? "#b91c1c" : "transparent" }}>Fale Conosco</Link>
          </div>

          <div style={socialGroupStyle}>
            <a href="#" style={{ color: "#fff" }}><Facebook size={18} /></a>
            <a href="#" style={{ color: "#fff" }}><Instagram size={18} /></a>
            <a href="#" style={{ color: "#fff" }}><MessageCircle size={18} /></a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 769px) {
          .nav-menu {
            display: flex !important;
            flex-direction: row !important;
            position: static !important;
            background: transparent !important;
            width: auto !important;
            height: auto !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .nav-container {
            justify-content: flex-start !important; /* Traz tudo para a esquerda */
            gap: 15px !important; /* Espaço pequeno entre a logo e o botão */
          }
          .nav-menu {
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background: #000;
            flex-direction: column;
            padding: 20px;
            gap: 20px;
            border-bottom: 2px solid #b91c1c;
          }
          .mobile-menu-btn {
            display: block !important;
            order: 2; /* Garante que fique depois da logo */
          }
        }
      `}</style>
    </nav>
  );
}

const navStyle: React.CSSProperties = {
  width: "100%",
  height: "80px",
  backgroundColor: "#000",
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  zIndex: 1000,
  top: 0,
  left: 0,
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "1250px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px"
};

const navLinksContainerStyle: React.CSSProperties = {
  alignItems: "center",
  gap: "30px",
};

const linksGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center"
};

const menuButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  padding: "5px",
  zIndex: 1100,
};

const linkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "12px",
  textTransform: "uppercase",
  padding: "8px 12px",
  borderRadius: "4px",
  fontWeight: "bold",
  transition: "0.3s"
};

const socialGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "15px",
  borderLeft: "1px solid #333",
  paddingLeft: "20px"
};
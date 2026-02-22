"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LOGO */}
        <Link href="/">
          <img 
            src="/logo_hamburgueria.png" 
            alt="Logo" 
            style={{ height: "60px", width: "auto", cursor: "pointer" }} 
          />
        </Link>

        {/* LINKS + SOCIAIS */}
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/" style={{ ...linkStyle, backgroundColor: isActive("/") ? "#b91c1c" : "transparent" }}>Início</Link>
            <Link href="/cardapio" style={{ ...linkStyle, backgroundColor: isActive("/cardapio") ? "#b91c1c" : "transparent" }}>Cardápio</Link>
            <Link href="/sobre" style={{ ...linkStyle, backgroundColor: isActive("/sobre") ? "#b91c1c" : "transparent" }}>Sobre Nós</Link>
            <Link href="/contato" style={{ ...linkStyle, backgroundColor: isActive("/contato") ? "#b91c1c" : "transparent" }}>Fale Conosco</Link>
          </div>

          <div style={socialGroupStyle}>
            <a href="#" style={{ color: "#fff" }}><Facebook size={18} /></a>
            <a href="#" style={{ color: "#fff" }}><Instagram size={18} /></a>
            <a href="#" style={{ color: "#fff" }}><MessageCircle size={18} /></a>
          </div>
        </div>
      </div>
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
  left: 0, // ADICIONADO: Garante alinhamento à esquerda
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "1250px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 40px"
};

const linkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "13px",
  textTransform: "uppercase",
  padding: "10px 18px",
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
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingCart, MoreVertical, User, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function BottomNavMobile() {
  const pathname = usePathname();
  const { cart } = useCart();
  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const match = document.cookie.match(/user_session=([^;]+)/);
      if (match) {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setIsAdmin(data.role === "ADMIN" || data.role === "ATTENDANT");
      }
    } catch { setIsAdmin(false); }
  }, []);

  useEffect(() => { setShowMenu(false); }, [pathname]);

  // ALTERAÇÃO SOLICITADA: Avisa os outros componentes se o menu foi aberto/fechado
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("toggleMenuMobile", { detail: showMenu }));
  }, [showMenu]);

  return (
    <>
      <style>{`
        .bottom-nav-mobile { display: flex; }
        @media (min-width: 992px) { .bottom-nav-mobile { display: none !important; } }
      `}</style>

      <nav className="bottom-nav-mobile" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9970,
        background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
        alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "calc(60px + env(safe-area-inset-bottom))",
      }}>

        {/* Início */}
        <Link href="/" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, textDecoration: "none", color: pathname === "/" ? "#b91c1c" : "#555", borderTop: pathname === "/" ? "2px solid #b91c1c" : "2px solid transparent", transition: "color 0.2s" }}>
          <span style={{ filter: pathname === "/" ? "drop-shadow(0 0 6px #b91c1c88)" : "none" }}><Home size={22} /></span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>INÍCIO</span>
        </Link>

        {/* Cardápio */}
        <Link href="/cardapio" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, textDecoration: "none", color: pathname === "/cardapio" ? "#b91c1c" : "#555", borderTop: pathname === "/cardapio" ? "2px solid #b91c1c" : "2px solid transparent", transition: "color 0.2s" }}>
          <span style={{ filter: pathname === "/cardapio" ? "drop-shadow(0 0 6px #b91c1c88)" : "none" }}><UtensilsCrossed size={22} /></span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>CARDÁPIO</span>
        </Link>

        {/* Carrinho */}
        <Link href="/carrinho" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, textDecoration: "none", color: pathname === "/carrinho" ? "#b91c1c" : "#555", borderTop: pathname === "/carrinho" ? "2px solid #b91c1c" : "2px solid transparent", transition: "color 0.2s" }}>
          <span style={{ position: "relative", display: "inline-flex", filter: pathname === "/carrinho" ? "drop-shadow(0 0 6px #b91c1c88)" : "none" }}>
            <ShoppingCart size={22} />
            {totalItens > 0 && <span style={{ position: "absolute", top: -4, right: -6, background: "#b91c1c", color: "#fff", fontSize: 8, fontWeight: 900, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{totalItens}</span>}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>CARRINHO</span>
        </Link>

        {/* Separador */}
        <div style={{ width: 1, background: "#2a2a2a", margin: "12px 0" }} />

        {/* Perfil */}
        <Link href="/perfil" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, textDecoration: "none", color: pathname === "/perfil" ? "#b91c1c" : "#555", borderTop: pathname === "/perfil" ? "2px solid #b91c1c" : "2px solid transparent", transition: "color 0.2s" }}>
          <span style={{ filter: pathname === "/perfil" ? "drop-shadow(0 0 6px #b91c1c88)" : "none" }}><User size={22} /></span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>PERFIL</span>
        </Link>

        {/* Mais (dropdown) */}
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: showMenu ? "#b91c1c" : "#555", borderTop: showMenu ? "2px solid #b91c1c" : "2px solid transparent", width: "100%", height: "100%", justifyContent: "center", transition: "color 0.2s" }}>
            <MoreVertical size={22} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>MAIS</span>
          </button>

          {showMenu && (
            <>
              <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 9968 }} />
              {/* ALTERAÇÃO SOLICITADA: Ajustei a posição right para não vazar a tela e alterei os links */}
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 10, background: "#111", border: "1px solid #262626", borderRadius: 12, overflow: "hidden", minWidth: 160, zIndex: 9969, boxShadow: "0 -8px 30px rgba(0,0,0,0.6)" }}>
                <Link href="/my-orders" onClick={() => setShowMenu(false)} style={{ display: "block", padding: "13px 16px", color: pathname === "/my-orders" ? "#b91c1c" : "#ccc", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #1a1a1a", background: pathname === "/my-orders" ? "#b91c1c12" : "none" }}>
                  Meus Pedidos
                </Link>
                <Link href="/sobre" onClick={() => setShowMenu(false)} style={{ display: "block", padding: "13px 16px", color: pathname === "/sobre" ? "#b91c1c" : "#ccc", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #1a1a1a", background: pathname === "/sobre" ? "#b91c1c12" : "none" }}>
                  Sobre Nós
                </Link>
                <Link href="/contato" onClick={() => setShowMenu(false)} style={{ display: "block", padding: "13px 16px", color: pathname === "/contato" ? "#b91c1c" : "#ccc", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #1a1a1a", background: pathname === "/contato" ? "#b91c1c12" : "none" }}>
                  Fale Conosco
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setShowMenu(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", color: pathname === "/admin" ? "#b91c1c" : "#ccc", fontSize: 13, fontWeight: 600, textDecoration: "none", background: pathname === "/admin" ? "#b91c1c12" : "none" }}>
                    <LayoutDashboard size={14} />
                    Painel Admin
                  </Link>
                )}
              </div>
            </>
          )}
        </div>

      </nav>
    </>
  );
}
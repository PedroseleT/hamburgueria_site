"use client";

import { Home, ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

// ALTERAÇÃO SOLICITADA: Componente extraído para o layout global
export default function BottomNavMobile() {
  const pathname = usePathname();
  const { cart } = useCart();
  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

  const items = [
    { href: "/",          label: "Início",  icon: Home         },
    { href: "/my-orders", label: "Pedidos", icon: ClipboardList },
    { href: "/perfil",    label: "Perfil",  icon: User         },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9990,
      background: "rgba(8,8,8,0.97)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid #1a1a1a",
      display: "flex",
      paddingBottom: "env(safe-area-inset-bottom)",
      boxShadow: "0 -1px 0 #1a1a1a, 0 -20px 60px rgba(0,0,0,0.8)",
    }}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 3, padding: "12px 0",
            textDecoration: "none",
            color: active ? "#b91c1c" : "#3a3a3a",
            fontSize: 9, fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase",
            fontFamily: "sans-serif", position: "relative",
            transition: "color 0.2s",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: 20, height: 2, background: "#b91c1c",
                borderRadius: "0 0 3px 3px", boxShadow: "0 0 12px #b91c1c",
              }} />
            )}
            <div style={{ position: "relative" }}>
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ filter: active ? "drop-shadow(0 0 8px #b91c1c66)" : "none", transition: "all 0.2s" }}
              />
              {href === "/" && totalItens > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -7,
                  background: "#b91c1c", color: "#fff",
                  fontSize: 8, fontWeight: 900, width: 14, height: 14,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 8px #b91c1c66",
                }}>{totalItens}</span>
              )}
            </div>
            <span style={{ opacity: active ? 1 : 0.5 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
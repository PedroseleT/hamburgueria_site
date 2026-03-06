"use client";

import React, { useState } from "react";
// ALTERAÇÃO SOLICITADA: Adicionado MapPin, Gift, ChevronDown, Search para o novo layout
import { X, Plus, Minus, Home, ClipboardList, User, ShoppingCart, ChevronRight, Flame, Star, MapPin, Gift, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";

// ── Bottom Navbar ─────────────────────────────────────────────────────────────
function BottomNav() {
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
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} style={{ filter: active ? "drop-shadow(0 0 8px #b91c1c66)" : "none", transition: "all 0.2s" }} />
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

// ── Featured Card ─────────────────────────────────────────────────────────────
function FeaturedCard({ foto, nome, desc, preco, onAdd }: any) {
  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 200, cursor: "pointer", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} onClick={onAdd}>
      <img src={foto} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.85) 100%)" }} />
      <div style={{
        position: "absolute", top: 14, left: 14,
        background: "#b91c1c", color: "#fff",
        fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase",
        padding: "4px 10px", borderRadius: 20,
        display: "flex", alignItems: "center", gap: 4,
        boxShadow: "0 4px 14px #b91c1c55",
      }}>
        <Flame size={9} /> DESTAQUE
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", fontFamily: "Impact, sans-serif", color: "#fff", margin: "0 0 4px", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{nome}</h3>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 900, fontStyle: "italic" }}>R$ {preco.toFixed(2).replace(".", ",")}</span>
          <div style={{ background: "#b91c1c", color: "#fff", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px #b91c1c55" }}>
            <Plus size={18} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card compacto ─────────────────────────────────────────────────────────────
function MobileCard({ foto, nome, desc, preco, onAdd }: any) {
  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #181818", borderRadius: 14, overflow: "hidden", display: "flex", alignItems: "stretch" }}>
      <div style={{ width: 110, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <img src={foto} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 60%, #0d0d0d)" }} />
      </div>
      <div style={{ flex: 1, padding: "14px 14px 14px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 110 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "#e0e0e0", margin: "0 0 5px", lineHeight: 1.2 }}>{nome}</h3>
          <p style={{ fontSize: 11, color: "#3a3a3a", lineHeight: 1.45, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div>
            <span style={{ color: "#2a2a2a", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: 1 }}>A PARTIR DE</span>
            <span style={{ color: "#b91c1c", fontSize: 17, fontWeight: 900, fontStyle: "italic" }}>R$ {preco.toFixed(2).replace(".", ",")}</span>
          </div>
          <button onClick={onAdd} style={{ background: "transparent", border: "1.5px solid #b91c1c", color: "#b91c1c", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Plus size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function HomeMobile() {
  const { addToCart, cart } = useCart();
  const router = useRouter();
  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const produtos = [
    { id: "cmmctdp4l0001nsgzj9x6zi5y", nome: "Bacon Handcrafted", desc: "Blend bovino 180g, camadas generosas de queijo cheddar derretido e bacon crocante no pão brioche artesanal.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "cmmcqmzlf0000nsgza56yn8g1", nome: "Smoky Texas Grill", desc: "Hambúrguer grelhado na brasa, bacon rústico, queijo prato e molho especial defumado com toque de ervas.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "cmmcte9zh0002nsgzqh3hoffv", nome: "Double Cheddar Board", desc: "Dois smash burgers, cheddar duplo, cebola caramelizada e acompanhamento de fritas crocantes na tábua.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" },
  ];

  const molhosGratis = [{ nome: "Ketchup", preco: 0 }, { nome: "Mostarda", preco: 0 }, { nome: "Maionese Tradicional", preco: 0 }];
  const molhosCasa   = [{ nome: "Maionese Artesanal 30ml", preco: 3.50 }, { nome: "Barbecue Defumado 30ml", preco: 4.00 }, { nome: "Chipotle Picante 30ml", preco: 4.50 }];
  const complementos = [{ nome: "Hambúrguer Extra 180g", preco: 12.00 }, { nome: "Bacon em Tiras", preco: 6.00 }, { nome: "Queijo Cheddar", preco: 5.00 }, { nome: "Salada Fresca", preco: 3.00 }];

  const handleOpenModal = (p: any) => {
    const isLogged = document.cookie.includes("user_session");
    if (!isLogged) { router.push("/login?callback=/"); return; }
    setSelectedProduct(p); setQuantity(1); setCustomOptions([]); setObservacao("");
  };

  const updateOptionQtd = (item: any, delta: number, limit: number, sectionItems: any[]) => {
    const currentInSection = customOptions.filter(opt => sectionItems.some(s => s.nome === opt.nome));
    const totalInSection = currentInSection.reduce((acc, curr) => acc + curr.qtd, 0);
    const existingIndex = customOptions.findIndex(opt => opt.nome === item.nome);
    if (delta > 0 && totalInSection >= limit) return;
    let newOptions = [...customOptions];
    if (existingIndex > -1) {
      const newQtd = newOptions[existingIndex].qtd + delta;
      if (newQtd <= 0) newOptions.splice(existingIndex, 1);
      else newOptions[existingIndex].qtd = newQtd;
    } else if (delta > 0) { newOptions.push({ ...item, qtd: 1 }); }
    setCustomOptions(newOptions);
  };

  const getQtd = (nome: string) => customOptions.find(o => o.nome === nome)?.qtd || 0;
  const extraTotal = customOptions.reduce((a, c) => a + (c.preco * c.qtd), 0);

  const handleConfirmAdd = () => {
    addToCart({
      id: `${selectedProduct.id}-${Date.now()}`, productId: selectedProduct.id,
      name: selectedProduct.nome, price: selectedProduct.preco + extraTotal,
      image: selectedProduct.foto, quantity,
      customization: { extras: customOptions.map(o => `${o.qtd}x ${o.nome}`), obs: observacao },
    });
    setSelectedProduct(null);
    router.push("/carrinho");
  };

  const [featured, ...rest] = produtos;

  return (
    <>
      <style>{`
        @keyframes mSlideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes mSheetUp { from{transform:translateY(100%);} to{transform:translateY(0);} }
        @keyframes mGlow    { 0%,100%{text-shadow:0 0 30px #b91c1c55;} 50%{text-shadow:0 0 60px #b91c1c99,0 0 100px #b91c1c33;} }
        @keyframes mFadeIn  { from{opacity:0;} to{opacity:1;} }
        .m-card   { animation: mSlideUp 0.35s ease both; }
        .m-sheet  { animation: mSheetUp 0.32s cubic-bezier(0.32,0.72,0,1) both; }
        .m-overlay{ animation: mFadeIn 0.2s ease both; }
        .m-scrollbar { scrollbar-width: thin; scrollbar-color: #b91c1c #0a0a0a; }
        .m-scrollbar::-webkit-scrollbar { width: 3px; }
        .m-scrollbar::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 2px; }
        .m-pedir-btn:active { transform: scale(0.97); background: #991b1b !important; }
        
        /* ALTERAÇÃO SOLICITADA: Classe para esconder scrollbar do carrossel */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main style={{ backgroundColor: "#080808", minHeight: "100svh", color: "#fff", fontFamily: "sans-serif", paddingBottom: "calc(72px + env(safe-area-inset-bottom))", overflowX: "hidden" }}>

        {/* ALTERAÇÃO SOLICITADA: Novo cabeçalho com banner e logo sobreposto */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", height: 192, position: "relative", backgroundColor: "#1a1a1a" }}>
            <img src="/design_mobile.jpg" alt="Banner The Flame Grill" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
            
            {/* Ícone do carrinho flutuante sobre o banner */}
            <Link href="/carrinho" style={{ position: "absolute", top: 20, right: 20, color: "#fff", textDecoration: "none", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", zIndex: 10 }}>
              <ShoppingCart size={18} />
              {totalItens > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, background: "#b91c1c", color: "#fff", fontSize: 8, fontWeight: 900, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 8px #b91c1c" }}>{totalItens}</span>
              )}
            </Link>
          </div>
          
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -48, zIndex: 5 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", border: "4px solid #080808", overflow: "hidden", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/logo_hamburgueria.png" alt="Logo The Flame Grill" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* ALTERAÇÃO SOLICITADA: Informações do restaurante e status */}
        <div style={{ padding: "0 16px", marginTop: 64, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>The Flame Grill</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, color: "#a3a3a3", fontSize: 14 }}>
            <MapPin size={16} />
            <span>Campinas - SP • Mais informações</span>
          </div>
          <p style={{ color: "#ef4444", fontWeight: 500, fontSize: 14, marginTop: 8, marginBottom: 0 }}>
            Fechado • Abrimos amanhã às 18h30
          </p>
        </div>

        {/* ALTERAÇÃO SOLICITADA: Botões de taxa e fidelidade */}
        <div style={{ padding: "0 16px", marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Taxa de Entrega */}
          <button style={{ width: "100%", backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", cursor: "pointer" }}>
             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
               <MapPin size={20} color="#a3a3a3" />
               <span style={{ fontWeight: 500, fontSize: 14 }}>Calcular taxa e tempo de entrega</span>
             </div>
             <ChevronRight size={20} color="#737373" />
          </button>

          {/* Programa de Fidelidade */}
          <div style={{ width: "100%", backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, padding: 16, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ backgroundColor: "#000", padding: 8, borderRadius: "50%" }}>
                <Gift size={20} color="#fff" />
              </div>
              <span style={{ fontWeight: "bold", fontSize: 16 }}>Programa de fidelidade</span>
            </div>
            <p style={{ fontSize: 14, color: "#d4d4d4", margin: "0 0 8px 0" }}>A cada <strong style={{ color: "#fff" }}>R$ 1,00</strong> em compras você ganha <strong style={{ color: "#fff" }}>1 ponto</strong> que pode ser trocado por prêmios.</p>
            <p style={{ fontSize: 14, color: "#d4d4d4", margin: 0 }}>Os novos clientes ganham automaticamente <strong style={{ color: "#fff" }}>10 pontos.</strong></p>
          </div>
        </div>

        {/* ALTERAÇÃO SOLICITADA: Filtros e busca */}
        <div style={{ padding: "0 16px", marginTop: 24, display: "flex", gap: 12 }}>
          <button style={{ flex: 1, backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 8, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Lista de categorias
            <ChevronDown size={18} color="#a3a3a3" />
          </button>
          <button style={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 8, padding: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Search size={20} color="#a3a3a3" />
          </button>
        </div>

        {/* ALTERAÇÃO SOLICITADA: Carrossel de destaques horizontais */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", padding: "0 16px", marginBottom: 16, margin: "0 0 16px 16px" }}>Destaques</h2>
          <div className="hide-scrollbar" style={{ display: "flex", overflowX: "auto", gap: 16, padding: "0 16px 16px", scrollSnapType: "x mandatory" }}>
            
            {/* Utilizando os itens 0 e 1 do array original para manter o funcionamento */}
            {produtos.slice(0, 2).map((p) => (
              <div key={p.id} onClick={() => handleOpenModal(p)} style={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, minWidth: 260, scrollSnapAlign: "start", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                <div style={{ position: "relative", width: "100%", height: 160, backgroundColor: "#262626" }}>
                   <img src={p.foto} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                   <span style={{ backgroundColor: "rgba(185, 28, 28, 0.2)", color: "#ef4444", fontSize: 11, fontWeight: "bold", padding: "4px 8px", borderRadius: 4, width: "max-content", marginBottom: 8 }}>
                     NOVIDADE
                   </span>
                   <h3 style={{ fontWeight: "bold", fontSize: 17, margin: "0 0 4px" }}>{p.nome}</h3>
                   <p style={{ color: "#a3a3a3", fontSize: 13, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>{p.desc}</p>
                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                     <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>R$ {p.preco.toFixed(2).replace(".", ",")}</span>
                     <span style={{ color: "#737373", fontSize: 14, textDecoration: "line-through" }}>R$ {(p.preco + 10).toFixed(2).replace(".", ",")}</span>
                   </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ALTERAÇÃO SOLICITADA: Lista vertical de mais vendidos */}
        <div style={{ marginTop: 24, padding: "0 16px", paddingBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>Os Mais Vendidos (Os Queridinhos)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            {/* Utilizando do item 2 em diante do array original */}
            {produtos.slice(2).map((p) => (
              <div key={p.id} onClick={() => handleOpenModal(p)} style={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, padding: 16, display: "flex", gap: 16, cursor: "pointer" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ backgroundColor: "rgba(30, 58, 138, 0.3)", color: "#60a5fa", fontSize: 11, fontWeight: "bold", padding: "4px 8px", borderRadius: 4, width: "max-content", marginBottom: 8, display: "block" }}>
                    RECOMENDADO
                  </span>
                  <h3 style={{ fontWeight: "bold", fontSize: 17, margin: "0 0 4px" }}>{p.nome}</h3>
                  <p style={{ color: "#a3a3a3", fontSize: 13, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                  <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>R$ {p.preco.toFixed(2).replace(".", ",")}</span>
                </div>
                <div style={{ position: "relative", width: 100, height: 100, backgroundColor: "#262626", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                   <img src={p.foto} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ── MODAL ── */}
        {selectedProduct && (
          <div className="m-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999, display: "flex", alignItems: "flex-end", backdropFilter: "blur(8px)" }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
            <div className="m-sheet m-scrollbar" style={{ background: "#0c0c0c", width: "100%", maxHeight: "92svh", borderRadius: "20px 20px 0 0", overflowY: "auto", overflowX: "hidden", boxShadow: "0 -30px 80px rgba(0,0,0,0.9)" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #b91c1c, #ff6b35, transparent)" }} />
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
                <div style={{ width: 32, height: 3, background: "#222", borderRadius: 2 }} />
              </div>

              {/* Imagem */}
              <div style={{ position: "relative", margin: "12px 16px 0", borderRadius: 14, overflow: "hidden", height: 190 }}>
                <img src={selectedProduct.foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(12,12,12,0.95) 100%)" }} />
                <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={14} />
                </button>
                <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase", fontFamily: "Impact, sans-serif", margin: "0 0 2px" }}>{selectedProduct.nome}</h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: 0, lineHeight: 1.4 }}>{selectedProduct.desc}</p>
                </div>
              </div>

              {/* Opções */}
              <div style={{ padding: "20px 16px 0" }}>
                {[{ title: "MOLHOS GRÁTIS", items: molhosGratis }, { title: "MOLHOS DA CASA", items: molhosCasa }, { title: "ADICIONAIS", items: complementos }].map(section => (
                  <div key={section.title} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #141414" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 2, height: 14, background: "#b91c1c", borderRadius: 2 }} />
                        <h4 style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, color: "#ccc" }}>{section.title}</h4>
                      </div>
                      <span style={{ fontSize: 9, color: "#b91c1c", fontWeight: 700, background: "#b91c1c15", border: "1px solid #b91c1c22", padding: "2px 8px", borderRadius: 10, letterSpacing: "0.1em" }}>MÁX 5</span>
                    </div>
                    {section.items.map(item => (
                      <div key={item.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #0f0f0f" }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#bbb", display: "block", marginBottom: 2 }}>{item.nome}</span>
                          {item.preco > 0 ? <span style={{ fontSize: 11, color: "#b91c1c", fontWeight: 700 }}>+ R$ {item.preco.toFixed(2).replace(".", ",")}</span> : <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>Grátis</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", background: "#080808", borderRadius: 10, border: `1px solid ${getQtd(item.nome) > 0 ? "#b91c1c44" : "#1a1a1a"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                          <button onClick={() => updateOptionQtd(item, -1, 5, section.items)} style={{ background: "none", border: "none", color: getQtd(item.nome) > 0 ? "#b91c1c" : "#333", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center" }}><Minus size={12} strokeWidth={2.5} /></button>
                          <span style={{ fontWeight: 900, minWidth: 20, textAlign: "center", fontSize: 13, color: getQtd(item.nome) > 0 ? "#fff" : "#2a2a2a" }}>{getQtd(item.nome)}</span>
                          <button onClick={() => updateOptionQtd(item, 1, 5, section.items)} style={{ background: "none", border: "none", color: "#b91c1c", padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center" }}><Plus size={12} strokeWidth={2.5} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Observações */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 2, height: 14, background: "#b91c1c", borderRadius: 2 }} />
                    <h4 style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, color: "#ccc" }}>OBSERVAÇÕES</h4>
                  </div>
                  <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: sem cebola, ponto da carne bem passado..." style={{ width: "100%", background: "#080808", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px", color: "#bbb", height: 72, resize: "none", fontSize: 12, lineHeight: 1.5, boxSizing: "border-box", outline: "none", fontFamily: "sans-serif" }} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ position: "sticky", bottom: 0, background: "linear-gradient(180deg, transparent 0%, #0c0c0c 20%)", padding: "8px 16px calc(16px + env(safe-area-inset-bottom))" }}>
                {extraTotal > 0 && (
                  <div style={{ textAlign: "right", marginBottom: 8 }}>
                    <span style={{ color: "#444", fontSize: 10, fontWeight: 700 }}>+ R$ {extraTotal.toFixed(2).replace(".", ",")} em adicionais</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", background: "#080808", borderRadius: 12, border: "1px solid #1e1e1e", overflow: "hidden", flexShrink: 0 }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "none", border: "none", color: "#b91c1c", padding: "12px 14px", cursor: "pointer", display: "flex" }}><Minus size={14} strokeWidth={2.5} /></button>
                    <span style={{ fontWeight: 900, fontSize: 16, minWidth: 24, textAlign: "center", color: "#fff" }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ background: "none", border: "none", color: "#b91c1c", padding: "12px 14px", cursor: "pointer", display: "flex" }}><Plus size={14} strokeWidth={2.5} /></button>
                  </div>
                  <button onClick={handleConfirmAdd} className="m-pedir-btn" style={{ flex: 1, background: "#b91c1c", border: "none", color: "#fff", padding: "15px 12px", borderRadius: 12, fontWeight: 900, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px #b91c1c44", transition: "all 0.15s" }}>
                    <ShoppingCart size={15} />
                    ADICIONAR · R$ {((selectedProduct.preco + extraTotal) * quantity).toFixed(2).replace(".", ",")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </main>
    </>
  );
}
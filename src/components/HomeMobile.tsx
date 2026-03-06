"use client";

import React, { useState } from "react";
import { X, Plus, Minus, Home, ClipboardList, User, ShoppingCart, ChevronRight } from "lucide-react";
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
    { href: "/perfil",    label: "Perfil",  icon: User          },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9990,
      background: "#0e0e0e",
      borderTop: "1px solid #1e1e1e",
      display: "flex",
      padding: "10px 0 calc(10px + env(safe-area-inset-bottom))",
      boxShadow: "0 -8px 30px rgba(0,0,0,0.7)",
    }}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
            textDecoration: "none",
            color: active ? "#b91c1c" : "#444",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            fontFamily: "sans-serif",
            position: "relative",
          }}>
            {/* Linha ativa no topo */}
            {active && (
              <div style={{
                position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                width: 28, height: 2,
                background: "linear-gradient(90deg, #b91c1c, #ff4d4d)",
                borderRadius: "0 0 2px 2px",
                boxShadow: "0 0 8px #b91c1c",
              }} />
            )}
            <div style={{ position: "relative" }}>
              <Icon size={22} style={{ filter: active ? "drop-shadow(0 0 6px #b91c1c88)" : "none", transform: active ? "translateY(-1px)" : "none", transition: "all 0.2s" }} />
              {/* Badge carrinho no ícone Início */}
              {href === "/" && totalItens > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "#b91c1c", color: "#fff",
                  fontSize: 9, fontWeight: 900,
                  width: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {totalItens}
                </span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ── Card Mobile ───────────────────────────────────────────────────────────────
function MobileCard({ foto, nome, desc, preco, onAdd }: any) {
  return (
    <div style={{
      background: "#0e0e0e",
      border: "1px solid #1a1a1a",
      borderRadius: 12,
      overflow: "hidden",
      display: "flex",
      alignItems: "stretch",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>
      {/* Linha de acento */}
      <div style={{ width: 3, background: "linear-gradient(180deg, #b91c1c, transparent)", flexShrink: 0 }} />

      {/* Imagem */}
      <div style={{ width: 100, height: 100, flexShrink: 0, overflow: "hidden" }}>
        <img src={foto} alt={nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em", color: "#e5e5e5", margin: "0 0 4px" }}>{nome}</h3>
          <p style={{ fontSize: 11, color: "#555", lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ color: "#b91c1c", fontSize: 16, fontWeight: 900, fontStyle: "italic" }}>
            R$ {preco.toFixed(2).replace(".", ",")}
          </span>
          <button onClick={onAdd} style={{
            background: "#b91c1c", border: "none", color: "#fff",
            padding: "6px 14px", borderRadius: 6,
            fontSize: 11, fontWeight: 900,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          }}>
            <Plus size={12} /> PEDIR
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal Mobile ───────────────────────────────────────────────────
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

  const handleConfirmAdd = () => {
    const totalAdicionais = customOptions.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);
    addToCart({
      id: `${selectedProduct.id}-${Date.now()}`, productId: selectedProduct.id,
      name: selectedProduct.nome, price: selectedProduct.preco + totalAdicionais,
      image: selectedProduct.foto, quantity,
      customization: { extras: customOptions.map(o => `${o.qtd}x ${o.nome}`), obs: observacao },
    });
    setSelectedProduct(null);
    router.push("/carrinho");
  };

  return (
    <>
      <style>{`
        @keyframes mFadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        @keyframes mGlow   { 0%,100%{text-shadow:0 0 20px #b91c1c44;} 50%{text-shadow:0 0 40px #b91c1c99;} }
        .m-fade { animation: mFadeUp 0.4s ease both; }
        .m-scrollbar::-webkit-scrollbar { width: 4px; }
        .m-scrollbar::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 2px; }
      `}</style>

      <main style={{ backgroundColor: "#0a0a0a", minHeight: "100svh", color: "#fff", fontFamily: "sans-serif", paddingBottom: 80 }}>

        {/* ── HERO MOBILE ── */}
        <section style={{
          position: "relative", height: "55svh", minHeight: 320,
          backgroundImage: 'url("/design_mobile.jpg")',
          backgroundSize: "cover", backgroundPosition: "center",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          {/* Gradientes */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)", zIndex: 1 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(0deg, #0a0a0a, transparent)", zIndex: 2 }} />

          {/* Conteúdo hero */}
          <div style={{ position: "relative", zIndex: 3, padding: "0 20px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 2, background: "#b91c1c", boxShadow: "0 0 8px #b91c1c", borderRadius: 2 }} />
              <span style={{ color: "#b91c1c", fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>THE FLAME GRILL</span>
            </div>
            <h1 style={{
              fontSize: "clamp(32px, 9vw, 48px)", fontWeight: 900,
              textTransform: "uppercase", fontFamily: "Impact, sans-serif",
              lineHeight: 0.88, margin: "0 0 10px",
              animation: "mGlow 4s ease-in-out infinite",
            }}>
              O BRASIL EM<br /><span style={{ color: "#b91c1c" }}>CADA MORDIDA</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 18px", fontStyle: "italic" }}>
              Grelhado na brasa. Servido com alma.
            </p>
            <Link href="#cardapio" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#b91c1c", color: "#fff",
              padding: "10px 22px", borderRadius: 6,
              fontSize: 13, fontWeight: 900,
              letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
              boxShadow: "0 6px 20px #b91c1c44",
            }}>
              🔥 VER CARDÁPIO
            </Link>
          </div>

          {/* Onda */}
          <div style={{ position: "absolute", bottom: -1, left: 0, width: "100%", zIndex: 4, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
              <path fill="#0a0a0a" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
            </svg>
          </div>
        </section>

        {/* ── CARDÁPIO ── */}
        <section id="cardapio" style={{ padding: "20px 16px 0" }}>
          {/* Header seção */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <span style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>Nosso</span>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: "#b91c1c", margin: 0, fontFamily: "Impact, sans-serif", letterSpacing: "-0.01em" }}>CARDÁPIO</h2>
            </div>
            <Link href="/cardapio" style={{
              display: "flex", alignItems: "center", gap: 4,
              color: "#444", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none",
            }}>
              VER TUDO <ChevronRight size={14} color="#b91c1c" />
            </Link>
          </div>

          {/* Lista de cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {produtos.map((p, i) => (
              <div key={p.id} className="m-fade" style={{ animationDelay: `${i * 0.07}s` }}>
                <MobileCard foto={p.foto} nome={p.nome} desc={p.desc} preco={p.preco} onAdd={() => handleOpenModal(p)} />
              </div>
            ))}
          </div>

          {/* Ver cardápio completo */}
          <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 8 }}>
            <Link href="/cardapio" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid #b91c1c", color: "#fff",
              padding: "12px 28px", borderRadius: 6,
              fontSize: 12, fontWeight: 900,
              letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
            }}>
              VER CARDÁPIO COMPLETO <ChevronRight size={14} color="#b91c1c" />
            </Link>
          </div>
        </section>

        {/* ── FAB Carrinho ── */}
        {totalItens > 0 && (
          <Link href="/carrinho" style={{
            position: "fixed", bottom: 90, right: 16, zIndex: 9980,
            background: "#b91c1c", color: "#fff",
            width: 56, height: 56, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px #b91c1c55",
            textDecoration: "none",
          }}>
            <ShoppingCart size={22} />
            <span style={{
              position: "absolute", top: -2, right: -2,
              background: "#fff", color: "#b91c1c",
              fontSize: 10, fontWeight: 900,
              width: 18, height: 18, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {totalItens}
            </span>
          </Link>
        )}

        {/* ── MODAL ── */}
        {selectedProduct && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", alignItems: "flex-end", backdropFilter: "blur(6px)" }}>
            <div className="m-scrollbar" style={{
              background: "#0e0e0e", width: "100%", maxHeight: "90svh",
              borderRadius: "16px 16px 0 0", overflowY: "auto",
              border: "1px solid #222", borderBottom: "none",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.8)",
            }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #b91c1c, #ff4d4d, transparent)", borderRadius: "16px 16px 0 0" }} />

              {/* Handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
                <div style={{ width: 36, height: 4, background: "#222", borderRadius: 2 }} />
              </div>

              <img src={selectedProduct.foto} style={{ width: "100%", height: 180, objectFit: "cover" }} />

              <div style={{ padding: "16px 16px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", margin: 0 }}>{selectedProduct.nome}</h2>
                  <button onClick={() => setSelectedProduct(null)} style={{ background: "#161616", border: "1px solid #222", color: "#888", width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={16} />
                  </button>
                </div>
                <p style={{ color: "#666", fontSize: 12, marginBottom: 20 }}>{selectedProduct.desc}</p>

                {[{ title: "MOLHOS GRÁTIS", items: molhosGratis }, { title: "MOLHOS DA CASA", items: molhosCasa }, { title: "ADICIONAIS", items: complementos }].map(section => (
                  <div key={section.title} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderLeft: "3px solid #b91c1c", paddingLeft: 10, marginBottom: 10 }}>
                      <h4 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>{section.title}</h4>
                      <span style={{ fontSize: 10, color: "#444", fontWeight: 700 }}>MÁX. 5</span>
                    </div>
                    {section.items.map(item => (
                      <div key={item.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #141414" }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block" }}>{item.nome}</span>
                          {item.preco > 0 ? <span style={{ fontSize: 11, color: "#b91c1c", fontWeight: 600 }}>+ R$ {item.preco.toFixed(2).replace(".", ",")}</span> : <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Grátis</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#080808", padding: "5px 12px", borderRadius: 8, border: "1px solid #1e1e1e" }}>
                          <button onClick={() => updateOptionQtd(item, -1, 5, section.items)} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: "flex" }}><Minus size={13} /></button>
                          <span style={{ fontWeight: 900, minWidth: 16, textAlign: "center", fontSize: 13 }}>{getQtd(item.nome)}</span>
                          <button onClick={() => updateOptionQtd(item, 1, 5, section.items)} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: "flex" }}><Plus size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div style={{ marginBottom: 20 }}>
                  <div style={{ borderLeft: "3px solid #b91c1c", paddingLeft: 10, marginBottom: 10 }}>
                    <h4 style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>OBSERVAÇÕES</h4>
                  </div>
                  <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: sem cebola, ponto da carne..." style={{ width: "100%", background: "#080808", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 12px", color: "#ccc", height: 70, resize: "none", fontSize: 12, boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Footer modal */}
              <div style={{ position: "sticky", bottom: 0, background: "#0e0e0e", padding: "14px 16px calc(14px + env(safe-area-inset-bottom))", borderTop: "1px solid #161616", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#080808", padding: "10px 14px", borderRadius: 8, border: "1px solid #1e1e1e" }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: "flex" }}><Minus size={14} /></button>
                  <span style={{ fontWeight: 900, fontSize: 15, minWidth: 16, textAlign: "center" }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: "flex" }}><Plus size={14} /></button>
                </div>
                <button onClick={handleConfirmAdd} style={{
                  flex: 1, background: "#b91c1c", border: "none", color: "#fff",
                  padding: "14px", borderRadius: 8,
                  fontWeight: 900, fontSize: 13,
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                  boxShadow: "0 6px 20px #b91c1c33",
                }}>
                  ADICIONAR · R$ {((selectedProduct.preco + customOptions.reduce((a, c) => a + (c.preco * c.qtd), 0)) * quantity).toFixed(2).replace(".", ",")}
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </main>
    </>
  );
}
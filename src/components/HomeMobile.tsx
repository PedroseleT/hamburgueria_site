"use client";

import React, { useState, useMemo, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart, ChevronRight, MapPin, ChevronDown, Search, Home, ClipboardList, User, MoreVertical, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";

export default function HomeMobile() {
  const { addToCart, cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCepModal, setShowCepModal] = useState(false);
  const [cep, setCep] = useState("");
  const [cepResult, setCepResult] = useState<any>(null);
  const [endereco, setEndereco] = useState({ rua: "", numero: "", bairro: "", cidade: "" });
  const [enderecoEditado, setEnderecoEditado] = useState(false);
  const [enderecoSalvo, setEnderecoSalvo] = useState<{ rua: string; numero: string; bairro: string; cidade: string } | null>(null);
  const [enderecosSalvos, setEnderecosSalvos] = useState<{ rua: string; numero: string; bairro: string; cidade: string }[]>([]);
  const [enderecoAtivoIdx, setEnderecoAtivoIdx] = useState(0);
  const [showAddressPanel, setShowAddressPanel] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingEndereco, setEditingEndereco] = useState({ rua: "", numero: "", bairro: "", cidade: "" });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [showWhatsapp, setShowWhatsapp] = useState(true);
  const [showAddressBar, setShowAddressBar] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Lê role do cookie
  useEffect(() => {
    try {
      const match = document.cookie.match(/user_session=([^;]+)/);
      if (match) {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setIsAdmin(data.role === "ADMIN" || data.role === "ATTENDANT");
      }
    } catch { setIsAdmin(false); }
  }, []);

  // Carrega endereços do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flame_enderecos");
    const activeIdx = localStorage.getItem("flame_endereco_ativo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setEnderecosSalvos(parsed);
          const idx = activeIdx ? parseInt(activeIdx, 10) : 0;
          setEnderecoAtivoIdx(idx);
          setEnderecoSalvo(parsed[idx]);
        }
      } catch (e) { console.error("Erro ao ler localStorage", e); }
    }
  }, []);

  // Scroll: esconde barra de endereço e WhatsApp ao rolar para baixo
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      const isScrollingUp = current <= lastScroll || current < 50;
      setShowWhatsapp(isScrollingUp);
      setShowAddressBar(isScrollingUp);
      if (!isScrollingUp) setShowAddressPanel(false);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ALTERAÇÃO SOLICITADA: Oculta o WhatsApp quando o menu do BottomNavMobile for aberto
  useEffect(() => {
    const handleMenuEvent = (e: any) => {
      if (e.detail) {
        setShowWhatsapp(false); // Oculta ao abrir
      } else {
        setShowWhatsapp(true);  // Mostra ao fechar
      }
    };
    window.addEventListener("toggleMenuMobile", handleMenuEvent);
    return () => window.removeEventListener("toggleMenuMobile", handleMenuEvent);
  }, []);

  const produtos = [
    { id: "cmmctdp4l0001nsgzj9x6zi5y", nome: "Bacon Handcrafted", categoria: "Hambúrgueres", desc: "Blend bovino 180g, camadas generosas de queijo cheddar derretido e bacon crocante no pão brioche artesanal.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "cmmcqmzlf0000nsgza56yn8g1", nome: "Smoky Texas Grill", categoria: "Hambúrgueres", desc: "Hambúrguer grelhado na brasa, bacon rústico, queijo prato e molho especial defumado com toque de ervas.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "cmmcte9zh0002nsgzqh3hoffv", nome: "Double Cheddar Board", categoria: "Combos", desc: "Dois smash burgers, cheddar duplo, cebola caramelizada e acompanhamento de fritas crocantes na tábua.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" },
  ];

  const categorias = ["Todos", ...Array.from(new Set(produtos.map(p => p.categoria)))];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchCat = selectedCategory === "Todos" || p.categoria === selectedCategory;
      const matchBusca = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchBusca;
    });
  }, [searchTerm, selectedCategory]);

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

  const handleBuscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) { setCepError("Digite um CEP válido com 8 dígitos."); return; }
    setCepLoading(true); setCepError(""); setCepResult(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) setCepError("CEP não encontrado. Verifique e tente novamente.");
      else {
        setCepResult(data);
        setEndereco({ rua: data.logradouro ?? "", numero: "", bairro: data.bairro ?? "", cidade: `${data.localidade} - ${data.uf}` });
        setEnderecoEditado(false);
      }
    } catch { setCepError("Erro ao buscar CEP. Tente novamente."); }
    finally { setCepLoading(false); }
  };

  const closeCepModal = () => {
    setShowCepModal(false);
    setCepResult(null);
    setCep("");
    setCepError("");
    setEndereco({ rua: "", numero: "", bairro: "", cidade: "" });
    setEnderecoEditado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveAndClose = () => {
    setEnderecoEditado(true);
    if (!endereco.rua.trim() || !endereco.numero.trim() || !endereco.bairro.trim() || !endereco.cidade.trim()) return;
    const novo = { ...endereco };
    setEnderecosSalvos(prev => {
      const nova = [...prev, novo];
      localStorage.setItem("flame_enderecos", JSON.stringify(nova));
      localStorage.setItem("flame_endereco_ativo", String(nova.length - 1));
      setEnderecoAtivoIdx(nova.length - 1);
      return nova;
    });
    setEnderecoSalvo(novo);
    setShowCepModal(false);
    setCepResult(null);
    setCep("");
    setCepError("");
    setEndereco({ rua: "", numero: "", bairro: "", cidade: "" });
    setEnderecoEditado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes mSlideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes mSheetUp { from{transform:translateY(100%);} to{transform:translateY(0);} }
        @keyframes mFadeIn  { from{opacity:0;} to{opacity:1;} }
        .m-card    { animation: mSlideUp 0.35s ease both; }
        .m-sheet   { animation: mSheetUp 0.32s cubic-bezier(0.32,0.72,0,1) both; }
        .m-overlay { animation: mFadeIn 0.2s ease both; }
        .m-scrollbar { scrollbar-width: thin; scrollbar-color: #b91c1c #0a0a0a; }
        .m-scrollbar::-webkit-scrollbar { width: 3px; }
        .m-scrollbar::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 2px; }
        .m-pedir-btn:active { transform: scale(0.97); background: #991b1b !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Feedback visual ao clicar nos botões dos apps */
        .app-btn-active:active { transform: scale(0.96); }
      `}</style>

      <main style={{ backgroundColor: "#080808", minHeight: "100svh", color: "#fff", fontFamily: "sans-serif", paddingTop: 0, paddingBottom: "calc(72px + env(safe-area-inset-bottom))", overflowX: "hidden" }}>

        {/* ── Barra de endereço fixa ── */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1001,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          transform: showAddressBar ? "translateY(0)" : "translateY(-100%)",
          opacity: showAddressBar ? 1 : 0,
          pointerEvents: showAddressBar ? "auto" : "none",
        }}>
          <button onClick={() => {
            const isLogged = document.cookie.includes("user_session");
            if (!isLogged) { router.push("/login?callback=/"); return; }
            enderecoSalvo ? setShowAddressPanel(!showAddressPanel) : setShowCepModal(true);
          }} style={{
            width: "100%", background: "#111", border: "none", borderBottom: "1px solid #1a1a1a",
            padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
          }}>
            {enderecoSalvo ? (
              <>
                <MapPin size={14} color="#b91c1c" style={{ flexShrink: 0 }} />
                <div style={{ overflow: "hidden", textAlign: "left" }}>
                  <p style={{ color: "#888", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Entregar em</p>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {enderecoSalvo.rua}, {enderecoSalvo.numero} · {enderecoSalvo.bairro}
                  </p>
                </div>
                <ChevronDown size={14} color="#b91c1c" style={{ flexShrink: 0, transform: showAddressPanel ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </>
            ) : (
              <>
                <p style={{ color: "#aaa", fontSize: 13, fontWeight: 600, margin: 0 }}>Adicionar endereço de entrega</p>
                <ChevronDown size={16} color="#b91c1c" style={{ flexShrink: 0 }} />
              </>
            )}
          </button>

          {/* Painel expansível */}
          {showAddressPanel && enderecoSalvo && (
            <>
              <div onClick={() => { setShowAddressPanel(false); setEditingIdx(null); }} style={{ position: "fixed", inset: 0, zIndex: -1 }} />
              <div className="m-card" style={{ background: "#111", borderBottom: "1px solid #1a1a1a", padding: "12px 16px" }}>
                {enderecosSalvos.map((end, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    {editingIdx === idx ? (
                      <div style={{ background: "#0a0a0a", border: "1px solid #b91c1c44", borderRadius: 8, padding: 12 }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                          <input placeholder="Rua / Avenida" value={editingEndereco.rua}
                            onChange={e => setEditingEndereco({ ...editingEndereco, rua: e.target.value })}
                            style={{ flex: 1, background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "sans-serif" }} />
                          <input placeholder="Nº" value={editingEndereco.numero}
                            onChange={e => setEditingEndereco({ ...editingEndereco, numero: e.target.value })}
                            style={{ width: 60, background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "sans-serif" }} />
                        </div>
                        <input placeholder="Bairro" value={editingEndereco.bairro}
                          onChange={e => setEditingEndereco({ ...editingEndereco, bairro: e.target.value })}
                          style={{ width: "100%", background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box", marginBottom: 8 }} />
                        <input placeholder="Cidade - UF" value={editingEndereco.cidade}
                          onChange={e => setEditingEndereco({ ...editingEndereco, cidade: e.target.value })}
                          style={{ width: "100%", background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box", marginBottom: 10 }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setEditingIdx(null)}
                            style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "8px", color: "#888", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                            CANCELAR
                          </button>
                          <button onClick={() => {
                            if (!editingEndereco.rua.trim() || !editingEndereco.numero.trim() || !editingEndereco.bairro.trim() || !editingEndereco.cidade.trim()) return;
                            const updated = [...enderecosSalvos];
                            updated[idx] = { ...editingEndereco };
                            setEnderecosSalvos(updated);
                            localStorage.setItem("flame_enderecos", JSON.stringify(updated));
                            if (idx === enderecoAtivoIdx) setEnderecoSalvo(updated[idx]);
                            setEditingIdx(null);
                          }}
                            style={{ flex: 1, background: "#b91c1c", border: "none", borderRadius: 6, padding: "8px", color: "#fff", fontSize: 11, fontWeight: 900, cursor: "pointer" }}>
                            SALVAR
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => { setEnderecoSalvo(end); setEnderecoAtivoIdx(idx); localStorage.setItem("flame_endereco_ativo", String(idx)); setShowAddressPanel(false); setEditingIdx(null); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, background: idx === enderecoAtivoIdx ? "#b91c1c12" : "#0a0a0a", border: `1px solid ${idx === enderecoAtivoIdx ? "#b91c1c44" : "#1a1a1a"}`, cursor: "pointer" }}>
                        <MapPin size={14} color={idx === enderecoAtivoIdx ? "#b91c1c" : "#555"} style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{end.rua}, {end.numero}</p>
                          <p style={{ color: "#666", fontSize: 11, margin: 0 }}>{end.bairro} · {end.cidade}</p>
                        </div>
                        {idx === enderecoAtivoIdx && (
                          <span style={{ background: "#b91c1c", color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>ATIVO</span>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setEditingIdx(idx); setEditingEndereco({ ...end }); }}
                          style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0, padding: "4px 8px" }}>
                          EDITAR
                        </button>
                        <button onClick={(e) => {
                          e.stopPropagation();
                          const updated = enderecosSalvos.filter((_, i) => i !== idx);
                          setEnderecosSalvos(updated);
                          localStorage.setItem("flame_enderecos", JSON.stringify(updated));
                          if (updated.length === 0) {
                            setEnderecoSalvo(null);
                            setEnderecoAtivoIdx(0);
                            localStorage.removeItem("flame_enderecos");
                            localStorage.removeItem("flame_endereco_ativo");
                            setShowAddressPanel(false);
                          } else {
                            const newIdx = Math.min(enderecoAtivoIdx, updated.length - 1);
                            setEnderecoAtivoIdx(newIdx);
                            setEnderecoSalvo(updated[newIdx]);
                            localStorage.setItem("flame_endereco_ativo", String(newIdx));
                          }
                        }}
                          style={{ background: "none", border: "none", color: "#b91c1c55", cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0, padding: "4px 8px" }}>
                          EXCLUIR
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => { setShowAddressPanel(false); setEditingIdx(null); setShowCepModal(true); }}
                  style={{ width: "100%", background: "none", border: "1px dashed #333", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
                  <Plus size={14} color="#555" />
                  Adicionar novo endereço
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Banner + Logo ── */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", height: 192, position: "relative", backgroundColor: "#1a1a1a" }}>
            <img src="/design_mobile.jpg" alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
          </div>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: -48, zIndex: 5 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", border: "4px solid #080808", overflow: "hidden", backgroundColor: "#000" }}>
              <img src="/logo_hamburgueria.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* ── Info restaurante ── */}
        <div style={{ padding: "0 16px", marginTop: 64, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>The Flame Grill</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, color: "#a3a3a3", fontSize: 14 }}>
            <MapPin size={16} /><span>Campinas - SP • Mais informações</span>
          </div>
          <p style={{ color: "#ef4444", fontWeight: 500, fontSize: 14, marginTop: 8, marginBottom: 0 }}>Fechado • Abrimos amanhã às 18h30</p>
        </div>

        {/* # ALTERAÇÃO SOLICITADA: Botões iFood e 99Food com Logos Reais */}
        <div style={{ padding: "0 16px", marginTop: 24, display: "flex", gap: 12 }}>
          {/* iFood */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="app-btn-active"
            style={{ flex: 1, backgroundColor: "#ea1d2c", borderRadius: 10, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 13, letterSpacing: "0.05em" }}>
            {/* Usando a imagem PNG da pasta public */}
            <img src="/ifood-logo.png" alt="iFood" style={{ height: 50, width: 'auto' }} />
            PEDIR NO IFOOD
          </a>
          
          {/* 99Food - Botão Mais Amarelo */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="app-btn-active"
            style={{ flex: 1, backgroundColor: "#FFB800", borderRadius: 10, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 13, letterSpacing: "0.05em" }}>
            {/* Usando a imagem PNG da pasta public */}
            <img src="/99food.png" alt="99Food" style={{ height: 50, width: 'auto' }} />
            PEDIR NO 99FOOD
          </a>
        </div>

        {/* ── Botão taxa ── */}
        <div style={{ padding: "0 16px", marginTop: 24 }}>
          <button onClick={() => {
            const isLogged = document.cookie.includes("user_session");
            if (!isLogged) { router.push("/login?callback=/"); return; }
            setShowCepModal(true);
          }} style={{ width: "100%", backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MapPin size={20} color="#a3a3a3" />
              <span style={{ fontWeight: 500, fontSize: 14 }}>Calcular taxa e tempo de entrega</span>
            </div>
            <ChevronRight size={20} color="#737373" />
          </button>
        </div>

        {/* ── Filtros ── */}
        <div style={{ padding: "0 16px", marginTop: 24, display: "flex", gap: 12, position: "relative" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} style={{ width: "100%", backgroundColor: "#171717", border: `1px solid ${showCategoryDropdown ? "#b91c1c44" : "#262626"}`, borderRadius: 8, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              {selectedCategory}
              <ChevronDown size={18} color="#a3a3a3" style={{ transform: showCategoryDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {showCategoryDropdown && (
              <>
                <div onClick={() => setShowCategoryDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#171717", border: "1px solid #262626", borderRadius: 8, zIndex: 99, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
                  {categorias.map(cat => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }} style={{ width: "100%", padding: "12px 16px", background: cat === selectedCategory ? "#b91c1c18" : "none", border: "none", borderLeft: cat === selectedCategory ? "2px solid #b91c1c" : "2px solid transparent", color: cat === selectedCategory ? "#b91c1c" : "#ccc", fontSize: 14, fontWeight: 600, textAlign: "left", cursor: "pointer" }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={() => setShowSearch(!showSearch)} style={{ backgroundColor: showSearch ? "#b91c1c18" : "#171717", border: `1px solid ${showSearch ? "#b91c1c44" : "#262626"}`, borderRadius: 8, padding: 12, display: "flex", alignItems: "center", cursor: "pointer", transition: "all 0.2s" }}>
            <Search size={20} color={showSearch ? "#b91c1c" : "#a3a3a3"} />
          </button>
        </div>

        {/* ── Campo busca ── */}
        {showSearch && (
          <div className="m-card" style={{ padding: "10px 16px 0" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} color="#555" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input autoFocus type="text" placeholder="Buscar no cardápio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ width: "100%", background: "#111", border: "1px solid #262626", borderRadius: 8, padding: "10px 36px 10px 34px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
              {searchTerm && <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", display: "flex" }}><X size={14} /></button>}
            </div>
          </div>
        )}

        {/* ── Destaques ── */}
        {produtosFiltrados.length > 0 && (
          <div style={{ marginTop: 32, padding: "0 16px" }}>
            <h2 style={{ fontSize: 20, fontWeight: "bold", margin: "0 0 16px" }}>Destaques</h2>
            <div className="hide-scrollbar" style={{ display: "flex", overflowX: "auto", gap: 16, paddingLeft: 16, paddingRight: 16, paddingBottom: 16, scrollSnapType: "x mandatory" }}>
              {produtosFiltrados.slice(0, 2).map((p) => (
                <div key={p.id} onClick={() => handleOpenModal(p)} style={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, minWidth: 260, scrollSnapAlign: "start", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                  <div style={{ width: "100%", height: 160 }}><img src={p.foto} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ backgroundColor: "rgba(185,28,28,0.2)", color: "#ef4444", fontSize: 11, fontWeight: "bold", padding: "4px 8px", borderRadius: 4, width: "max-content", marginBottom: 8 }}>NOVIDADE</span>
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
        )}

        {/* ── Mais Vendidos ── */}
        <div style={{ marginTop: 24, padding: "0 16px", paddingBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
            {searchTerm || selectedCategory !== "Todos" ? "Resultados" : "Os Mais Vendidos (Os Queridinhos)"}
          </h2>
          {produtosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#444" }}>
              <Search size={36} style={{ margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(produtosFiltrados.length > 2 ? produtosFiltrados.slice(2) : produtosFiltrados).map((p) => (
                <div key={p.id} onClick={() => handleOpenModal(p)} style={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: 12, padding: 16, display: "flex", gap: 16, cursor: "pointer" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ backgroundColor: "rgba(30,58,138,0.3)", color: "#60a5fa", fontSize: 11, fontWeight: "bold", padding: "4px 8px", borderRadius: 4, width: "max-content", marginBottom: 8, display: "block" }}>RECOMENDADO</span>
                    <h3 style={{ fontWeight: "bold", fontSize: 17, margin: "0 0 4px" }}>{p.nome}</h3>
                    <p style={{ color: "#a3a3a3", fontSize: 13, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                    <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: 16 }}>R$ {p.preco.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div style={{ width: 100, height: 100, backgroundColor: "#262626", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <img src={p.foto} alt={p.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── WhatsApp ── */}
        <a href="https://wa.me/5519992676339" target="_blank" rel="noopener noreferrer"
          style={{
            position: "fixed", bottom: "calc(82px + env(safe-area-inset-bottom))", right: 48  , zIndex: 9980,
            width: 62, height: 62, borderRadius: "50%", background: "#25D366",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(37,211,102,0.45)", textDecoration: "none",
            opacity: showWhatsapp && !showMenu ? 1 : 0,
            transform: showWhatsapp && !showMenu ? "scale(1)" : "scale(0.8)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: showWhatsapp && !showMenu ? "auto" : "none",
          }}>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        {/* ── Modal produto ── */}
        {selectedProduct && (
          <div className="m-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999, display: "flex", alignItems: "flex-end", backdropFilter: "blur(8px)" }} onClick={(e) => { if (e.target === e.currentTarget) { setSelectedProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>
            <div className="m-sheet m-scrollbar" style={{ background: "#0c0c0c", width: "100%", maxHeight: "92svh", borderRadius: "20px 20px 0 0", overflowY: "auto", overflowX: "hidden", boxShadow: "0 -30px 80px rgba(0,0,0,0.9)" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #b91c1c, #ff6b35, transparent)" }} />
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}><div style={{ width: 32, height: 3, background: "#222", borderRadius: 2 }} /></div>
              <div style={{ position: "relative", margin: "12px 16px 0", borderRadius: 14, overflow: "hidden", height: 190 }}>
                <img src={selectedProduct.foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(12,12,12,0.95) 100%)" }} />
                <button onClick={() => { setSelectedProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} /></button>
                <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase", fontFamily: "Impact, sans-serif", margin: "0 0 2px" }}>{selectedProduct.nome}</h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: 0, lineHeight: 1.4 }}>{selectedProduct.desc}</p>
                </div>
              </div>
              <div style={{ padding: "20px 16px 0" }}>
                {[{ title: "MOLHOS GRÁTIS", items: molhosGratis }, { title: "MOLHOS DA CASA", items: molhosCasa }, { title: "ADICIONAIS", items: complementos }].map(section => (
                  <div key={section.title} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #141414" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 2, height: 14, background: "#b91c1c", borderRadius: 2 }} />
                        <h4 style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, color: "#ccc" }}>{section.title}</h4>
                      </div>
                      <span style={{ fontSize: 9, color: "#b91c1c", fontWeight: 700, background: "#b91c1c15", border: "1px solid #b91c1c22", padding: "2px 8px", borderRadius: 10 }}>MÁX 5</span>
                    </div>
                    {section.items.map(item => (
                      <div key={item.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #0f0f0f" }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#bbb", display: "block", marginBottom: 2 }}>{item.nome}</span>
                          {item.preco > 0 ? <span style={{ fontSize: 11, color: "#b91c1c", fontWeight: 700 }}>+ R$ {item.preco.toFixed(2).replace(".", ",")}</span> : <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>Grátis</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", background: "#080808", borderRadius: 10, border: `1px solid ${getQtd(item.nome) > 0 ? "#b91c1c44" : "#1a1a1a"}`, overflow: "hidden" }}>
                          <button onClick={() => updateOptionQtd(item, -1, 5, section.items)} style={{ background: "none", border: "none", color: getQtd(item.nome) > 0 ? "#b91c1c" : "#333", padding: "8px 12px", cursor: "pointer", display: "flex" }}><Minus size={12} strokeWidth={2.5} /></button>
                          <span style={{ fontWeight: 900, minWidth: 20, textAlign: "center", fontSize: 13, color: getQtd(item.nome) > 0 ? "#fff" : "#2a2a2a" }}>{getQtd(item.nome)}</span>
                          <button onClick={() => updateOptionQtd(item, 1, 5, section.items)} style={{ background: "none", border: "none", color: "#b91c1c", padding: "8px 12px", cursor: "pointer", display: "flex" }}><Plus size={12} strokeWidth={2.5} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 2, height: 14, background: "#b91c1c", borderRadius: 2 }} />
                    <h4 style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, color: "#ccc" }}>OBSERVAÇÕES</h4>
                  </div>
                  <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: sem cebola, ponto da carne bem passado..." style={{ width: "100%", background: "#080808", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px", color: "#bbb", height: 72, resize: "none", fontSize: 12, lineHeight: 1.5, boxSizing: "border-box", outline: "none", fontFamily: "sans-serif" }} />
                </div>
              </div>
              <div style={{ position: "sticky", bottom: 0, background: "linear-gradient(180deg, transparent 0%, #0c0c0c 20%)", padding: "8px 16px calc(16px + env(safe-area-inset-bottom))" }}>
                {extraTotal > 0 && <div style={{ textAlign: "right", marginBottom: 8 }}><span style={{ color: "#444", fontSize: 10, fontWeight: 700 }}>+ R$ {extraTotal.toFixed(2).replace(".", ",")} em adicionais</span></div>}
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

        {/* ── Modal CEP ── */}
        {showCepModal && (
          <div className="m-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999, display: "flex", alignItems: "flex-end", backdropFilter: "blur(8px)" }} onClick={(e) => { if (e.target === e.currentTarget) closeCepModal(); }}>
            <div className="m-sheet m-scrollbar" style={{ background: "#0c0c0c", width: "100%", maxHeight: "92svh", borderRadius: "20px 20px 0 0", overflowY: "auto", padding: "0 0 calc(24px + env(safe-area-inset-bottom))", boxShadow: "0 -30px 80px rgba(0,0,0,0.9)" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #b91c1c, #ff6b35, transparent)" }} />
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}><div style={{ width: 32, height: 3, background: "#222", borderRadius: 2 }} /></div>
              <div style={{ padding: "20px 16px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase", fontFamily: "Impact, sans-serif", margin: 0 }}>Taxa de Entrega</h2>
                  <button onClick={closeCepModal} style={{ background: "#161616", border: "1px solid #222", color: "#888", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} /></button>
                </div>
                <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>Digite seu CEP para calcular a taxa e o tempo estimado de entrega.</p>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <input type="tel" placeholder="00000-000" maxLength={9} value={cep}
                    onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setCep(v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v); setCepError(""); setCepResult(null); }}
                    onKeyDown={e => { if (e.key === "Enter") handleBuscarCep(); }}
                    style={{ flex: 1, background: "#111", border: `1px solid ${cepError ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "12px", color: "#fff", fontSize: 16, outline: "none", fontFamily: "sans-serif", letterSpacing: "0.05em" }} />
                  <button onClick={handleBuscarCep} disabled={cepLoading} style={{ background: "#b91c1c", border: "none", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 900, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: cepLoading ? 0.7 : 1 }}>
                    {cepLoading ? "..." : "BUSCAR"}
                  </button>
                </div>
                {cepError && <p style={{ color: "#b91c1c", fontSize: 12, fontWeight: 700, margin: "0 0 12px" }}>{cepError}</p>}

                {cepResult && (
                  <div className="m-card" style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 16 }}>
                    <div style={{ borderLeft: "2px solid #b91c1c", paddingLeft: 12, marginBottom: 16 }}>
                      <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Confirme seu endereço</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                      <div style={{ flex: 1 }}>
                        <input placeholder="Rua / Avenida" value={endereco.rua}
                          onChange={e => { setEndereco({ ...endereco, rua: e.target.value }); setEnderecoEditado(true); }}
                          style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${enderecoEditado && !endereco.rua.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box" }} />
                        {enderecoEditado && !endereco.rua.trim() && <p style={{ color: "#b91c1c", fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                      </div>
                      <div style={{ width: 70 }}>
                        <input placeholder="Nº" value={endereco.numero}
                          onChange={e => { setEndereco({ ...endereco, numero: e.target.value }); setEnderecoEditado(true); }}
                          style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${enderecoEditado && !endereco.numero.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box" }} />
                        {enderecoEditado && !endereco.numero.trim() && <p style={{ color: "#b91c1c", fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                      </div>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <input placeholder="Bairro" value={endereco.bairro}
                        onChange={e => { setEndereco({ ...endereco, bairro: e.target.value }); setEnderecoEditado(true); }}
                        style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${enderecoEditado && !endereco.bairro.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box" }} />
                      {enderecoEditado && !endereco.bairro.trim() && <p style={{ color: "#b91c1c", fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <input placeholder="Cidade - UF" value={endereco.cidade}
                        onChange={e => { setEndereco({ ...endereco, cidade: e.target.value }); setEnderecoEditado(true); }}
                        style={{ width: "100%", background: "#0a0a0a", border: `1px solid ${enderecoEditado && !endereco.cidade.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "sans-serif", boxSizing: "border-box" }} />
                      {enderecoEditado && !endereco.cidade.trim() && <p style={{ color: "#b91c1c", fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                    </div>
                    {endereco.rua.trim() && endereco.numero.trim() && endereco.bairro.trim() && endereco.cidade.trim() && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                        <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #1a1a1a" }}>
                          <p style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>Taxa</p>
                          <p style={{ color: "#b91c1c", fontSize: 20, fontWeight: 900, fontStyle: "italic", margin: 0 }}>R$ 5,00</p>
                        </div>
                        <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #1a1a1a" }}>
                          <p style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>Tempo</p>
                          <p style={{ color: "#fff", fontSize: 20, fontWeight: 900, fontStyle: "italic", margin: 0 }}>~30min</p>
                        </div>
                      </div>
                    )}
                    <button onClick={saveAndClose}
                      style={{ width: "100%", marginTop: 4, background: "#b91c1c", border: "none", color: "#fff", padding: "13px", borderRadius: 8, fontWeight: 900, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 20px #b91c1c33" }}>
                      SALVAR ENDEREÇO
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
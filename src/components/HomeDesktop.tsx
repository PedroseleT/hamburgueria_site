"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MessageCircle, X, Plus, Minus, MapPin, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function HomeDesktop() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
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

  // ALTERAÇÃO SOLICITADA: Carregar endereços salvos do localStorage ao iniciar
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

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setShowWhatsapp(current <= lastScroll || current < 50);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const produtos = [
    { id: "cmmctdp4l0001nsgzj9x6zi5y", nome: "Bacon Handcrafted", categoria: "Hambúrgueres", desc: "Blend bovino 180g, camadas generosas de queijo cheddar derretido e bacon crocante no pão brioche artesanal.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "cmmcqmzlf0000nsgza56yn8g1", nome: "Smoky Texas Grill", categoria: "Hambúrgueres", desc: "Hambúrguer grelhado na brasa, bacon rústico, queijo prato e molho especial defumado com toque de ervas.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "cmmcte9zh0002nsgzqh3hoffv", nome: "Double Cheddar Board", categoria: "Combos", desc: "Dois smash burgers, cheddar duplo, cebola caramelizada e acompanhamento de fritas crocantes na tábua.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" }
  ];

  const categorias = ["Todos", ...Array.from(new Set(produtos.map(p => p.categoria)))];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchCat = selectedCategory === "Todos" || p.categoria === selectedCategory;
      const matchBusca = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchBusca;
    });
  }, [searchTerm, selectedCategory]);

  const molhosGratis = [
    { nome: "Ketchup", preco: 0 }, { nome: "Mostarda", preco: 0 }, { nome: "Maionese Tradicional", preco: 0 }
  ];
  const molhosCasa = [
    { nome: "Maionese Artesanal 30ml", preco: 3.50 }, { nome: "Barbecue Defumado 30ml", preco: 4.00 }, { nome: "Chipotle Picante 30ml", preco: 4.50 }
  ];
  const complementos = [
    { nome: "Hambúrguer Extra 180g", preco: 12.00 }, { nome: "Bacon em Tiras", preco: 6.00 }, { nome: "Queijo Cheddar", preco: 5.00 }, { nome: "Salada Fresca", preco: 3.00 }
  ];

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
      image: selectedProduct.foto, quantity: quantity,
      customization: { extras: customOptions.map(o => `${o.qtd}x ${o.nome}`), obs: observacao }
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
  };

  const saveAndClose = () => {
    setEnderecoEditado(true);
    if (!endereco.rua.trim() || !endereco.numero.trim() || !endereco.bairro.trim() || !endereco.cidade.trim()) return;
    const novo = { ...endereco };
    setEnderecosSalvos(prev => {
      const nova = [...prev, novo];
      // ALTERAÇÃO SOLICITADA: Salvar no localStorage
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
  };

  return (
    <main style={{ margin: 0, padding: 0, paddingTop: '80px', backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100%', color: '#fff', position: 'relative' }}>
      <div className="flame-overlay" />

      <style jsx global>{`
        body, html { margin: 0; padding: 0; overflow-x: hidden; background-color: #0a0a0a; scroll-behavior: smooth; }
        .flame-overlay { position: fixed; inset: 0; background-image: url("/chamas-overlay.png"); background-size: cover; opacity: 0.12; mix-blend-mode: screen; pointer-events: none; z-index: 1; }
        .btn-cardapio-completo { display: inline-block; padding: 15px 40px; border: 2px solid #b91c1c; color: #fff; font-size: 18px; font-weight: bold; text-decoration: none; text-transform: uppercase; border-radius: 5px; transition: 0.3s; position: relative; z-index: 10; }
        .btn-cardapio-completo:hover { background-color: #b91c1c; transform: scale(1.05); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; backdrop-filter: blur(5px); }
        .modal-content { background: #111; width: 100%; max-width: 480px; border-radius: 20px; overflow-y: auto; max-height: 85vh; position: relative; border: 1px solid #333; color: #fff; }
        .btn-confirmar { background: #b91c1c; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; flex: 1; margin-left: 15px; transition: 0.2s; }
        .btn-confirmar:hover { background: #991b1b; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 10px; }
        .burger-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; z-index: 10; }
        .burger-card:hover { transform: translateY(-10px); border-color: #b91c1c !important; box-shadow: 0 10px 30px rgba(185,28,28,0.2); }
        .burger-card:hover .img-hover { transform: scale(1.1); }
        .btn-pedir { transition: all 0.3s ease; }
        .btn-pedir:hover { background-color: #b91c1c !important; color: #fff !important; }

        @keyframes heroFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroBadgeFade { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes glowPulse { 0%,100%{opacity:0.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.06);} }
        @keyframes flamePulse { 0%,100%{text-shadow:3px 3px 15px rgba(0,0,0,0.8),0 0 20px #b91c1c55;} 50%{text-shadow:3px 3px 15px rgba(0,0,0,0.8),0 0 50px #b91c1caa,0 0 100px #b91c1c33;} }

        .hero-badge  { animation: heroBadgeFade 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s  both; }
        .hero-title  { animation: heroFadeUp    0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .hero-sub    { animation: heroFadeUp    0.7s cubic-bezier(0.16,1,0.3,1) 0.5s  both; }
        .hero-cta    { animation: heroFadeUp    0.7s cubic-bezier(0.16,1,0.3,1) 0.62s both; }
        .hero-stats  { animation: heroFadeUp    0.7s cubic-bezier(0.16,1,0.3,1) 0.75s both; }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero-section relative overflow-hidden flex flex-col justify-center" style={{ position: 'relative', height: '90vh', width: '100%', display: 'flex', alignItems: 'center', backgroundImage: 'url("/burger-destaque.jpg")', backgroundSize: 'cover', backgroundPosition: 'left 60%', overflow: 'visible', zIndex: 5 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.72) 100%)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(transparent, rgba(10,10,10,0.55))', zIndex: 10, pointerEvents: 'none' }} />

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '8%', position: 'relative', zIndex: 15 }}>
          <div style={{ textAlign: 'right', maxWidth: '540px', position: 'relative', zIndex: 30 }}>
            <div className="hero-badge" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', marginBottom: 16 }}>
              <span style={{ color: '#b91c1c', fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>THE FLAME GRILL</span>
              <div style={{ width: 36, height: 2, background: 'linear-gradient(90deg, transparent, #b91c1c)', borderRadius: 2, boxShadow: '0 0 8px #b91c1c' }} />
            </div>
            <div className="hero-title">
              <h1 style={{ fontSize: 'clamp(40px, 7vw, 90px)', lineHeight: '0.85', fontWeight: '900', textTransform: 'uppercase', fontFamily: 'Impact, sans-serif', textShadow: '3px 3px 15px rgba(0,0,0,0.8)', animation: 'flamePulse 4s ease-in-out infinite', margin: 0 }}>
                O BRASIL EM<br /><span style={{ color: '#b91c1c' }}>CADA MORDIDA</span>
              </h1>
            </div>
            <div className="hero-sub" style={{ margin: '14px 0 26px' }}>
              <p style={{ marginTop: '15px', fontSize: '24px', fontFamily: '"Brush Script MT", cursive', color: '#ccc', margin: 0 }}>Grelhado na brasa. Servido com alma.</p>
            </div>
            <div className="hero-stats" style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginTop: 24, alignItems: 'center' }}>
              {[{ num: '100%', label: 'artesanal' }, { num: 'Brasa', label: 'grelhado' }].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div style={{ width: 1, height: 28, background: '#252525' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'Impact, sans-serif', fontSize: 20, color: '#fff' }}>{s.num}</span>
                    <span style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '-1px', left: 0, width: '100%', zIndex: 10, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100px', display: 'block' }}>
            <path fill="#0a0a0a" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* ── CARDÁPIO COM FILTROS E BUSCA ── */}
      <section id="cardapio" style={{ padding: '80px 20px', backgroundColor: '#0a0a0a', textAlign: 'center', position: 'relative', zIndex: 5, maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ position: 'relative', zIndex: 20, marginBottom: '40px' }}>
          <span style={{ color: '#fff', fontSize: '18px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nosso</span>
          <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0' }}>CARDÁPIO</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px', position: 'relative', zIndex: 20 }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', background: '#111', padding: '15px 25px', borderRadius: '12px', border: '1px solid #222', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Barra de Endereço */}
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={() => enderecoSalvo ? setShowAddressPanel(true) : setShowCepModal(true)} style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", padding: 0 }}>
                <MapPin size={24} color="#b91c1c" style={{ flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  {enderecoSalvo ? (
                    <>
                      <p style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Entregar em</p>
                      <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{enderecoSalvo.rua}, {enderecoSalvo.numero} · {enderecoSalvo.bairro}</p>
                    </>
                  ) : (
                    <p style={{ color: "#aaa", fontSize: 15, fontWeight: 600, margin: 0 }}>Adicionar endereço de entrega</p>
                  )}
                </div>
              </button>
            </div>

            {/* Busca */}
            <div style={{ flex: '1 1 300px', position: "relative" }}>
              <Search size={18} color="#555" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
              <input type="text" placeholder="Buscar no cardápio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #262626", borderRadius: 8, padding: "12px 40px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              {searchTerm && <button onClick={() => setSearchTerm("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", display: "flex" }}><X size={16} /></button>}
            </div>
          </div>

          {/* Categorias Desktop */}
          <div className="custom-scrollbar" style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
            {categorias.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "10px 24px", background: cat === selectedCategory ? "#b91c1c" : "#111", border: `1px solid ${cat === selectedCategory ? "#b91c1c" : "#222"}`, color: cat === selectedCategory ? "#fff" : "#ccc", fontSize: 14, fontWeight: 600, borderRadius: "30px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Listagem de Produtos */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          {produtosFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#444" }}>
              <Search size={48} style={{ margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: 18, fontWeight: 600 }}>Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
              {produtosFiltrados.map((p) => (
                <DesktopCard key={p.id} foto={p.foto} nome={p.nome} desc={p.desc} preco={p.preco} onAdd={() => handleOpenModal(p)} />
              ))}
            </div>
          )}

          <div style={{ marginTop: '120px', position: 'relative', top: '-60px' }}>
            <Link href="/cardapio" className="btn-cardapio-completo">VER CARDÁPIO COMPLETO</Link>
          </div>
        </div>
      </section>

      {/* ── MODAL PRODUTO ── */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setSelectedProduct(null); }}>
          <div className="modal-content custom-scrollbar">
            <button style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedProduct(null)}><X size={20} /></button>
            <img src={selectedProduct.foto} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '5px' }}>{selectedProduct.nome}</h2>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>{selectedProduct.desc}</p>
              {[{ title: "MOLHOS (GRÁTIS)", items: molhosGratis }, { title: "MOLHOS DA CASA", items: molhosCasa }, { title: "ADICIONAIS", items: complementos }].map(section => (
                <div key={section.title} style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '12px', borderLeft: '3px solid #b91c1c', paddingLeft: '10px', marginBottom: '15px', fontWeight: 'bold' }}>{section.title} <small style={{ float: 'right', color: '#888' }}>Limite: 5</small></h4>
                  {section.items.map(item => (
                    <div key={item.nome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #222', fontSize: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>{item.nome}</span>
                        {item.preco > 0 && <span style={{ color: '#b91c1c', fontSize: '12px', fontWeight: 'bold' }}>+ R$ {item.preco.toFixed(2).replace('.', ',')}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#000', padding: '5px 12px', borderRadius: '20px', border: '1px solid #333' }}>
                        <button onClick={() => updateOptionQtd(item, -1, 5, section.items)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={14} /></button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{getQtd(item.nome)}</span>
                        <button onClick={() => updateOptionQtd(item, 1, 5, section.items)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <h4 style={{ fontSize: '12px', borderLeft: '3px solid #b91c1c', paddingLeft: '10px', marginBottom: '15px', fontWeight: 'bold' }}>OBSERVAÇÕES</h4>
                <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: Ponto da carne, sem cebola..." style={{ width: '100%', background: '#000', border: '1px solid #333', borderRadius: '5px', padding: '10px', color: '#fff', fontSize: '12px', height: '60px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #222', paddingTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#000', padding: '8px 15px', borderRadius: '8px' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}><Minus size={16} /></button>
                  <span style={{ fontWeight: 'bold' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}><Plus size={16} /></button>
                </div>
                <button onClick={handleConfirmAdd} className="btn-confirmar">
                  ADICIONAR R$ {((selectedProduct.preco + customOptions.reduce((a, c) => a + (c.preco * c.qtd), 0)) * quantity).toFixed(2).replace('.', ',')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE MEUS ENDEREÇOS ── */}
      {showAddressPanel && enderecoSalvo && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowAddressPanel(false); setEditingIdx(null); }}}>
          <div className="modal-content custom-scrollbar" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", fontFamily: "Impact, sans-serif", margin: 0 }}>Meus Endereços</h2>
              <button onClick={() => { setShowAddressPanel(false); setEditingIdx(null); }} style={{ background: "#161616", border: "1px solid #222", color: "#888", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
            </div>

            {enderecosSalvos.map((end, idx) => (
              <div key={idx} style={{ marginBottom: 15 }}>
                {editingIdx === idx ? (
                  <div style={{ background: "#0a0a0a", border: "1px solid #b91c1c44", borderRadius: 8, padding: 15 }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <input placeholder="Rua / Avenida" value={editingEndereco.rua} onChange={e => setEditingEndereco({ ...editingEndereco, rua: e.target.value })} style={{ flex: 1, background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                      <input placeholder="Nº" value={editingEndereco.numero} onChange={e => setEditingEndereco({ ...editingEndereco, numero: e.target.value })} style={{ width: 80, background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <input placeholder="Bairro" value={editingEndereco.bairro} onChange={e => setEditingEndereco({ ...editingEndereco, bairro: e.target.value })} style={{ width: "100%", background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
                    <input placeholder="Cidade - UF" value={editingEndereco.cidade} onChange={e => setEditingEndereco({ ...editingEndereco, cidade: e.target.value })} style={{ width: "100%", background: "#111", border: "1px solid #262626", borderRadius: 6, padding: "10px 12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 15 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setEditingIdx(null)} style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "10px", color: "#888", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>CANCELAR</button>
                      <button onClick={() => {
                        if (!editingEndereco.rua.trim() || !editingEndereco.numero.trim() || !editingEndereco.bairro.trim() || !editingEndereco.cidade.trim()) return;
                        const updated = [...enderecosSalvos];
                        updated[idx] = { ...editingEndereco };
                        setEnderecosSalvos(updated);
                        // ALTERAÇÃO SOLICITADA: Atualizar no localStorage
                        localStorage.setItem("flame_enderecos", JSON.stringify(updated));
                        if (idx === enderecoAtivoIdx) setEnderecoSalvo(updated[idx]);
                        setEditingIdx(null);
                      }} style={{ flex: 1, background: "#b91c1c", border: "none", borderRadius: 6, padding: "10px", color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>SALVAR</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setEnderecoSalvo(end); setEnderecoAtivoIdx(idx); localStorage.setItem("flame_endereco_ativo", String(idx)); setShowAddressPanel(false); setEditingIdx(null); }} style={{ display: "flex", alignItems: "center", gap: 15, padding: "15px", borderRadius: 8, background: idx === enderecoAtivoIdx ? "#b91c1c12" : "#111", border: `1px solid ${idx === enderecoAtivoIdx ? "#b91c1c44" : "#222"}`, cursor: "pointer", transition: "all 0.2s" }}>
                    <MapPin size={20} color={idx === enderecoAtivoIdx ? "#b91c1c" : "#555"} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{end.rua}, {end.numero}</p>
                      <p style={{ color: "#888", fontSize: 13, margin: 0, marginTop: 4 }}>{end.bairro} · {end.cidade}</p>
                    </div>
                    {idx === enderecoAtivoIdx && <span style={{ background: "#b91c1c", color: "#fff", fontSize: 10, fontWeight: 900, padding: "4px 8px", borderRadius: 4 }}>ATIVO</span>}
                    <button onClick={(e) => { e.stopPropagation(); setEditingIdx(idx); setEditingEndereco({ ...end }); }} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "8px" }}>EDITAR</button>
                  </div>
                )}
              </div>
            ))}
            
            <button onClick={() => { setShowAddressPanel(false); setEditingIdx(null); setShowCepModal(true); }} style={{ width: "100%", background: "none", border: "1px dashed #333", borderRadius: 8, padding: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#888", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 20, transition: "border-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "#555"} onMouseOut={(e) => e.currentTarget.style.borderColor = "#333"}>
              <Plus size={16} /> Adicionar novo endereço
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DE CEP ── */}
      {showCepModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeCepModal(); }}>
          <div className="modal-content custom-scrollbar" style={{ padding: '30px' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, textTransform: "uppercase", fontFamily: "Impact, sans-serif", margin: 0 }}>Taxa de Entrega</h2>
              <button onClick={closeCepModal} style={{ background: "#161616", border: "1px solid #222", color: "#888", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
            </div>
            
            <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Digite seu CEP para calcular a taxa e o tempo estimado de entrega.</p>
            
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input type="tel" placeholder="00000-000" maxLength={9} value={cep}
                onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setCep(v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v); setCepError(""); setCepResult(null); }}
                onKeyDown={e => { if (e.key === "Enter") handleBuscarCep(); }}
                style={{ flex: 1, background: "#0a0a0a", border: `1px solid ${cepError ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "15px", color: "#fff", fontSize: 16, outline: "none", fontFamily: "sans-serif", letterSpacing: "0.05em", boxSizing: "border-box" }} />
              <button onClick={handleBuscarCep} disabled={cepLoading} style={{ background: "#b91c1c", border: "none", color: "#fff", padding: "15px 25px", borderRadius: 8, fontWeight: 900, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: cepLoading ? 0.7 : 1 }}>
                {cepLoading ? "Buscando..." : "BUSCAR"}
              </button>
            </div>
            {cepError && <p style={{ color: "#b91c1c", fontSize: 13, fontWeight: 700, margin: "0 0 15px" }}>{cepError}</p>}

            {cepResult && (
              <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 12, padding: 20 }}>
                <div style={{ borderLeft: "3px solid #b91c1c", paddingLeft: 12, marginBottom: 20 }}>
                  <p style={{ color: "#888", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Confirme seu endereço</p>
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <input placeholder="Rua / Avenida" value={endereco.rua}
                      onChange={e => { setEndereco({ ...endereco, rua: e.target.value }); setEnderecoEditado(true); }}
                      style={{ width: "100%", background: "#111", border: `1px solid ${enderecoEditado && !endereco.rua.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    {enderecoEditado && !endereco.rua.trim() && <p style={{ color: "#b91c1c", fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                  </div>
                  <div style={{ width: 90 }}>
                    <input placeholder="Nº" value={endereco.numero}
                      onChange={e => { setEndereco({ ...endereco, numero: e.target.value }); setEnderecoEditado(true); }}
                      style={{ width: "100%", background: "#111", border: `1px solid ${enderecoEditado && !endereco.numero.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    {enderecoEditado && !endereco.numero.trim() && <p style={{ color: "#b91c1c", fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <input placeholder="Bairro" value={endereco.bairro}
                    onChange={e => { setEndereco({ ...endereco, bairro: e.target.value }); setEnderecoEditado(true); }}
                    style={{ width: "100%", background: "#111", border: `1px solid ${enderecoEditado && !endereco.bairro.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  {enderecoEditado && !endereco.bairro.trim() && <p style={{ color: "#b91c1c", fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <input placeholder="Cidade - UF" value={endereco.cidade}
                    onChange={e => { setEndereco({ ...endereco, cidade: e.target.value }); setEnderecoEditado(true); }}
                    style={{ width: "100%", background: "#111", border: `1px solid ${enderecoEditado && !endereco.cidade.trim() ? "#b91c1c" : "#262626"}`, borderRadius: 8, padding: "12px 15px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  {enderecoEditado && !endereco.cidade.trim() && <p style={{ color: "#b91c1c", fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>Obrigatório</p>}
                </div>

                {endereco.rua.trim() && endereco.numero.trim() && endereco.bairro.trim() && endereco.cidade.trim() && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 20 }}>
                    <div style={{ background: "#111", borderRadius: 8, padding: 15, textAlign: "center", border: "1px solid #222" }}>
                      <p style={{ color: "#666", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 5px" }}>Taxa</p>
                      <p style={{ color: "#b91c1c", fontSize: 24, fontWeight: 900, fontStyle: "italic", margin: 0 }}>R$ 5,00</p>
                    </div>
                    <div style={{ background: "#111", borderRadius: 8, padding: 15, textAlign: "center", border: "1px solid #222" }}>
                      <p style={{ color: "#666", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 5px" }}>Tempo</p>
                      <p style={{ color: "#fff", fontSize: 24, fontWeight: 900, fontStyle: "italic", margin: 0 }}>~30min</p>
                    </div>
                  </div>
                )}

                <button onClick={saveAndClose}
                  style={{ width: "100%", marginTop: 4, background: "#b91c1c", border: "none", color: "#fff", padding: "13px", borderRadius: 8, fontWeight: 900, fontSize: 15, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 20px #b91c1c33" }}>
                  SALVAR ENDEREÇO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Float */}
      <a href="https://wa.me/5519992676339" target="_blank" rel="noopener noreferrer" 
        style={{ 
          position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', 
          padding: '15px', borderRadius: '50%', zIndex: 1000,
          opacity: showWhatsapp ? 1 : 0, transform: showWhatsapp ? "scale(1)" : "scale(0.8)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: showWhatsapp ? "auto" : "none",
          boxShadow: "0 6px 24px rgba(37,211,102,0.45)"
        }}>
        <MessageCircle size={35} color="#fff" />
      </a>
    </main>
  );
}

function DesktopCard({ foto, nome, desc, preco, onAdd }: any) {
  return (
    <div className="burger-card" style={{ backgroundColor: 'rgba(17,17,17,0.95)', padding: '40px 30px', borderRadius: '15px', border: '1px solid #333' }}>
      <div style={{ width: '100%', height: '220px', marginBottom: '20px', overflow: 'hidden', borderRadius: '10px' }}>
        <img className="img-hover" src={foto} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase' }}>{nome}</h3>
      <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '15px', lineHeight: '1.6', minHeight: '45px' }}>{desc}</p>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '20px' }}>R$ {preco.toFixed(2).replace('.', ',')}</div>
      <button className="btn-pedir" onClick={onAdd} style={{ padding: '12px 25px', backgroundColor: 'transparent', border: '2px solid #b91c1c', color: '#fff', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', width: '100%', borderRadius: '5px' }}>PEDIR AGORA</button>
    </div>
  );
}
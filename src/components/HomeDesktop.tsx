"use client";

import React, { useState } from "react";
import { MessageCircle, X, Plus, Minus } from 'lucide-react';
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

  const produtos = [
    { id: "cmmctdp4l0001nsgzj9x6zi5y", nome: "Bacon Handcrafted", desc: "Blend bovino 180g, camadas generosas de queijo cheddar derretido e bacon crocante no pão brioche artesanal.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "cmmcqmzlf0000nsgza56yn8g1", nome: "Smoky Texas Grill", desc: "Hambúrguer grelhado na brasa, bacon rústico, queijo prato e molho especial defumado com toque de ervas.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "cmmcte9zh0002nsgzqh3hoffv", nome: "Double Cheddar Board", desc: "Dois smash burgers, cheddar duplo, cebola caramelizada e acompanhamento de fritas crocantes na tábua.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" }
  ];

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

        .hero-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; background: #b91c1c; color: #fff;
          font-size: 14px; font-weight: 900; font-family: 'Impact', sans-serif;
          text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em;
          border-radius: 4px; border: none; cursor: pointer;
          box-shadow: 0 8px 28px #b91c1c44; transition: all 0.25s;
        }
        .hero-cta-btn:hover { background: #a31515; transform: translateY(-2px); box-shadow: 0 14px 40px #b91c1c66; }
        .hero-cta-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 24px; background: transparent; color: #aaa;
          font-size: 13px; font-weight: 700; font-family: 'Impact', sans-serif;
          text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em;
          border: 1px solid #2a2a2a; border-radius: 4px; transition: all 0.25s;
        }
        .hero-cta-outline:hover { border-color: #b91c1c55; color: #fff; }
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
            <div className="hero-cta" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
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

        {/* Wave desktop */}
        <div style={{ position: 'absolute', bottom: '-1px', left: 0, width: '100%', zIndex: 10, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100px', display: 'block' }}>
            <path fill="#0a0a0a" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* ── CARDÁPIO ── */}
      <section id="cardapio" style={{ padding: '120px 20px 80px', backgroundColor: '#0a0a0a', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <div style={{ position: 'relative', zIndex: 20 }}>
          <span style={{ color: '#fff', fontSize: '18px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nosso</span>
          <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 60px 0' }}>CARDÁPIO</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            {produtos.map((p) => (
              <DesktopCard key={p.id} foto={p.foto} nome={p.nome} desc={p.desc} preco={p.preco} onAdd={() => handleOpenModal(p)} />
            ))}
          </div>
          <div style={{ marginTop: '120px', position: 'relative', top: '-60px' }}>
            <Link href="/cardapio" className="btn-cardapio-completo">VER CARDÁPIO COMPLETO</Link>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {selectedProduct && (
        <div className="modal-overlay">
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

      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', padding: '15px', borderRadius: '50%', zIndex: 1000 }}>
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
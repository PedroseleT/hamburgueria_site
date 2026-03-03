"use client";

import React, { useState } from "react";
import { MessageCircle, X, Plus, Minus, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const produtos = [
    { id: "1", nome: "Bacon Handcrafted", desc: "Blend bovino 180g, camadas generosas de queijo cheddar derretido e bacon crocante no pão brioche artesanal.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "2", nome: "Smoky Texas Grill", desc: "Hambúrguer grelhado na brasa, bacon rústico, queijo prato e molho especial defumado com toque de ervas.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "3", nome: "Double Cheddar Board", desc: "Dois smash burgers, cheddar duplo, cebola caramelizada e acompanhamento de fritas crocantes na tábua.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" }
  ];

  const molhosGratis = [
    { nome: "Ketchup", preco: 0 },
    { nome: "Mostarda", preco: 0 },
    { nome: "Maionese Tradicional", preco: 0 }
  ];

  const molhosCasa = [
    { nome: "Maionese Artesanal 30ml", preco: 3.50 },
    { nome: "Barbecue Defumado 30ml", preco: 4.00 },
    { nome: "Chipotle Picante 30ml", preco: 4.50 }
  ];

  const complementos = [
    { nome: "Hambúrguer Extra 180g", preco: 12.00 },
    { nome: "Bacon em Tiras", preco: 6.00 },
    { nome: "Queijo Cheddar", preco: 5.00 },
    { nome: "Salada Fresca", preco: 3.00 }
  ];

  const handleOpenModal = (p: any) => {
    const isLogged = document.cookie.includes("user_session");
    if (!isLogged) {
      router.push("/login?callback=/"); 
      return;
    }
    setSelectedProduct(p);
    setQuantity(1);
    setCustomOptions([]);
    setObservacao("");
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
    } else if (delta > 0) {
      newOptions.push({ ...item, qtd: 1 });
    }
    setCustomOptions(newOptions);
  };

  const getQtd = (nome: string) => customOptions.find(o => o.nome === nome)?.qtd || 0;

  const handleConfirmAdd = () => {
    const totalAdicionais = customOptions.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);

    addToCart({
      id: `${selectedProduct.id}-${Date.now()}`, 
      name: selectedProduct.nome,
      price: selectedProduct.preco + totalAdicionais,
      image: selectedProduct.foto,
      quantity: quantity,
      customization: {
        extras: customOptions.map(o => `${o.qtd}x ${o.nome}`),
        obs: observacao
      }
    });
    
    setSelectedProduct(null);
    router.push("/carrinho");
  };

  return (
    <main className="main-container" style={mainStyle}>
      <div className="flame-overlay"></div>

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
        .burger-card:hover { transform: translateY(-10px); border-color: #b91c1c !important; box-shadow: 0 10px 30px rgba(185, 28, 28, 0.2); }
        .burger-card:hover .img-hover { transform: scale(1.1); }
        .btn-pedir { transition: all 0.3s ease; }
        .btn-pedir:hover { background-color: #b91c1c !important; color: #fff !important; }

        @media (max-width: 768px) {
          .hero-section { height: 85vh !important; background-image: url("/design_mobile.jpg") !important; }
          .hero-content { justify-content: center !important; padding: 0 !important; bottom: 20px !important; position: absolute !important; width: 100% !important; }
          .hero-text { text-align: center !important; }
          .hero-text h1 { font-size: 32px !important; }
          .hero-text p { display: none !important; }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-section relative overflow-hidden flex flex-col justify-center" style={heroSectionStyle}>
        <div className="hero-content" style={heroContentStyle}>
          <div className="hero-text" style={{ textAlign: 'right', maxWidth: '600px', position: 'relative', zIndex: 30 }}>
            <h1 style={heroTitleStyle}>O BRASIL EM<br />CADA MORDIDA</h1>
            <p style={heroSubtitleStyle}>The Flame Grill</p>
          </div>
        </div>

        {/* EFEITO DE MORDIDA REALISTA COM TRANSIÇÃO NATURAL (SOMENTE MOBILE) */}
        <div className="hidden max-[768px]:block absolute bottom-0 left-0 w-full z-10 pointer-events-none leading-[0]">
          <svg viewBox="0 0 1440 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[120px]">
            <defs>
              <filter id="inner-shadow">
                <feOffset dx="0" dy="8" />
                <feGaussianBlur stdDeviation="5" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="black" floodOpacity="0.8" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>
            </defs>
            {/* O preenchimento fill="#0a0a0a" garante que a mordida revele o fundo preto da próxima seção */}
            <path d="M0,0 L0,50 C100,45 150,110 220,105 C260,102 280,75 320,75 C360,75 380,105 420,105 C490,105 540,40 640,45 C740,50 790,115 860,110 C900,107 920,80 960,80 C1000,80 1020,110 1060,110 C1130,110 1180,45 1280,50 C1380,55 1440,30 1440,30 L1440,150 L0,150 Z" fill="#0a0a0a" filter="url(#inner-shadow)" />
          </svg>
        </div>

        {/* DIVISOR DE ONDA COM TRANSIÇÃO NATURAL (DESKTOP) */}
        <div className="max-[768px]:hidden" style={divisorOndaStyle}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100px', display: 'block' }}>
            {/* O fill="#0a0a0a" conecta perfeitamente a hero com o fundo preto do cardápio */}
            <path fill="#0a0a0a" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* SEÇÃO CARDÁPIO COM FUNDO PRETO LISO */}
      <section id="cardapio" style={sectionCardapioStyle}>
        <div style={{ position: 'relative', zIndex: 20 }}>
          <span style={{ color: '#fff', fontSize: '18px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nosso</span>
          <h2 style={{ fontSize: '60px', fontWeight: '900', color: '#b91c1c', margin: '0 0 60px 0' }}>CARDÁPIO</h2>
          <div className="cardapio-grid" style={gridStyle}>
            {produtos.map((p) => (
              <Card key={p.id} foto={p.foto} nome={p.nome} desc={p.desc} preco={p.preco} onAdd={() => handleOpenModal(p)} />
            ))}
          </div>
          <div style={{ marginTop: '120px', position: 'relative', top: '-60px' }}>
            <Link href="/cardapio" className="btn-cardapio-completo">VER CARDÁPIO COMPLETO</Link>
          </div>
        </div>
      </section>

      {/* MODAL E OUTROS COMPONENTES PERMANECEM IGUAIS */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content custom-scrollbar">
            <button style={closeBtn} onClick={() => setSelectedProduct(null)} aria-label="Fechar"><X size={20} /></button>
            <img src={selectedProduct.foto} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '5px' }}>{selectedProduct.nome}</h2>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>{selectedProduct.desc}</p>
              {[
                { title: "MOLHOS (GRÁTIS)", items: molhosGratis },
                { title: "MOLHOS DA CASA", items: molhosCasa },
                { title: "ADICIONAIS", items: complementos }
              ].map(section => (
                <div key={section.title} style={modalSection}>
                  <h4 style={sectionTitle}>{section.title} <small style={{float:'right', color:'#888'}}>Limite: 5</small></h4>
                  {section.items.map(item => (
                    <div key={item.nome} style={optionRow}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{fontWeight: 'bold'}}>{item.nome}</span>
                        {item.preco > 0 && <span style={{color: '#b91c1c', fontSize: '12px', fontWeight: 'bold'}}>+ R$ {item.preco.toFixed(2).replace('.',',')}</span>}
                      </div>
                      <div style={counterContainer}>
                        <button onClick={() => updateOptionQtd(item, -1, 5, section.items)} style={miniBtn}><Minus size={14}/></button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{getQtd(item.nome)}</span>
                        <button onClick={() => updateOptionQtd(item, 1, 5, section.items)} style={miniBtn}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={modalSection}>
                <h4 style={sectionTitle}>OBSERVAÇÕES</h4>
                <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: Ponto da carne, sem cebola..." style={textareaStyle} />
              </div>
              <div style={footerModal}>
                <div style={qtyContainer}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={qtyBtn}><Minus size={16}/></button>
                  <span style={{ fontWeight: 'bold' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={qtyBtn}><Plus size={16}/></button>
                </div>
                <button onClick={handleConfirmAdd} className="btn-confirmar">
                  ADICIONAR R$ {((selectedProduct.preco + customOptions.reduce((a,c)=>a+(c.preco*c.qtd),0)) * quantity).toFixed(2).replace('.',',')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={whatsappFloat}>
        <MessageCircle size={35} color="#fff" />
      </a>
    </main>
  );
}

function Card({ foto, nome, desc, preco, onAdd }: any) {
  return (
    <div className="burger-card" style={cardContainerStyle}>
      <div style={imgWrapperStyle}>
        <img className="img-hover" src={foto} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} />
      </div>
      <h3 style={cardTitleStyle}>{nome}</h3>
      <p style={cardDescStyle}>{desc}</p>
      <div style={cardPriceStyle}>R$ {preco.toFixed(2).replace('.', ',')}</div>
      <button className="btn-pedir" onClick={onAdd} style={cardBtnStyle}>PEDIR AGORA</button>
    </div>
  );
}

// ESTILOS COM FOCO NA TRANSIÇÃO PROFISSIONAL
const mainStyle: React.CSSProperties = { margin: 0, padding: 0, paddingTop: '80px', backgroundColor: '#0a0a0a', minHeight: '100vh', width: '100%', color: '#fff', position: 'relative' };
const heroSectionStyle: React.CSSProperties = { position: 'relative', height: '90vh', width: '100%', display: 'flex', alignItems: 'center', backgroundImage: 'url("/burger-destaque.jpg")', backgroundSize: 'cover', backgroundPosition: 'left 60%', overflow: 'visible', zIndex: 5 };
const heroContentStyle: React.CSSProperties = { width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '8%', position: 'relative', zIndex: 15 };
const heroTitleStyle: React.CSSProperties = { fontSize: 'clamp(40px, 7vw, 90px)', lineHeight: '0.85', fontWeight: '900', textTransform: 'uppercase', fontFamily: 'Impact, sans-serif', textShadow: '3px 3px 15px rgba(0,0,0,0.8)' };
const heroSubtitleStyle: React.CSSProperties = { marginTop: '15px', fontSize: '28px', fontFamily: '"Brush Script MT", cursive', color: '#eee' };
const divisorOndaStyle: React.CSSProperties = { position: 'absolute', bottom: '-1px', left: 0, width: '100%', zIndex: 10, lineHeight: 0 };

// CUSTOMIZAÇÃO DA SEÇÃO DO CARDÁPIO: Fundo preto sólido para conexão direta com os divisores
const sectionCardapioStyle: React.CSSProperties = { 
  padding: '120px 20px 80px', 
  backgroundColor: '#0a0a0a', // Fundo preto sólido para transição perfeita
  textAlign: 'center', 
  position: 'relative', 
  zIndex: 5 
};

const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' };
const cardContainerStyle: React.CSSProperties = { backgroundColor: 'rgba(17, 17, 17, 0.95)', padding: '40px 30px', borderRadius: '15px', border: '1px solid #333' };
const imgWrapperStyle: React.CSSProperties = { width: '100%', height: '220px', marginBottom: '20px', overflow: 'hidden', borderRadius: '10px' };
const cardTitleStyle: React.CSSProperties = { fontSize: '24px', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase' };
const cardDescStyle: React.CSSProperties = { fontSize: '14px', color: '#ccc', marginBottom: '15px', lineHeight: '1.6', minHeight: '45px' };
const cardPriceStyle: React.CSSProperties = { fontSize: '22px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '20px' };
const cardBtnStyle: React.CSSProperties = { padding: '12px 25px', backgroundColor: 'transparent', border: '2px solid #b91c1c', color: '#fff', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', width: '100%', borderRadius: '5px' };
const whatsappFloat: React.CSSProperties = { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25d366', padding: '15px', borderRadius: '50%', zIndex: 1000 };
const closeBtn: React.CSSProperties = { position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalSection: React.CSSProperties = { marginBottom: '20px', textAlign: 'left' };
const sectionTitle: React.CSSProperties = { fontSize: '12px', borderLeft: '3px solid #b91c1c', paddingLeft: '10px', marginBottom: '15px', fontWeight: 'bold' };
const optionRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #222', fontSize: '14px' };
const counterContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', background: '#000', padding: '5px 12px', borderRadius: '20px', border: '1px solid #333' };
const miniBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const textareaStyle: React.CSSProperties = { width: '100%', background: '#000', border: '1px solid #333', borderRadius: '5px', padding: '10px', color: '#fff', fontSize: '12px', height: '60px' };
const footerModal: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #222', paddingTop: '15px' };
const qtyContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', background: '#000', padding: '8px 15px', borderRadius: '8px' };
const qtyBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' };


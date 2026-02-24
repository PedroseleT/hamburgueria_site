"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, Edit2, X, ArrowLeft } from "lucide-react";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity, updateItemCustomization } = useCart();
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempOptions, setTempOptions] = useState<any[]>([]);
  const [obsEdit, setObsEdit] = useState("");

  const baseOptions = {
    molhosGratis: [
      { nome: "Ketchup", preco: 0 },
      { nome: "Mostarda", preco: 0 },
      { nome: "Maionese Tradicional", preco: 0 }
    ],
    molhosCasa: [
      { nome: "Maionese Artesanal 30ml", preco: 3.50 },
      { nome: "Barbecue Defumado 30ml", preco: 4.00 },
      { nome: "Chipotle Picante 30ml", preco: 4.50 }
    ],
    complementos: [
      { nome: "Hambúrguer Extra 180g", preco: 12.00 },
      { nome: "Bacon em Tiras", preco: 6.00 },
      { nome: "Queijo Cheddar", preco: 5.00 },
      { nome: "Salada Fresca", preco: 3.00 }
    ]
  };

  const totalGeral = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setObsEdit(item.customization?.obs || "");
    const recuperados: any[] = [];
    const todosDisponiveis = [...baseOptions.molhosGratis, ...baseOptions.molhosCasa, ...baseOptions.complementos];

    if (item.customization?.extras) {
      item.customization.extras.forEach((extraStr: string) => {
        const match = extraStr.match(/^(\d+)x\s(.+)$/);
        if (match) {
          const qtd = parseInt(match[1]);
          const nomeNoCarrinho = match[2].trim();
          const infoOriginal = todosDisponiveis.find(opt => opt.nome.trim() === nomeNoCarrinho);
          if (infoOriginal) recuperados.push({ ...infoOriginal, qtd });
        }
      });
    }
    setTempOptions(recuperados);
  };

  const updateTempQtd = (item: any, delta: number, limit: number, sectionItems: any[]) => {
    const currentInSection = tempOptions.filter(opt => sectionItems.some(s => s.nome === opt.nome));
    const totalInSection = currentInSection.reduce((acc, curr) => acc + curr.qtd, 0);
    const existingIndex = tempOptions.findIndex(opt => opt.nome === item.nome);
    if (delta > 0 && totalInSection >= limit) return;
    let newOptions = [...tempOptions];
    if (existingIndex > -1) {
      const newQtd = newOptions[existingIndex].qtd + delta;
      if (newQtd <= 0) newOptions.splice(existingIndex, 1);
      else newOptions[existingIndex].qtd = newQtd;
    } else if (delta > 0) {
      newOptions.push({ ...item, qtd: 1 });
    }
    setTempOptions(newOptions);
  };

  const getQtd = (nome: string) => tempOptions.find(o => o.nome === nome)?.qtd || 0;

  const handleSaveEdit = () => {
    const precoAdicionais = tempOptions.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);
    const precoBaseOriginal = 38.90; 
    updateItemCustomization(editingItem.id, {
      extras: tempOptions.map(o => `${o.qtd}x ${o.nome}`),
      obs: obsEdit
    }, precoBaseOriginal + precoAdicionais);
    setEditingItem(null);
  };

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", paddingTop: '80px' }}>
      <style jsx global>{`
        @media (max-width: 600px) {
          .cart-item { flex-direction: column !important; align-items: flex-start !important; }
          .cart-item img { width: 100% !important; height: 150px !important; }
          .qty-row { width: 100% !important; justify-content: space-between !important; margin-top: 15px !important; }
        }
      `}</style>

      <section style={headerSection}>
        <span style={subtitleStyle}>Meu</span>
        <h1 style={titleStyle}>CARRINHO</h1>
      </section>

      <section style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: '50px' }}>
            <p style={{ color: '#888', marginBottom: '20px' }}>Seu carrinho está vazio.</p>
            <Link href="/" style={btnVoltar}>VOLTAR AO CARDÁPIO</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {cart.map((item) => (
              <div key={item.id} className="cart-item" style={cartItemStyle}>
                <img src={item.image} alt={item.name} style={thumbStyle} />
                
                <div style={{ flex: 1, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: '900' }}>{item.name}</h3>
                      <button onClick={() => handleEditClick(item)} style={editBtnSmall}><Edit2 size={12}/> Editar</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={deleteBtn}><Trash2 size={20}/></button>
                  </div>
                  
                  <div style={customizationDetails}>
                    {item.customization?.extras?.map((ex: string, i: number) => (
                      <span key={i} style={tagStyle}>{ex}</span>
                    ))}
                    {item.customization?.obs && <p style={obsItem}>"{item.customization.obs}"</p>}
                  </div>

                  <div className="qty-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <p style={{ color: "#b91c1c", fontWeight: "bold", fontSize: '20px', margin: 0 }}>
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                    
                    <div style={qtyControls}>
                      <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)} style={qtyBtn}>
                        <Minus size={14}/>
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}>
                        <Plus size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={resumoStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "24px", fontWeight: "900" }}>
                <span>TOTAL:</span>
                <span style={{ color: "#b91c1c" }}>R$ {totalGeral.toFixed(2).replace('.', ',')}</span>
              </div>
              <button style={checkoutBtn}>FINALIZAR PEDIDO NO WHATSAPP</button>
              <Link href="/" style={btnKeepShopping}><ArrowLeft size={16}/> Continuar Comprando</Link>
            </div>
          </div>
        )}
      </section>

      {editingItem && (
        <div style={modalOverlayStyles}>
          <div className="modal-content custom-scrollbar" style={modalContentStyles}>
            <button onClick={() => setEditingItem(null)} style={closeBtnStyles}><X size={24} /></button>
            <div style={{ padding: '25px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '20px' }}>EDITAR COMPLEMENTOS</h2>
              {[
                { title: "MOLHOS (GRÁTIS)", items: baseOptions.molhosGratis },
                { title: "MOLHOS DA CASA", items: baseOptions.molhosCasa },
                { title: "COMPLEMENTOS", items: baseOptions.complementos }
              ].map(section => (
                <div key={section.title} style={modalSectionStyles}>
                  <h4 style={sectionTitleStyles}>{section.title} <small style={{float:'right', color:'#888'}}>Limite: 5</small></h4>
                  {section.items.map(item => (
                    <div key={item.nome} style={optionRowStyles}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.nome}</span>
                        {item.preco > 0 && <span style={{ color: '#b91c1c', fontSize: '13px' }}>+ R$ {item.preco.toFixed(2).replace('.',',')}</span>}
                      </div>
                      <div style={counterContainer}>
                        <button onClick={() => updateTempQtd(item, -1, 5, section.items)} style={miniBtn}><Minus size={14}/></button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{getQtd(item.nome)}</span>
                        <button onClick={() => updateTempQtd(item, 1, 5, section.items)} style={miniBtn}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={modalSectionStyles}>
                <h4 style={sectionTitleStyles}>OBSERVAÇÕES</h4>
                <textarea value={obsEdit} onChange={(e) => setObsEdit(e.target.value)} style={textareaStyles} />
              </div>
            </div>
            <div style={footerModalStyles}>
               <button onClick={handleSaveEdit} style={confirmBtnStyles}>SALVAR ALTERAÇÕES</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Estilos otimizados para responsividade
const headerSection: React.CSSProperties = { height: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/banner-fome.jpg')", backgroundSize: "cover" };
const subtitleStyle: React.CSSProperties = { color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px' };
const titleStyle: React.CSSProperties = { fontSize: '45px', fontWeight: '900', color: '#b91c1c' };
const cartItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "20px", background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #222", overflow: 'hidden' };
const thumbStyle: React.CSSProperties = { width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" };
const editBtnSmall: React.CSSProperties = { background: '#222', border: 'none', color: '#888', fontSize: '11px', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' };
const tagStyle: React.CSSProperties = { fontSize: '11px', background: '#000', padding: '2px 8px', borderRadius: '4px', color: '#888', border: '1px solid #333', marginRight: '5px', display: 'inline-block', marginBottom: '5px' };
const customizationDetails: React.CSSProperties = { margin: '12px 0' };
const obsItem: React.CSSProperties = { fontSize: '12px', color: '#b91c1c', fontStyle: 'italic', margin: '5px 0' };
const qtyControls: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", background: "#000", padding: "6px 12px", borderRadius: "8px", border: '1px solid #222' };
const qtyBtn: React.CSSProperties = { background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: 'flex', alignItems: 'center' };
const deleteBtn: React.CSSProperties = { background: "none", border: "none", color: "#444", cursor: "pointer" };
const resumoStyle: React.CSSProperties = { marginTop: "30px", padding: "30px", background: "#111", borderRadius: "20px", border: '2px solid #b91c1c' };
const checkoutBtn: React.CSSProperties = { width: '100%', padding: '20px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '20px', cursor: 'pointer' };
const btnVoltar: React.CSSProperties = { color: '#fff', background: '#b91c1c', padding: '12px 25px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' };
const btnKeepShopping: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#888', textDecoration: 'none', marginTop: '15px', fontSize: '14px' };
const modalOverlayStyles: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', backdropFilter: 'blur(5px)' };
const modalContentStyles: React.CSSProperties = { backgroundColor: '#111', width: '100%', maxWidth: '480px', maxHeight: '85vh', borderRadius: '20px', overflowY: 'auto', border: '1px solid #333', position: 'relative' };
const closeBtnStyles: React.CSSProperties = { position: 'absolute', top: '15px', right: '15px', background: '#000', border: 'none', color: '#fff', cursor: 'pointer', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalSectionStyles: React.CSSProperties = { marginBottom: '25px' };
const sectionTitleStyles: React.CSSProperties = { fontSize: '13px', color: '#fff', borderLeft: '4px solid #b91c1c', paddingLeft: '10px', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' };
const optionRowStyles: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #222' };
const counterContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', background: '#000', padding: '5px 12px', borderRadius: '20px', border: '1px solid #333' };
const miniBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' };
const textareaStyles: React.CSSProperties = { width: '100%', backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px', padding: '12px', color: '#fff', height: '70px', resize: 'none' };
const footerModalStyles: React.CSSProperties = { position: 'sticky', bottom: 0, backgroundColor: '#111', padding: '20px', borderTop: '1px solid #333' };
const confirmBtnStyles: React.CSSProperties = { backgroundColor: '#b91c1c', border: 'none', color: '#fff', fontWeight: 'bold', padding: '16px', borderRadius: '12px', cursor: 'pointer', width: '100%' };
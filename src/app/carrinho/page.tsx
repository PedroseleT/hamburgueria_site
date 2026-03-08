"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, Edit2, X, ArrowLeft, Loader2, Flame, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity, updateItemCustomization, createOrder } = useCart();
  const router = useRouter();
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempOptions, setTempOptions] = useState<any[]>([]);
  const [obsEdit, setObsEdit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64: string, qrCode: string, paymentId: string } | null>(null);
  const [pixStatus, setPixStatus] = useState<string>("pendente");
  const [copied, setCopied] = useState(false);

  const baseOptions = {
    molhosGratis: [{ nome: "Ketchup", preco: 0 }, { nome: "Mostarda", preco: 0 }, { nome: "Maionese Tradicional", preco: 0 }],
    molhosCasa: [{ nome: "Maionese Artesanal 30ml", preco: 3.50 }, { nome: "Barbecue Defumado 30ml", preco: 4.00 }, { nome: "Chipotle Picante 30ml", preco: 4.50 }],
    complementos: [{ nome: "Hambúrguer Extra 180g", preco: 12.00 }, { nome: "Bacon em Tiras", preco: 6.00 }, { nome: "Queijo Cheddar", preco: 5.00 }, { nome: "Salada Fresca", preco: 3.00 }]
  };

  const totalGeral = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // # ALTERAÇÃO: RECUPERAÇÃO DE PIX (Se o cliente fechou o navegador para ir pro app do banco)
  useEffect(() => {
    const savedPixId = localStorage.getItem("pedro-burger-pix-id");
    if (savedPixId) {
      setShowPaymentModal(true);
      setPixStatus("pendente");

      const interval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/checkout/pix?id=${savedPixId}`);
          const checkData = await checkRes.json();
          
          if (checkData.status === "approved") {
            clearInterval(interval);
            setPixStatus("aprovado");
            localStorage.removeItem("pedro-burger-pix-id"); // Limpa da memória pois já foi pago
            
            const restaurantId = "cmmcpmk4q000087yw0dvvdonb"; 
            const realUserId = (checkData as any).external_reference; // Evita erro de tipagem
            
            await createOrder("PIX", `MercadoPago: ${savedPixId}`, restaurantId, realUserId);
            
            setTimeout(() => { router.push("/my-orders"); }, 3000);
          } else if (checkData.status === "cancelled" || checkData.status === "rejected") {
            clearInterval(interval);
            localStorage.removeItem("pedro-burger-pix-id");
            setShowPaymentModal(false);
          }
        } catch (e) {
          console.error("Erro ao verificar PIX recuperado:", e);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [createOrder, router]);

  const handleCopyPix = async () => {
    if (!pixData) return;
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = pixData.qrCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) { console.error("Erro ao copiar", e); }
      document.body.removeChild(textArea);
    }
  };

  const processPixPayment = async () => {
    setShowPaymentModal(false); 
    if (cart.length === 0) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout/pix", {
        method: "POST",
        body: JSON.stringify({ items: cart, total: totalGeral }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

      setPixData({ qrCodeBase64: data.qr_code_base64, qrCode: data.qr_code, paymentId: data.payment_id });
      setPixStatus("pendente");
      
      // # ALTERAÇÃO: Salva o ID do PIX na memória para o caso da janela fechar
      localStorage.setItem("pedro-burger-pix-id", data.payment_id);

      const interval = setInterval(async () => {
        const checkRes = await fetch(`/api/checkout/pix?id=${data.payment_id}`);
        const checkData = await checkRes.json();
        
        if (checkData.status === "approved") {
          clearInterval(interval);
          setPixStatus("aprovado");
          localStorage.removeItem("pedro-burger-pix-id"); // Limpa ao aprovar
          
          const restaurantId = "cmmcpmk4q000087yw0dvvdonb"; 
          const realUserId = (checkData as any).external_reference; // Evita erro de tipagem
          
          await createOrder("PIX", `MercadoPago: ${data.payment_id}`, restaurantId, realUserId);
          
          setTimeout(() => { router.push("/my-orders"); }, 3000);
        }
      }, 5000);

      setTimeout(() => {
        clearInterval(interval);
        localStorage.removeItem("pedro-burger-pix-id"); // Limpa se demorar muito (expirou)
      }, 5 * 60 * 1000);

    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    updateItemCustomization(editingItem.id, {
      extras: tempOptions.map(o => `${o.qtd}x ${o.nome}`),
      obs: obsEdit
    }, editingItem.price);
    setEditingItem(null);
  };

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", paddingTop: 0, fontFamily: "'Oswald', sans-serif" }}>
      <style jsx global>{`
        @media (max-width: 600px) {
          .cart-item { flex-direction: column !important; align-items: flex-start !important; }
          .cart-item img { width: 100% !important; height: 180px !important; margin-bottom: 15px; }
          .qty-row { width: 100% !important; justify-content: space-between !important; margin-top: 15px !important; }
        }

        .pix-responsive-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .pix-qr-container {
          background: #fff;
          padding: 15px;
          border-radius: 12px;
          display: inline-block;
        }
        .pix-text-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        @media (min-width: 768px) {
          .pix-responsive-layout {
            flex-direction: row;
            align-items: flex-start;
            text-align: left;
          }
          .pix-text-section {
            flex: 1;
          }
        }
      `}</style>

      <section style={headerSection}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={subtitleStyle}>Meu</span>
          <h1 style={titleStyle}>CARRINHO</h1>
          <div style={{ height: '3px', width: '60px', background: '#b91c1c', margin: '10px auto', borderRadius: '2px' }} />
        </div>
      </section>

      <section style={{ maxWidth: "850px", margin: "40px auto", padding: "0 20px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: '50px', marginBottom: '100px', padding: '60px', background: '#111', borderRadius: '20px', border: '1px dashed #333' }}>
            <p style={{ color: '#555', marginBottom: '30px', fontWeight: 'bold', letterSpacing: '2px' }}>A BRASA ESTÁ FRIA. SEU CARRINHO ESTÁ VAZIO.</p>
            <Link href="/cardapio" style={btnVoltar}>ACENDER O FOGO</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {cart.map((item) => (
              <div key={item.id} className="cart-item" style={cartItemStyle}>
                <img src={item.image} alt={item.name} style={thumbStyle} />
                
                <div style={{ flex: 1, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "22px", fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' }}>{item.name}</h3>
                      <button onClick={() => handleEditClick(item)} style={editBtnSmall}><Edit2 size={12}/> Ajustar Ingredientes</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={deleteBtn}><Trash2 size={20}/></button>
                  </div>
                  
                  <div style={customizationDetails}>
                    {item.customization?.extras?.map((ex: string, i: number) => (
                      <span key={i} style={tagStyle}>{ex}</span>
                    ))}
                    {item.customization?.obs && (
                      <div style={{ marginTop: '8px', borderLeft: '2px solid #b91c1c', paddingLeft: '8px' }}>
                        <p style={obsItem}>"{item.customization.obs}"</p>
                      </div>
                    )}
                  </div>

                  <div className="qty-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px' }}>
                    <p style={{ color: "#fff", fontWeight: "900", fontSize: '24px', margin: 0, fontStyle: 'italic' }}>
                      <span style={{ fontSize: '14px', color: '#b91c1c', marginRight: '4px', fontStyle: 'normal' }}>R$</span>
                      {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                    
                    <div style={qtyControls}>
                      <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)} style={qtyBtn}>
                        <Minus size={16}/>
                      </button>
                      <span style={{ fontWeight: '900', minWidth: '30px', textAlign: 'center', fontSize: '18px' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}>
                        <Plus size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={resumoStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'baseline' }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: '#555' }}>SUBTOTAL DO PEDIDO:</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: "#fff", fontSize: "36px", fontWeight: "900", fontStyle: 'italic' }}>
                    <span style={{ fontSize: '18px', color: '#b91c1c', fontStyle: 'normal', marginRight: '8px' }}>R$</span>
                    {totalGeral.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div style={errorContainer}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <button 
                onClick={() => setShowPaymentModal(true)} 
                disabled={isSubmitting}
                style={{
                  ...checkoutBtn,
                  background: isSubmitting ? "#222" : "#b91c1c",
                  boxShadow: isSubmitting ? "none" : "0 10px 40px rgba(185,28,28,0.3)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    ENVIANDO PARA A GRELHA...
                  </>
                ) : (
                  <>
                    <Flame size={20} />
                    FINALIZAR PEDIDO
                  </>
                )}
              </button>

              <Link href="/cardapio" style={btnKeepShopping}><ArrowLeft size={16}/> Escolher mais delícias</Link>
            </div>
          </div>
        )}
      </section>

      {editingItem && (
        <div style={modalOverlayStyles}>
          <div className="modal-content" style={modalContentStyles}>
            <button onClick={() => setEditingItem(null)} style={closeBtnStyles}><X size={20} /></button>
            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', marginBottom: '5px', fontStyle: 'italic' }}>EDITAR COMPLEMENTOS</h2>
              <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                {[
                  { title: "MOLHOS (GRÁTIS)", items: baseOptions.molhosGratis },
                  { title: "MOLHOS DA CASA", items: baseOptions.molhosCasa },
                  { title: "COMPLEMENTOS", items: baseOptions.complementos }
                ].map(section => (
                  <div key={section.title} style={modalSectionStyles}>
                    <h4 style={sectionTitleStyles}>{section.title}</h4>
                    {section.items.map(item => (
                      <div key={item.nome} style={optionRowStyles}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#eee' }}>{item.nome}</span>
                          {item.preco > 0 && <span style={{ color: '#b91c1c', fontSize: '13px', fontWeight: 'bold' }}>+ R$ {item.preco.toFixed(2).replace('.',',')}</span>}
                        </div>
                        <div style={counterContainer}>
                          <button onClick={() => updateTempQtd(item, -1, 5, section.items)} style={miniBtn}><Minus size={14}/></button>
                          <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{getQtd(item.nome)}</span>
                          <button onClick={() => updateTempQtd(item, 1, 5, section.items)} style={miniBtn}><Plus size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={modalSectionStyles}>
                  <h4 style={sectionTitleStyles}>RECOMENDAÇÕES À COZINHA</h4>
                  <textarea placeholder="Ex: Tirar cebola, ponto da carne..." value={obsEdit} onChange={(e) => setObsEdit(e.target.value)} style={textareaStyles} />
                </div>
              </div>
            </div>
            <div style={footerModalStyles}>
                <button onClick={handleSaveEdit} style={confirmBtnStyles}>CONFIRMAR ALTERAÇÕES</button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div style={modalOverlayStyles} onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}>
          <div className="modal-content" style={{ ...modalContentStyles, padding: '30px' }}>
            <button onClick={() => setShowPaymentModal(false)} style={closeBtnStyles}><X size={20} /></button>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', fontStyle: 'italic', marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase' }}>
              Formas de Pagamento
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                onClick={processPixPayment}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px', background: '#111', border: '1px solid #32BCAD', borderRadius: '12px',
                  cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: '#32BCAD22', padding: '10px', borderRadius: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.32625 5.50361C7.26555 4.56431 8.7885 4.56431 9.72781 5.50361L12.001 7.77684L14.2742 5.50361C15.2135 4.56431 16.7365 4.56431 17.6758 5.50361C18.6151 6.44292 18.6151 7.96587 17.6758 8.90517L15.4025 11.1784L17.6758 13.4516C18.6151 14.3909 18.6151 15.9139 17.6758 16.8532C16.7365 17.7925 15.2135 17.7925 14.2742 16.8532L12.001 14.58L9.72781 16.8532C8.7885 17.7925 7.26555 17.7925 6.32625 16.8532C5.38694 15.9139 5.38694 14.3909 6.32625 13.4516L8.59948 11.1784L6.32625 8.90517C5.38694 7.96587 5.38694 6.44292 6.32625 5.50361Z" fill="#32BCAD"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>PIX (Mercado Pago)</span>
                    <span style={{ color: '#888', fontSize: '12px' }}>Aprovação imediata</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {pixData && (
        <div style={modalOverlayStyles} onClick={(e) => { if (e.target === e.currentTarget && pixStatus !== 'aprovado') setPixData(null); }}>
          <div className="modal-content" style={{ ...modalContentStyles, padding: '40px', textAlign: 'center', maxWidth: '650px' }}>
            <h2 style={{ 
              fontSize: '28px', fontWeight: '900', fontStyle: 'italic', marginBottom: '10px',
              color: pixStatus === "aprovado" ? '#22c55e' : '#b91c1c'
            }}>
              {pixStatus === "aprovado" ? "PAGAMENTO APROVADO! 🔥" : "PAGUE VIA PIX"}
            </h2>
            
            {pixStatus === "pendente" ? (
              <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Escaneie o QR Code ou use o botão Copia e Cola.</p>
                
                <div className="pix-responsive-layout">
                  <div className="pix-qr-container">
                    <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" style={{ width: '200px', height: '200px', display: 'block' }} />
                  </div>
                  
                  <div className="pix-text-section">
                    <div className="custom-scrollbar" style={{ background: '#111', border: '1px solid #333', padding: '15px', borderRadius: '8px', wordBreak: 'break-all', fontSize: '12px', color: '#aaa', maxHeight: '100px', overflowY: 'auto' }}>
                      {pixData.qrCode}
                    </div>
                    
                    <button 
                      onClick={handleCopyPix} 
                      style={{ 
                        ...confirmBtnStyles, 
                        fontSize: '14px', 
                        padding: '16px',
                        background: copied ? '#22c55e' : '#b91c1c',
                        boxShadow: copied ? '0 4px 15px rgba(34, 197, 94, 0.3)' : '0 4px 15px rgba(185, 28, 28, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {copied ? "✅ CÓDIGO COPIADO!" : "📋 COPIAR CÓDIGO PIX"}
                    </button>
                    
                    <button onClick={() => setPixData(null)} style={{ background: 'transparent', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold', width: '100%', padding: '10px' }}>
                      Cancelar e voltar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ width: '90px', height: '90px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)' }}>
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase' }}>Tudo certo!</h3>
                <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '35px', textAlign: 'center', maxWidth: '85%', lineHeight: '1.5' }}>
                  Recebemos o seu pagamento. Seu pedido já está na grelha sendo preparado pela nossa equipe!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c', fontWeight: 'bold', background: '#111', padding: '12px 24px', borderRadius: '30px', border: '1px solid #222' }}>
                  <Loader2 className="animate-spin" size={18} />
                  <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Redirecionando...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// Estilos
const headerSection: React.CSSProperties = { height: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: 'relative', overflow: 'hidden', borderBottom: '1px solid #1a1a1a' };
const subtitleStyle: React.CSSProperties = { color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '6px', fontWeight: 'bold' };
const titleStyle: React.CSSProperties = { fontSize: '60px', fontWeight: '900', color: '#fff', fontStyle: 'italic', lineHeight: '1', margin: '5px 0' };
const cartItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "25px", background: "#0f0f0f", padding: "25px", borderRadius: "20px", border: "1px solid #1a1a1a", boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const thumbStyle: React.CSSProperties = { width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px", border: '1px solid #222' };
const editBtnSmall: React.CSSProperties = { background: '#1a1a1a', border: '1px solid #333', color: '#888', fontSize: '10px', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontWeight: 'bold', textTransform: 'uppercase' };
const tagStyle: React.CSSProperties = { fontSize: '10px', background: 'rgba(185,28,28,0.1)', padding: '4px 10px', borderRadius: '4px', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.2)', marginRight: '6px', display: 'inline-block', marginBottom: '6px', fontWeight: 'bold' };
const customizationDetails: React.CSSProperties = { margin: '15px 0' };
const obsItem: React.CSSProperties = { fontSize: '12px', color: '#888', fontStyle: 'italic', margin: '5px 0' };
const qtyControls: React.CSSProperties = { display: "flex", alignItems: "center", gap: "15px", background: "#000", padding: "8px 16px", borderRadius: "10px", border: '1px solid #222' };
const qtyBtn: React.CSSProperties = { background: "none", border: "none", color: "#b91c1c", cursor: "pointer", display: 'flex', alignItems: 'center' };
const deleteBtn: React.CSSProperties = { background: "#1a1a1a", border: "none", color: "#333", cursor: "pointer", padding: '10px', borderRadius: '50%' };
const resumoStyle: React.CSSProperties = { marginTop: "20px", padding: "40px", background: "#0f0f0f", borderRadius: "24px", border: '1px solid #b91c1c44', boxShadow: '0 20px 50px rgba(185,28,28,0.1)' };
const checkoutBtn: React.CSSProperties = { width: '100%', padding: '22px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '18px', marginTop: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', textTransform: 'uppercase', fontStyle: 'italic' };
const btnVoltar: React.CSSProperties = { color: '#fff', background: '#b91c1c', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900', display: 'inline-block', fontSize: '14px' };
const btnKeepShopping: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#444', textDecoration: 'none', marginTop: '20px', fontSize: '12px', fontWeight: 'bold' };
const modalOverlayStyles: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(10px)' };
const modalContentStyles: React.CSSProperties = { backgroundColor: '#0a0a0a', width: '100%', maxWidth: '500px', borderRadius: '30px', border: '1px solid #222', position: 'relative', overflow: 'hidden' };
const closeBtnStyles: React.CSSProperties = { position: 'absolute', top: '20px', right: '20px', background: '#1a1a1a', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 };
const modalSectionStyles: React.CSSProperties = { marginBottom: '30px' };
const sectionTitleStyles: React.CSSProperties = { fontSize: '11px', color: '#b91c1c', borderLeft: '3px solid #b91c1c', paddingLeft: '10px', marginBottom: '18px', fontWeight: '900', textTransform: 'uppercase' };
const optionRowStyles: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #151515' };
const counterContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', background: '#000', padding: '6px 15px', borderRadius: '30px', border: '1px solid #222' };
const miniBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' };
const textareaStyles: React.CSSProperties = { width: '100%', backgroundColor: '#000', border: '1px solid #222', borderRadius: '15px', padding: '15px', color: '#fff', height: '100px', resize: 'none' };
const footerModalStyles: React.CSSProperties = { padding: '25px 30px', backgroundColor: '#0f0f0f', borderTop: '1px solid #1a1a1a' };
const confirmBtnStyles: React.CSSProperties = { backgroundColor: '#b91c1c', border: 'none', color: '#fff', fontWeight: '900', padding: '20px', borderRadius: '15px', cursor: 'pointer', width: '100%', textTransform: 'uppercase', fontStyle: 'italic' };
const errorContainer: React.CSSProperties = { marginTop: '20px', padding: '15px', backgroundColor: 'rgba(185,28,28,0.1)', border: '1px solid #b91c1c', borderRadius: '10px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 'bold' };
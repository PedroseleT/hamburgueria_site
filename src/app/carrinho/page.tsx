"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, Edit2, X, ArrowLeft, Loader2, Flame, AlertCircle, MapPin, MessageSquare, Ticket, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity, updateItemCustomization, createOrder } = useCart();
  const router = useRouter();
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempOptions, setTempOptions] = useState<any[]>([]);
  const [obsEdit, setObsEdit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [address, setAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'discount' | 'free_shipping'; value?: number } | null>(null);
  const [couponError, setCouponError] = useState("");

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
  const taxaEntregaFixa = 5.00;
  
  let valorFrete = address ? taxaEntregaFixa : 0;
  if (appliedCoupon?.type === 'free_shipping' && address) {
    valorFrete = 0;
  }

  let valorDesconto = 0;
  if (appliedCoupon?.type === 'discount' && appliedCoupon.value) {
    valorDesconto = totalGeral * (appliedCoupon.value / 100);
  }

  const totalComFrete = totalGeral - valorDesconto + valorFrete;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "OFF10") {
      setAppliedCoupon({ code, type: 'discount', value: 10 });
      setCouponError("");
      setCouponInput("");
      toast.success("Cupom de 10% aplicado com sucesso!");
    } else if (code === "FRETEGRATIS") {
      setAppliedCoupon({ code, type: 'free_shipping' });
      setCouponError("");
      setCouponInput("");
      toast.success("Parabéns! Você ganhou Frete Grátis!");
    } else {
      setCouponError("Cupom inválido ou expirado.");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    toast.info("Cupom removido.");
  };

  useEffect(() => {
    const saved = localStorage.getItem("flame_enderecos");
    const activeIdx = localStorage.getItem("flame_endereco_ativo");
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const idx = activeIdx ? parseInt(activeIdx, 10) : 0;
          const end = parsed[idx];
          if (end && end.rua) {
            setAddress(`${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade}`);
          }
        }
      } catch (e) {
        console.error("Erro ao ler endereço:", e);
      }
    }
  }, []);

  // # ALTERAÇÃO SOLICITADA: Lógica de aprovação no useEffect (caso o usuário recarregue a página com PIX pendente)
  useEffect(() => {
    const savedPix = localStorage.getItem("pedro-burger-pix");
    if (savedPix) {
      try {
        const parsedPix = JSON.parse(savedPix);
        setPixData(parsedPix);
        setPixStatus("pendente");

        const interval = setInterval(async () => {
          try {
            const checkRes = await fetch(`/api/checkout/pix?id=${parsedPix.paymentId}`, {
              cache: 'no-store',
              headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            
            if (!checkRes.ok) throw new Error("Falha na consulta");
            const checkData = await checkRes.json();
            
            if (checkData.status === "approved") {
              clearInterval(interval);
              setPixStatus("aprovado");
              localStorage.removeItem("pedro-burger-pix"); 
              
              // # ALTERAÇÃO SOLICITADA: Limpa o carrinho e atualiza o servidor
              cart.forEach(item => removeFromCart(item.id));
              router.refresh();
              
              setTimeout(() => { router.push("/my-orders"); }, 2500);
              
            } else if (checkData.status === "cancelled" || checkData.status === "rejected") {
              clearInterval(interval);
              localStorage.removeItem("pedro-burger-pix");
              setPixData(null);
            }
          } catch (e) {
            console.error("Erro na verificação background:", e);
          }
        }, 5000);

        return () => clearInterval(interval);
      } catch (e) {
        localStorage.removeItem("pedro-burger-pix");
      }
    }
  }, [router, cart, removeFromCart]);

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
    if (!address) {
      setErrorMessage("Você precisa selecionar um endereço de entrega na página inicial.");
      setShowPaymentModal(false);
      return;
    }

    setShowPaymentModal(false); 
    if (cart.length === 0) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const finalNotes = appliedCoupon ? `[CUPOM: ${appliedCoupon.code}] ${deliveryNotes}` : deliveryNotes;

      const res = await fetch("/api/checkout/pix", {
        method: "POST",
        body: JSON.stringify({ 
          items: cart, 
          total: totalComFrete, 
          address, 
          notes: finalNotes,
          paymentMethod: "PIX" 
        }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

      const pixObj = { qrCodeBase64: data.qr_code_base64, qrCode: data.qr_code, paymentId: data.payment_id };
      setPixData(pixObj);
      setPixStatus("pendente");
      localStorage.setItem("pedro-burger-pix", JSON.stringify(pixObj));

      const interval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/checkout/pix?id=${data.payment_id}`, {
            cache: 'no-store',
            headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
          });
          
          if (!checkRes.ok) throw new Error("Network response was not ok");
          const checkData = await checkRes.json();
          
          if (checkData.status === "approved") {
            clearInterval(interval);
            setPixStatus("aprovado");
            localStorage.removeItem("pedro-burger-pix"); 
            
            // # ALTERAÇÃO SOLICITADA: Limpa o carrinho e força refresh para ver o pedido novo
            cart.forEach(item => removeFromCart(item.id));
            router.refresh();
            
            setTimeout(() => { router.push("/my-orders"); }, 2500);
          }
        } catch (err) {
          console.error("Erro ao checar status do PIX:", err);
        }
      }, 5000);

      setTimeout(() => {
        clearInterval(interval);
        localStorage.removeItem("pedro-burger-pix"); 
        setIsSubmitting(false);
      }, 5 * 60 * 1000);

    } catch (error: any) {
      setErrorMessage(error.message);
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
    <main className="carrinho-container" style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'Oswald', sans-serif" }}>
      <Toaster theme="dark" position="top-center" richColors />
      <style jsx global>{`
        @media (max-width: 600px) {
          .cart-item { flex-direction: column !important; align-items: flex-start !important; }
          .cart-item img { width: 100% !important; height: 180px !important; margin-bottom: 15px; }
          .qty-row { width: 100% !important; justify-content: space-between !important; margin-top: 15px !important; }
        }
        .pix-responsive-layout { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .pix-qr-container { background: #fff; padding: 15px; border-radius: 12px; display: inline-block; }
        .pix-text-section { width: 100%; display: flex; flex-direction: column; gap: 15px; }
        @media (min-width: 768px) {
          .pix-responsive-layout { flex-direction: row; align-items: flex-start; text-align: left; }
          .pix-text-section { flex: 1; }
        }
        .delivery-input:focus, .coupon-input:focus {
            border-color: #b91c1c !important;
            box-shadow: 0 0 10px rgba(185, 28, 28, 0.2);
        }
        .carrinho-container { padding-top: 0px; }
        @media (min-width: 768px) { .carrinho-container { padding-top: 100px; } }
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
                      <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)} style={qtyBtn}><Minus size={16}/></button>
                      <span style={{ fontWeight: '900', minWidth: '30px', textAlign: 'center', fontSize: '18px' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}><Plus size={16}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={deliverySectionStyle}>
                <div style={sectionTitleStyles}><MapPin size={16} /> ENTREGAR EM:</div>
                {address ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000", padding: "16px", borderRadius: "10px", border: "1px solid #222", marginTop: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ccc" }}>{address}</span>
                    <Link href="/" style={{ fontSize: "12px", color: "#b91c1c", fontWeight: "bold", textDecoration: "none" }}>TROCAR</Link>
                  </div>
                ) : (
                  <div style={{ marginTop: "10px", padding: "20px", background: "#220000", borderRadius: "10px", border: "1px dashed #b91c1c", textAlign: "center" }}>
                    <p style={{ color: "#ffaaaa", fontSize: "14px", marginBottom: "15px", fontWeight: "bold" }}>Nenhum endereço selecionado.</p>
                    <Link href="/" style={{ color: "#fff", background: "#b91c1c", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "900", textTransform: "uppercase" }}>SELECIONAR NA PÁGINA INICIAL</Link>
                  </div>
                )}
                <div style={{ ...sectionTitleStyles, marginTop: '20px' }}><MessageSquare size={16} /> OBSERVAÇÕES (Opcional)</div>
                <input type="text" placeholder="Ex: Apartamento, Bloco, Chamar no portão..." value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} className="delivery-input" style={deliveryInputStyle} />
            </div>

            <div style={couponSectionStyle}>
              <div style={{ ...sectionTitleStyles, marginBottom: '10px' }}><Ticket size={16} /> CUPOM DE DESCONTO</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="EX: OFF10" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="coupon-input" style={couponInputStyle} disabled={appliedCoupon !== null} />
                {appliedCoupon ? (
                  <button onClick={removeCoupon} style={removeBtnStyle}>REMOVER</button>
                ) : (
                  <button onClick={handleApplyCoupon} style={applyBtnStyle}>APLICAR</button>
                )}
              </div>
              {couponError && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginTop: '8px' }}>{couponError}</p>}
              {appliedCoupon && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '10px 15px', borderRadius: '8px' }}>
                  <CheckCircle size={16} color="#22c55e" />
                  <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 'bold' }}>
                    {appliedCoupon.type === 'discount' ? `Cupom de ${appliedCoupon.value}% aplicado!` : 'Frete Grátis ativado!'}
                  </span>
                </div>
              )}
            </div>

            <div style={resumoStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: '#888' }}>SUBTOTAL:</span>
                <span style={{ color: "#ccc", fontSize: "16px", fontWeight: "bold" }}>R$ {totalGeral.toFixed(2).replace('.', ',')}</span>
              </div>
              {valorDesconto > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: '#22c55e' }}>DESCONTO ({appliedCoupon?.code}):</span>
                  <span style={{ color: "#22c55e", fontSize: "16px", fontWeight: "bold" }}>- R$ {valorDesconto.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: '#888' }}>TAXA DE ENTREGA:</span>
                <span style={{ color: address ? (valorFrete === 0 ? "#22c55e" : "#555") : "#555", fontSize: "16px", fontWeight: "bold" }}>
                  {!address ? 'Pendente' : (valorFrete === 0 ? 'GRÁTIS' : `+ R$ ${valorFrete.toFixed(2).replace('.', ',')}`)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'baseline' }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: '#555' }}>TOTAL DO PEDIDO:</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: "#fff", fontSize: "36px", fontWeight: "900", fontStyle: 'italic' }}>
                    <span style={{ fontSize: '18px', color: '#b91c1c', fontStyle: 'normal', marginRight: '8px' }}>R$</span>
                    {totalComFrete.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              {errorMessage && <div style={errorContainer}><AlertCircle size={16} /><span>{errorMessage}</span></div>}
              <button onClick={() => setShowPaymentModal(true)} disabled={isSubmitting || !address} style={{ ...checkoutBtn, background: isSubmitting || !address ? "#222" : "#b91c1c", color: isSubmitting || !address ? "#555" : "#fff", boxShadow: isSubmitting || !address ? "none" : "0 10px 40px rgba(185,28,28,0.3)", cursor: isSubmitting || !address ? "not-allowed" : "pointer" }}>
                {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> ENVIANDO...</> : <><Flame size={20} /> FINALIZAR PEDIDO</>}
              </button>
              <Link href="/cardapio" style={btnKeepShopping}><ArrowLeft size={16}/> Escolher mais delícias</Link>
            </div>
          </div>
        )}
      </section>

      {/* Modais omitidos para brevidade, mas devem ser mantidos conforme o seu original */}
      {/* ... (Modal de Edição, Modal de Pagamento e Modal de Pix) ... */}
      
      {/* # ALTERAÇÃO SOLICITADA: Modal de Pix com redirecionamento corrigido */}
      {pixData && (
        <div style={modalOverlayStyles} onClick={(e) => { if (e.target === e.currentTarget && pixStatus !== 'aprovado') { setPixData(null); localStorage.removeItem("pedro-burger-pix"); } }}>
          <div className="modal-content" style={{ ...modalContentStyles, padding: '40px', textAlign: 'center', maxWidth: '650px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '900', fontStyle: 'italic', marginBottom: '10px', color: pixStatus === "aprovado" ? '#22c55e' : '#b91c1c' }}>
              {pixStatus === "aprovado" ? "PAGAMENTO APROVADO! 🔥" : "PAGUE VIA PIX"}
            </h2>
            {pixStatus === "pendente" ? (
              <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Escaneie o QR Code ou use o botão Copia e Cola.</p>
                <div className="pix-responsive-layout">
                  <div className="pix-qr-container"><img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" style={{ width: '200px', height: '200px', display: 'block' }} /></div>
                  <div className="pix-text-section">
                    <div className="custom-scrollbar" style={{ background: '#111', border: '1px solid #333', padding: '15px', borderRadius: '8px', wordBreak: 'break-all', fontSize: '12px', color: '#aaa', maxHeight: '100px', overflowY: 'auto' }}>{pixData.qrCode}</div>
                    <button onClick={handleCopyPix} style={{ ...confirmBtnStyles, fontSize: '14px', padding: '16px', background: copied ? '#22c55e' : '#b91c1c' }}>{copied ? "✅ CÓDIGO COPIADO!" : "📋 COPIAR CÓDIGO PIX"}</button>
                    <button onClick={() => { setPixData(null); localStorage.removeItem("pedro-burger-pix"); }} style={{ background: 'transparent', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold', width: '100%', padding: '10px' }}>Cancelar e voltar</button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ width: '90px', height: '90px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', marginBottom: '10px' }}>Tudo certo!</h3>
                <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '35px', textAlign: 'center' }}>Seu pedido já está na grelha!</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c', fontWeight: 'bold' }}>
                  <Loader2 className="animate-spin" size={18} />
                  <span style={{ fontSize: '13px' }}>Redirecionando...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// Estilos omitidos para brevidade (Manter os originais de cores e layout)
const deliverySectionStyle: React.CSSProperties = { background: "#0f0f0f", padding: "25px", borderRadius: "20px", border: "1px solid #1a1a1a", marginBottom: "10px" };
const deliveryInputStyle: React.CSSProperties = { width: "100%", backgroundColor: "#000", border: "1px solid #222", borderRadius: "10px", padding: "15px", color: "#fff", fontSize: "14px", outline: "none", marginTop: "10px" };
const couponSectionStyle: React.CSSProperties = { background: "#0f0f0f", padding: "25px", borderRadius: "20px", border: "1px dashed #222", marginBottom: "10px" };
const couponInputStyle: React.CSSProperties = { flex: 1, backgroundColor: "#000", border: "1px solid #222", borderRadius: "10px", padding: "15px", color: "#fff", fontSize: "14px", outline: "none", textTransform: "uppercase" };
const applyBtnStyle: React.CSSProperties = { backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff", fontWeight: "900", padding: "0 20px", borderRadius: "10px", cursor: "pointer" };
const removeBtnStyle: React.CSSProperties = { backgroundColor: "rgba(185, 28, 28, 0.1)", border: "1px solid #b91c1c", color: "#ef4444", fontWeight: "900", padding: "0 20px", borderRadius: "10px", cursor: "pointer" };
const headerSection: React.CSSProperties = { height: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderBottom: '1px solid #1a1a1a' };
const subtitleStyle: React.CSSProperties = { color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '6px', fontWeight: 'bold' };
const titleStyle: React.CSSProperties = { fontSize: '60px', fontWeight: '900', color: '#fff', fontStyle: 'italic', lineHeight: '1', margin: '5px 0' };
const cartItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "25px", background: "#0f0f0f", padding: "25px", borderRadius: "20px", border: "1px solid #1a1a1a" };
const thumbStyle: React.CSSProperties = { width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px" };
const editBtnSmall: React.CSSProperties = { background: '#1a1a1a', border: '1px solid #333', color: '#888', fontSize: '10px', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontWeight: 'bold' };
const tagStyle: React.CSSProperties = { fontSize: '10px', background: 'rgba(185,28,28,0.1)', padding: '4px 10px', borderRadius: '4px', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.2)', marginRight: '6px', display: 'inline-block', marginBottom: '6px' };
const customizationDetails: React.CSSProperties = { margin: '15px 0' };
const obsItem: React.CSSProperties = { fontSize: '12px', color: '#888', fontStyle: 'italic', margin: '5px 0' };
const qtyControls: React.CSSProperties = { display: "flex", alignItems: "center", gap: "15px", background: "#000", padding: "8px 16px", borderRadius: "10px" };
const qtyBtn: React.CSSProperties = { background: "none", border: "none", color: "#b91c1c", cursor: "pointer" };
const deleteBtn: React.CSSProperties = { background: "#1a1a1a", border: "none", color: "#333", cursor: "pointer", padding: '10px', borderRadius: '50%' };
const resumoStyle: React.CSSProperties = { marginTop: "20px", padding: "40px", background: "#0f0f0f", borderRadius: "24px", border: '1px solid #b91c1c44' };
const checkoutBtn: React.CSSProperties = { width: '100%', padding: '22px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '18px', marginTop: '25px', cursor: 'pointer' };
const btnVoltar: React.CSSProperties = { color: '#fff', background: '#b91c1c', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900' };
const btnKeepShopping: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#444', textDecoration: 'none', marginTop: '20px', fontSize: '12px' };
const modalOverlayStyles: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const modalContentStyles: React.CSSProperties = { backgroundColor: '#0a0a0a', width: '100%', maxWidth: '500px', borderRadius: '30px', border: '1px solid #222' };
const closeBtnStyles: React.CSSProperties = { position: 'absolute', top: '20px', right: '20px', background: '#1a1a1a', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%' };
const modalSectionStyles: React.CSSProperties = { marginBottom: '30px' };
const sectionTitleStyles: React.CSSProperties = { fontSize: '11px', color: '#b91c1c', borderLeft: '3px solid #b91c1c', paddingLeft: '10px', fontWeight: '900' };
const optionRowStyles: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' };
const counterContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', background: '#000', padding: '6px 15px', borderRadius: '30px' };
const miniBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' };
const textareaStyles: React.CSSProperties = { width: '100%', backgroundColor: '#000', border: '1px solid #222', borderRadius: '15px', padding: '15px', color: '#fff', height: '100px' };
const footerModalStyles: React.CSSProperties = { padding: '25px 30px', backgroundColor: '#0f0f0f' };
const confirmBtnStyles: React.CSSProperties = { backgroundColor: '#b91c1c', border: 'none', color: '#fff', fontWeight: '900', padding: '20px', borderRadius: '15px' };
const errorContainer: React.CSSProperties = { marginTop: '20px', padding: '15px', backgroundColor: 'rgba(185,28,28,0.1)', border: '1px solid #b91c1c', borderRadius: '10px', color: '#b91c1c' };
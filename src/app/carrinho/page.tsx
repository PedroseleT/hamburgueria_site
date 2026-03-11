"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, Edit2, X, ArrowLeft, Loader2, Flame, AlertCircle, MapPin, MessageSquare, Ticket, CheckCircle, ShieldCheck, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity, updateItemCustomization } = useCart();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [tempOptions, setTempOptions] = useState<any[]>([]);
  const [obsEdit, setObsEdit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'discount' | 'free_shipping'; value?: number } | null>(null);

  // ESTADOS DO PIX E CRONÔMETRO
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pixData, setPixData] = useState<{ qrCodeBase64: string, qrCode: string, paymentId: string, orderId?: string, expiresAt?: number } | null>(null);
  const [pixStatus, setPixStatus] = useState<string>("pendente");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos em segundos

  // Estados para o Modal de Endereço
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [addressData, setAddressData] = useState<{ rua: string; bairro: string; cidade: string } | null>(null);

  const baseOptions = {
    molhosGratis: [{ nome: "Ketchup", preco: 0 }, { nome: "Mostarda", preco: 0 }, { nome: "Maionese Tradicional", preco: 0 }],
    molhosCasa: [{ nome: "Maionese Artesanal 30ml", preco: 3.50 }, { nome: "Barbecue Defumado 30ml", preco: 4.00 }, { nome: "Chipotle Picante 30ml", preco: 4.50 }],
    complementos: [{ nome: "Hambúrguer Extra 180g", preco: 12.00 }, { nome: "Bacon em Tiras", preco: 6.00 }, { nome: "Queijo Cheddar", preco: 5.00 }, { nome: "Salada Fresca", preco: 3.00 }]
  };

  const subtotalReal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxaEntregaFixa = 5.00;
  
  let valorFrete = address ? taxaEntregaFixa : 0;
  if (appliedCoupon?.type === 'free_shipping' && address) valorFrete = 0;

  let valorDesconto = 0;
  if (appliedCoupon?.type === 'discount' && appliedCoupon.value) {
    valorDesconto = subtotalReal * (appliedCoupon.value / 100);
  }

  const totalExibicao = subtotalReal - valorDesconto + valorFrete;

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Função central de expiração do PIX
  const handlePixExpiration = async (orderIdToCancel?: string, isManualCancel: boolean = false) => {
    stopPolling();
    setPixData(null);
    setIsSubmitting(false);
    localStorage.removeItem("pedro-burger-pix");
    
    if (isManualCancel) {
      toast.info("Pagamento cancelado.");
    } else {
      toast.error("Tempo esgotado! Pedido cancelado.");
    }

    if (orderIdToCancel) {
      try {
        await fetch(`/api/checkout/pix?orderId=${orderIdToCancel}`, { method: "DELETE" });
      } catch (err) {
        console.error("Erro ao deletar pedido expirado", err);
      }
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const checkRes = await fetch(`/api/checkout/pix?id=${paymentId}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      
      if (!checkRes.ok) return;
      const checkData = await checkRes.json();
      
      if (checkData.status === "approved") {
        stopPolling();
        setPixStatus("aprovado");
        localStorage.removeItem("pedro-burger-pix"); 
        
        cart.forEach(item => removeFromCart(item.id));
        router.refresh();
        
        setTimeout(() => { router.push("/my-orders"); }, 2500);
      } else if (checkData.status === "cancelled" || checkData.status === "rejected") {
        stopPolling();
        localStorage.removeItem("pedro-burger-pix");
        setPixData(null);
        setIsSubmitting(false);
        toast.error("O pagamento não foi aprovado ou foi cancelado.");
      }
    } catch (e) {
      console.error("Erro ao verificar status:", e);
    }
  };

  // Função encapsulada para recarregar o endereço salvo
  const loadAddressData = () => {
    const saved = localStorage.getItem("flame_enderecos");
    const activeIdx = localStorage.getItem("flame_endereco_ativo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const idx = activeIdx ? parseInt(activeIdx, 10) : 0;
          const end = parsed[idx];
          if (end && end.rua) setAddress(`${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade}`);
        }
      } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    loadAddressData();
    const savedPix = localStorage.getItem("pedro-burger-pix");
    if (savedPix) {
      try {
        const parsedPix = JSON.parse(savedPix);
        const now = Date.now();
        
        if (parsedPix.expiresAt && now >= parsedPix.expiresAt) {
          handlePixExpiration(parsedPix.orderId);
        } else {
          setPixData(parsedPix);
          setIsSubmitting(true);
          checkPaymentStatus(parsedPix.paymentId);
          intervalRef.current = setInterval(() => checkPaymentStatus(parsedPix.paymentId), 5000);
        }
      } catch (e) { localStorage.removeItem("pedro-burger-pix"); }
    }
    return () => stopPolling();
  }, []);

  // Hook do Cronômetro
  useEffect(() => {
    if (!pixData || !pixData.expiresAt || pixStatus !== "pendente") return;

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const distance = Math.floor((pixData.expiresAt! - now) / 1000);

      if (distance <= 0) {
        clearInterval(timerInterval);
        handlePixExpiration(pixData.orderId);
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [pixData, pixStatus]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Funções do Modal de Endereço
  const buscarCep = async (cepd: string) => {
    const cleanCep = cepd.replace(/\D/g, "");
    setCep(cleanCep);
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (data.erro) {
          toast.error("CEP não encontrado.");
          setAddressData(null);
        } else {
          setAddressData({ rua: data.logradouro, bairro: data.bairro, cidade: data.localidade });
          toast.success("Endereço encontrado!");
        }
      } catch {
        toast.error("Erro ao buscar CEP.");
      } finally {
        setLoadingCep(false);
      }
    } else {
      setAddressData(null);
    }
  };

  const salvarNovoEndereco = () => {
    if (!addressData || !numero) {
      toast.error("Preencha o CEP e o Número.");
      return;
    }
    const novoEnd = { ...addressData, numero, cep };
    const saved = localStorage.getItem("flame_enderecos");
    const arr = saved ? JSON.parse(saved) : [];
    arr.push(novoEnd);
    localStorage.setItem("flame_enderecos", JSON.stringify(arr));
    localStorage.setItem("flame_endereco_ativo", String(arr.length - 1));
    
    loadAddressData(); // Recarrega o estado do Carrinho
    setShowAddressModal(false);
    setCep(""); setNumero(""); setAddressData(null);
    toast.success("Endereço adicionado com sucesso!");
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "OFF10") {
      setAppliedCoupon({ code, type: 'discount', value: 10 });
      setCouponInput("");
      toast.success("Cupom de 10% aplicado!");
    } else if (code === "FRETEGRATIS") {
      setAppliedCoupon({ code, type: 'free_shipping' });
      setCouponInput("");
      toast.success("Frete Grátis aplicado!");
    } else {
      toast.error("Cupom inválido.");
    }
  };

  const processPixPayment = async () => {
    if (!address) return toast.error("Selecione o endereço primeiro.");
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowPaymentModal(false); 
    
    try {
      const finalNotes = appliedCoupon ? `[CUPOM: ${appliedCoupon.code}] ${deliveryNotes}` : deliveryNotes;
      const res = await fetch("/api/checkout/pix", {
        method: "POST",
        body: JSON.stringify({ 
          items: cart, 
          total: 0.01, // Envia o total correto com frete
          address, 
          notes: finalNotes, 
          paymentMethod: "PIX" 
        }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar PIX");

      const expiresAt = Date.now() + 3 * 60 * 1000;
      const pixObj = { 
        qrCodeBase64: data.qr_code_base64, 
        qrCode: data.qr_code, 
        paymentId: data.payment_id,
        orderId: data.order_id,
        expiresAt
      };
      
      setPixData(pixObj);
      setPixStatus("pendente");
      localStorage.setItem("pedro-burger-pix", JSON.stringify(pixObj));

      stopPolling();
      intervalRef.current = setInterval(() => checkPaymentStatus(data.payment_id), 5000);

    } catch (error: any) {
      toast.error(error.message);
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(pixData.qrCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copiado com sucesso!");
      }
    } catch (err) { toast.error("Erro ao copiar."); }
  };

  return (
    <main className="carrinho-container" style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'Oswald', sans-serif" }}>
      <Toaster theme="dark" position="top-center" richColors />
      
      {isSubmitting && !pixData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <Loader2 className="animate-spin text-[#b91c1c] mb-4" size={50} />
            <h2 style={{ fontStyle: 'italic', fontWeight: 900 }}>GERANDO PAGAMENTO...</h2>
            <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Não atualize a página.</p>
        </div>
      )}

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
        {cart.length === 0 && !pixData ? (
          <div style={{ textAlign: "center", marginTop: '50px', marginBottom: '100px', padding: '60px', background: '#111', borderRadius: '20px', border: '1px dashed #333' }}>
            <p style={{ color: '#555', marginBottom: '30px', fontWeight: 'bold', letterSpacing: '2px' }}>CARRINHO VAZIO.</p>
            <Link href="/cardapio" style={btnVoltar}>VER CARDÁPIO</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ opacity: pixData ? 0.3 : 1, pointerEvents: pixData ? 'none' : 'auto' }}>
                {cart.map((item) => (
                <div key={item.id} className="cart-item" style={cartItemStyle}>
                    <img src={item.image} alt={item.name} style={thumbStyle} />
                    <div style={{ flex: 1, width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase' }}>{item.name}</h3>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={deleteBtn}><Trash2 size={20}/></button>
                    </div>
                    <div style={customizationDetails}>
                        {item.customization?.extras?.map((ex: string, i: number) => (<span key={i} style={tagStyle}>{ex}</span>))}
                        {item.customization?.obs && (<p style={obsItem}>"{item.customization.obs}"</p>)}
                    </div>
                    <div className="qty-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px' }}>
                        <p style={{ color: "#fff", fontWeight: "900", fontSize: '24px', margin: 0, fontStyle: 'italic' }}>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        <div style={qtyControls}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={qtyBtn}><Minus size={16}/></button>
                        <span style={{ fontWeight: '900', minWidth: '30px', textAlign: 'center', fontSize: '18px' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}><Plus size={16}/></button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            <div style={{ ...deliverySectionStyle, opacity: pixData ? 0.3 : 1, pointerEvents: pixData ? 'none' : 'auto' }}>
                <div style={sectionTitleStyles}><MapPin size={16} /> ENTREGAR EM:</div>
                {address ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000", padding: "16px", borderRadius: "10px", border: "1px solid #222", marginTop: "10px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ccc" }}>{address}</span>
                    <button onClick={() => setShowAddressModal(true)} style={{ background: "none", border: "none", fontSize: "12px", color: "#b91c1c", fontWeight: "bold", cursor: "pointer" }}>TROCAR</button>
                  </div>
                ) : (
                  <div style={{ marginTop: "10px", padding: "20px", background: "#220000", borderRadius: "10px", border: "1px dashed #b91c1c", textAlign: "center" }}>
                    <p style={{ color: "#ffaaaa", fontSize: "14px", marginBottom: "15px", fontWeight: "bold" }}>Nenhum endereço selecionado.</p>
                    <button onClick={() => setShowAddressModal(true)} style={{ color: "#fff", background: "#b91c1c", padding: "10px 20px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}>
                      ADICIONAR ENDEREÇO
                    </button>
                  </div>
                )}
                <div style={{ ...sectionTitleStyles, marginTop: '20px' }}><MessageSquare size={16} /> OBSERVAÇÕES (Opcional)</div>
                <input type="text" placeholder="Ex: Apto, portão..." value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} className="delivery-input" style={deliveryInputStyle} />
            </div>

            <div style={{ ...couponSectionStyle, opacity: pixData ? 0.3 : 1, pointerEvents: pixData ? 'none' : 'auto' }}>
              <div style={{ ...sectionTitleStyles, marginBottom: '10px' }}><Ticket size={16} /> CUPOM</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="CÓDIGO" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="coupon-input" style={couponInputStyle} disabled={!!appliedCoupon} />
                {appliedCoupon ? <button onClick={() => setAppliedCoupon(null)} style={removeBtnStyle}>REMOVER</button> : <button onClick={handleApplyCoupon} style={applyBtnStyle}>APLICAR</button>}
              </div>
              {appliedCoupon && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '13px', fontWeight: 'bold' }}>
                  <CheckCircle size={16} /> {appliedCoupon.type === 'discount' ? `Cupom ${appliedCoupon.value}% aplicado!` : 'Frete Grátis aplicado!'}
                </div>
              )}
            </div>

            <div style={resumoStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '12px' }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: '#888' }}>SUBTOTAL:</span>
                <span style={{ color: "#ccc", fontSize: "16px", fontWeight: "bold" }}>R$ {subtotalReal.toFixed(2).replace('.', ',')}</span>
              </div>
              {valorDesconto > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '12px', color: '#22c55e' }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>DESCONTO:</span>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>- R$ {valorDesconto.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: '#888' }}>TAXA DE ENTREGA:</span>
                <span style={{ color: address ? (valorFrete === 0 ? "#22c55e" : "#555") : "#555", fontSize: "16px", fontWeight: "bold" }}>{!address ? 'Pendente' : (valorFrete === 0 ? 'GRÁTIS' : `+ R$ ${valorFrete.toFixed(2).replace('.', ',')}`)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'baseline' }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", color: '#555' }}>TOTAL:</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: "#fff", fontSize: "36px", fontWeight: "900", fontStyle: 'italic' }}>R$ {totalExibicao.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                   if (!address) return toast.error("Selecione o endereço primeiro!");
                   if (pixData) return;
                   setShowPaymentModal(true);
                }} 
                disabled={isSubmitting} 
                style={{ ...checkoutBtn, background: isSubmitting ? "#222" : "#b91c1c", color: isSubmitting ? "#555" : "#fff", cursor: isSubmitting ? "not-allowed" : "pointer" }}
              >
                {isSubmitting && !pixData ? <Loader2 className="animate-spin" size={20} /> : <><Flame size={20} /> FINALIZAR PEDIDO</>}
              </button>

              <Link href="/cardapio" style={btnKeepShopping}><ArrowLeft size={16}/> Escolher mais</Link>
            </div>
          </div>
        )}
      </section>

      {/* MODAL DE ADICIONAR ENDEREÇO */}
      {showAddressModal && (
        <div style={modalOverlayStyles} onClick={() => setShowAddressModal(false)}>
          <div style={{ ...modalContentStyles, padding: "30px", background: "#0a0a0a" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAddressModal(false)} style={closeBtnStyles}><X size={20} /></button>
            <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#fff", fontStyle: "italic", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Home size={24} color="#b91c1c" /> NOVO ENDEREÇO
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  placeholder="Digite seu CEP (Apenas números)" 
                  value={cep} 
                  onChange={(e) => buscarCep(e.target.value)} 
                  maxLength={9}
                  style={deliveryInputStyle} 
                />
                {loadingCep && <Loader2 size={18} className="animate-spin" style={{ position: "absolute", right: "15px", top: "25px", color: "#b91c1c" }} />}
              </div>
              
              {addressData && (
                <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "1px solid #222" }}>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: "bold", margin: "0 0 5px 0" }}>{addressData.rua}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{addressData.bairro}, {addressData.cidade}</p>
                  <input 
                    type="text" 
                    placeholder="Número da casa/prédio" 
                    value={numero} 
                    onChange={(e) => setNumero(e.target.value)} 
                    style={{ ...deliveryInputStyle, marginTop: "15px", border: "1px solid #b91c1c" }} 
                  />
                  <button onClick={salvarNovoEndereco} style={{ ...confirmBtnStyles, marginTop: "15px", padding: "15px", fontSize: "14px" }}>
                    SALVAR E USAR
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div style={modalOverlayStyles} onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" style={{ ...modalContentStyles, padding: '30px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPaymentModal(false)} style={closeBtnStyles}><X size={20} /></button>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: '20px' }}>PAGAMENTO</h2>
            <button onClick={processPixPayment} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: '#111', border: '1px solid #32BCAD', borderRadius: '12px', width: '100%', cursor: 'pointer' }}>
               <div style={{ background: '#32BCAD22', padding: '10px', borderRadius: '8px' }}>
                 <CheckCircle size={24} color="#32BCAD" />
               </div>
               <div style={{ textAlign: 'left' }}>
                 <span style={{ display: 'block', color: '#fff', fontWeight: 'bold' }}>PIX (Mercado Pago)</span>
                 <span style={{ color: '#888', fontSize: '12px' }}>Aprovação imediata</span>
               </div>
            </button>
          </div>
        </div>
      )}

      {/* MODAL DO QR CODE PIX */}
      {pixData && (
        <div style={modalOverlayStyles}>
          <div className="modal-content" style={{ ...modalContentStyles, padding: '40px', textAlign: 'center', maxWidth: '500px' }}>
            {pixStatus === "pendente" ? (
              <>
                <h2 style={{ fontSize: '24px', fontWeight: '900', fontStyle: 'italic', marginBottom: '15px', color: '#f59e0b' }}>AGUARDANDO PAGAMENTO</h2>
                
                {/* CRONÔMETRO VISUAL */}
                <div style={{ 
                  backgroundColor: "#b91c1c15", 
                  border: "1px solid #b91c1c44", 
                  color: "#ef4444", 
                  padding: "10px 24px", 
                  borderRadius: "12px", 
                  display: "inline-flex", 
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px", 
                  fontWeight: "900", 
                  fontSize: "26px", 
                  letterSpacing: "0.1em",
                  fontFamily: "monospace"
                }}>
                  <ClockIcon size={24} /> {formatTime(timeLeft)}
                </div>

                <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>O pedido será automaticamente cancelado se o tempo esgotar.</p>
                
                <div className="pix-qr-container" style={{ margin: '0 auto 24px', background: '#fff', padding: '15px', borderRadius: '15px', display: 'inline-block' }}>
                    <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" style={{ width: '200px', height: '200px', display: 'block' }} />
                </div>
                <button onClick={handleCopyPix} style={{ ...confirmBtnStyles, background: copied ? '#22c55e' : '#b91c1c' }}>
                    {copied ? "CÓDIGO COPIADO!" : "COPIAR CÓDIGO PIX"}
                </button>
                <button onClick={() => handlePixExpiration(pixData.orderId, true)} style={{ background: 'transparent', border: 'none', color: '#666', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', padding: '10px' }}>
                    CANCELAR E VOLTAR
                </button>
              </>
            ) : (
              <div style={{ padding: '30px 0' }}>
                <div style={{ width: '90px', height: '90px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <ShieldCheck size={50} color="#22c55e" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#22c55e', fontStyle: 'italic' }}>PAGAMENTO APROVADO!</h2>
                <p style={{ color: '#aaa', marginTop: '10px' }}>Seu pedido já foi enviado para a cozinha.</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#555', marginTop: '40px' }}>
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

// Icone do Relógio
const ClockIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// ESTILOS FINAIS
const sectionTitleStyles: React.CSSProperties = { fontSize: '11px', color: '#b91c1c', borderLeft: '3px solid #b91c1c', paddingLeft: '10px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' };
const deliverySectionStyle: React.CSSProperties = { background: "#0f0f0f", padding: "25px", borderRadius: "20px", border: "1px solid #1a1a1a", marginBottom: "10px" };
const deliveryInputStyle: React.CSSProperties = { width: "100%", backgroundColor: "#000", border: "1px solid #222", borderRadius: "10px", padding: "15px", color: "#fff", fontSize: "14px", outline: "none" };
const couponSectionStyle: React.CSSProperties = { background: "#0f0f0f", padding: "25px", borderRadius: "20px", border: "1px dashed #222", marginBottom: "10px" };
const couponInputStyle: React.CSSProperties = { flex: 1, backgroundColor: "#000", border: "1px solid #222", borderRadius: "10px", padding: "15px", color: "#fff", fontSize: "14px", outline: "none" };
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
const checkoutBtn: React.CSSProperties = { width: '100%', padding: '22px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '18px', marginTop: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', textTransform: 'uppercase', fontStyle: 'italic' };
const btnVoltar: React.CSSProperties = { color: '#fff', background: '#b91c1c', padding: '15px 35px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900' };
const btnKeepShopping: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#444', textDecoration: 'none', marginTop: '20px', fontSize: '12px' };
const modalOverlayStyles: React.CSSProperties = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(10px)' };
const modalContentStyles: React.CSSProperties = { backgroundColor: '#0a0a0a', width: '100%', maxWidth: '500px', borderRadius: '30px', border: '1px solid #222', position: 'relative', overflow: 'hidden' };
const closeBtnStyles: React.CSSProperties = { position: 'absolute', top: '20px', right: '20px', background: '#1a1a1a', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 };
const confirmBtnStyles: React.CSSProperties = { backgroundColor: '#b91c1c', border: 'none', color: '#fff', fontWeight: '900', padding: '20px', borderRadius: '15px', cursor: 'pointer', width: '100%', textTransform: 'uppercase', fontStyle: 'italic' };
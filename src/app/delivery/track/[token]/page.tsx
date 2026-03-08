"use client";

import { useEffect, useState } from "react";
import { Navigation, CheckCircle, Phone, MapPin, Loader2, XCircle, Bike, MessageSquare, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";

export default function CourierTrackingPage() {
  const params = useParams();
  const token = params?.token as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/delivery/info?token=${token}&t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setErrorMsg(data.error);
        else setOrder(data);
      })
      .catch(() => setErrorMsg("Falha ao conectar com o servidor."))
      .finally(() => setLoading(false));
  }, [token]);

  const openGPS = () => {
    if (!order?.address) return toast.error("Endereço não cadastrado");
    const encodedAddr = encodeURIComponent(order.address);
    // URL oficial do Google Maps para traçar rotas
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}`, "_blank");
  };

  const handleFinish = async () => {
    if (!confirm("O pedido foi entregue ao cliente?")) return;
    setCompleting(true);
    try {
      const res = await fetch("/api/delivery/complete", {
        method: "PATCH",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setOrder({ ...order, status: "DONE" });
        toast.success("Entrega finalizada com sucesso!");
      } else {
        toast.error("Erro ao registrar a finalização.");
      }
    } catch (e) {
      toast.error("Erro de conexão ao finalizar.");
    } finally {
      setCompleting(false);
    }
  };

  // 1. TELA DE CARREGAMENTO
  if (loading) return (
    <div className="min-h-[100svh] bg-[#080808] flex flex-col items-center justify-center">
      <Bike className="text-[#b91c1c] animate-bounce mb-4" size={48} />
      <Loader2 className="animate-spin text-[#333]" size={32} />
      <p className="text-[#888] mt-4 font-bold tracking-widest text-sm uppercase">Buscando Rota...</p>
    </div>
  );

  // 2. TELA DE ERRO
  if (errorMsg) return (
    <div className="min-h-[100svh] bg-[#080808] text-white p-6 flex flex-col items-center justify-center text-center font-sans">
      <div className="bg-[#111] border border-[#222] p-8 rounded-3xl max-w-sm w-full shadow-2xl">
        <XCircle size={64} className="text-[#ef4444] mb-6 mx-auto" />
        <h1 className="text-2xl font-black uppercase italic tracking-wide mb-2">Ops! Link Inválido</h1>
        <p className="text-[#aaa] text-sm leading-relaxed mb-6">{errorMsg}</p>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-xl">
          <p className="text-[#444] text-[10px] font-mono break-all">TOKEN: {token}</p>
        </div>
      </div>
    </div>
  );

  // 3. TELA DE SUCESSO / CONCLUÍDA
  if (order?.status === "DONE" || order?.status === "CANCELLED") return (
    <div className="min-h-[100svh] bg-[#080808] text-white p-6 flex flex-col items-center justify-center text-center font-sans">
      <div className="bg-[#111] border border-[#22c55e44] p-8 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(34,197,94,0.1)]">
        <ShieldCheck size={72} className="text-[#22c55e] mb-6 mx-auto" />
        <h1 className="text-3xl font-black uppercase italic tracking-wide mb-2 text-white">ENTREGUE</h1>
        <p className="text-[#aaa] text-sm leading-relaxed">
          Esta entrega já foi registrada e finalizada no sistema. Bom trabalho!
        </p>
      </div>
    </div>
  );

  const isPix = order?.paymentMethod === "PIX";

  // 4. TELA PRINCIPAL DE ROTA
  return (
    <main className="min-h-[100svh] bg-[#080808] text-white font-sans pb-32">
      <Toaster theme="dark" position="top-center" richColors />

      {/* Cabeçalho */}
      <header className="bg-[#111] border-b border-[#1a1a1a] p-5 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#b91c1c] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(185,28,28,0.4)]">
            <Bike size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black italic text-xl uppercase tracking-wide leading-none">The Flame Grill</h1>
            <p className="text-[#b91c1c] text-xs font-bold uppercase tracking-widest">Rota de Entrega</p>
          </div>
        </div>
      </header>

      <div className="p-5 max-w-md mx-auto flex flex-col gap-4">
        
        {/* Card de Cobrança */}
        <div className={`p-6 rounded-3xl border relative overflow-hidden ${isPix ? 'bg-[#111] border-[#22c55e44]' : 'bg-gradient-to-br from-[#b91c1c] to-[#7f1313] border-[#ef4444]'}`}>
          {isPix && <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e] opacity-5 rounded-full blur-3xl" />}
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className={`text-[11px] font-black uppercase tracking-widest ${isPix ? 'text-[#888]' : 'text-[#ffcccc]'}`}>
              {isPix ? "Já Pago (Online)" : "Cobrar do Cliente"}
            </span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${isPix ? 'bg-[#22c55e22] text-[#22c55e] border border-[#22c55e44]' : 'bg-black/30 text-white'}`}>
              {order?.paymentMethod}
            </span>
          </div>
          
          <h2 className={`text-5xl font-black italic tracking-tighter relative z-10 ${isPix ? 'text-[#fff]' : 'text-white'}`}>
            <span className="text-2xl mr-1">R$</span>
            {order?.total?.toFixed(2).replace('.', ',')}
          </h2>

          {!isPix && (
            <div className="mt-4 flex items-center gap-2 bg-black/20 p-3 rounded-xl border border-white/10">
              <AlertTriangle size={16} className="text-[#fbbf24]" />
              <p className="text-sm font-semibold text-white">Receber no ato da entrega</p>
            </div>
          )}
        </div>

        {/* Card do Cliente */}
        <div className="bg-[#111] border border-[#1a1a1a] p-5 rounded-3xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#555] text-[10px] font-black uppercase tracking-widest mb-1">Cliente</p>
              <p className="text-xl font-bold uppercase text-white truncate max-w-[200px]">{order?.user?.name || "Sem Nome"}</p>
            </div>
            {order?.user?.phone && (
              <a href={`tel:${order.user.phone}`} className="bg-[#0a0a0a] border border-[#22c55e44] w-14 h-14 rounded-full flex items-center justify-center text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.15)] active:scale-95 transition-transform">
                <Phone size={24} fill="currentColor" />
              </a>
            )}
          </div>
        </div>

        {/* Card de Endereço */}
        <div className="bg-[#111] border border-[#1a1a1a] p-1 rounded-3xl">
          <div className="bg-[#0a0a0a] m-1 p-5 rounded-2xl border border-[#1a1a1a]">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#b91c1c22] flex items-center justify-center shrink-0">
                <MapPin className="text-[#b91c1c]" size={18} />
              </div>
              <div>
                <p className="text-[#555] text-[10px] font-black uppercase tracking-widest mb-1">Endereço de Entrega</p>
                <p className="text-base font-bold text-white leading-snug">{order?.address || "Endereço não informado"}</p>
              </div>
            </div>
          </div>

          {order?.notes && (
            <div className="px-6 pb-5 pt-3">
              <div className="flex items-start gap-3">
                <MessageSquare className="text-[#fbbf24] shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-[#777] text-[10px] font-black uppercase tracking-widest mb-1">Observações</p>
                  <p className="text-[#fbbf24] text-sm font-semibold leading-snug">"{order.notes}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Ações Fixa no Rodapé */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#000] via-[#080808] to-transparent pt-10 pb-6 px-5 z-50">
        <div className="max-w-md mx-auto grid grid-cols-12 gap-3">
          
          <button onClick={openGPS} className="col-span-4 bg-[#1a1a1a] border border-[#333] h-16 rounded-2xl flex flex-col items-center justify-center gap-1 text-white active:scale-95 transition-transform shadow-xl">
            <Navigation size={22} className="text-[#3b82f6]" />
            <span className="text-[10px] font-black uppercase tracking-widest">MAPA</span>
          </button>

          <button 
            onClick={handleFinish} 
            disabled={completing} 
            className="col-span-8 bg-[#b91c1c] h-16 rounded-2xl flex items-center justify-center gap-3 text-white active:scale-95 transition-transform shadow-[0_10px_30px_rgba(185,28,28,0.3)] disabled:opacity-50 disabled:scale-100"
          >
            {completing ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <CheckCircle size={24} /> 
                <span className="text-lg font-black italic uppercase tracking-wider">ENTREGUE</span>
              </>
            )}
          </button>

        </div>
      </div>

    </main>
  );
}
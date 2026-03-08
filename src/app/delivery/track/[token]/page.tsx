"use client";

import { useEffect, useState } from "react";
import { Navigation, CheckCircle, Phone, MapPin, Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function CourierTrackingPage({ params }: { params: { token: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    // Busca os dados do pedido usando o token secreto
    fetch(`/api/delivery/info?token=${params.token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setOrder(data);
      })
      .catch(err => toast.error("Link expirado ou inválido"))
      .finally(() => setLoading(false));
  }, [params.token]);

  const openGPS = () => {
    if (!order?.address) return toast.error("Endereço não encontrado");
    const encodedAddr = encodeURIComponent(order.address);
    
    // Detecta se é iOS para sugerir Apple Maps ou Google Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS 
      ? `maps://maps.apple.com/?q=${encodedAddr}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddr}`;
    
    window.open(url, "_blank");
  };

  const handleFinish = async () => {
    if (!confirm("Confirmar que o pedido foi entregue ao cliente?")) return;
    
    setCompleting(true);
    try {
      const res = await fetch("/api/delivery/complete", {
        method: "PATCH",
        body: JSON.stringify({ token: params.token }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        toast.success("Entrega finalizada!");
        setOrder({ ...order, status: "DONE" });
      }
    } catch (e) {
      toast.error("Erro ao finalizar. Tente novamente.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-[#b91c1c]" size={40} />
    </div>
  );

  if (!order || order.status === "DONE") return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-black uppercase italic">ENTREGA CONCLUÍDA</h1>
      <p className="text-gray-500 mt-2">Este pedido já foi finalizado ou o link expirou.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-[family-name:var(--font-oswald)]">
      <Toaster theme="dark" position="top-center" />
      
      {/* CARD DE VALOR (CRÍTICO PARA O MOTOBOY) */}
      <div className="bg-[#b91c1c] p-6 rounded-2xl mb-6 shadow-[0_10px_40px_rgba(185,28,28,0.3)]">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Total a Cobrar</span>
            <h2 className="text-5xl font-black italic">R$ {order.total.toFixed(2)}</h2>
          </div>
          <div className="bg-black/20 p-2 rounded-lg text-[10px] font-bold">
            #{order.id.slice(-6).toUpperCase()}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
          <div className="bg-white text-[#b91c1c] text-[10px] font-black px-2 py-0.5 rounded uppercase">
            {order.paymentMethod || "NÃO INFORMADO"}
          </div>
          {order.paymentMethod?.includes("PIX") && <span className="text-[10px] font-bold">⚠️ JÁ PAGO NO SITE</span>}
        </div>
      </div>

      {/* ENDEREÇO */}
      <div className="bg-[#111] border border-[#222] p-5 rounded-2xl mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[#555] text-[10px] font-black uppercase mb-1">Cliente</h3>
            <p className="text-xl font-bold uppercase">{order.user?.name}</p>
          </div>
          {order.user?.phone && (
            <a href={`tel:${order.user.phone}`} className="bg-[#222] p-3 rounded-full text-green-500 active:scale-90 transition-transform">
              <Phone size={24} />
            </a>
          )}
        </div>
        
        <div className="flex gap-3 items-start bg-black/30 p-4 rounded-xl border border-[#1a1a1a]">
          <MapPin className="text-[#b91c1c] shrink-0 mt-1" size={20} />
          <div>
            <p className="text-lg font-bold leading-tight uppercase">{order.address || "Endereço não informado"}</p>
            {order.notes && (
              <p className="text-yellow-500 text-xs font-bold mt-2 italic flex items-center gap-1">
                <AlertTriangle size={12} /> Obs: {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO GIGANTES */}
      <div className="grid gap-4 mt-8">
        <button 
          onClick={openGPS}
          className="w-full bg-[#3b82f6] h-24 rounded-2xl flex items-center justify-center gap-4 text-2xl font-black italic uppercase active:bg-[#2563eb] transition-colors shadow-lg"
        >
          <Navigation size={32} /> INICIAR ROTA
        </button>

        <button 
          onClick={handleFinish}
          disabled={completing}
          className="w-full bg-[#22c55e] h-24 rounded-2xl flex items-center justify-center gap-4 text-2xl font-black italic uppercase active:bg-[#16a34a] disabled:opacity-50 transition-colors shadow-lg"
        >
          {completing ? <Loader2 className="animate-spin" size={32} /> : <><CheckCircle size={32} /> FINALIZAR ENTREGA</>}
        </button>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-[#333] text-[9px] font-black uppercase tracking-widest">
          The Flame Grill 2026 • Sistema de Despacho Seguro
        </p>
      </div>
    </div>
  );
}
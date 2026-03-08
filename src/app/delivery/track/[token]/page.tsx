"use client";

import { useEffect, useState } from "react";
import { Navigation, CheckCircle, Phone, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function CourierTrackingPage({ params }: { params: { token: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    // # ALTERAÇÃO SOLICITADA: Busca info e trata estados de erro explicitamente
    fetch(`/api/delivery/info?token=${params.token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error);
          setOrder(null);
        } else {
          setOrder(data);
        }
      })
      .catch(() => toast.error("Erro de conexão"))
      .finally(() => setLoading(false));
  }, [params.token]);

  const openGPS = () => {
    if (!order?.address) return toast.error("Endereço não cadastrado");
    const encodedAddr = encodeURIComponent(order.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddr}`, "_blank");
  };

  const handleFinish = async () => {
    if (!confirm("Confirmar entrega?")) return;
    setCompleting(true);
    try {
      const res = await fetch("/api/delivery/complete", {
        method: "PATCH",
        body: JSON.stringify({ token: params.token }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setOrder({ ...order, status: "DONE" });
        toast.success("Entregue!");
      }
    } catch (e) {
      toast.error("Erro ao finalizar");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-[#b91c1c]" size={40} />
    </div>
  );

  // # ALTERAÇÃO SOLICITADA: Só mostra "Concluída" se o status for REALMENTE DONE ou se não houver pedido
  if (!order || order.status === "DONE") return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-black uppercase italic">ENTREGA CONCLUÍDA</h1>
      <p className="text-gray-500 mt-2">Este link já foi utilizado ou o pedido foi finalizado.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-[family-name:var(--font-oswald)]">
      <Toaster theme="dark" position="top-center" richColors />
      
      <div className="bg-[#b91c1c] p-6 rounded-2xl mb-6">
        <span className="text-[10px] font-black uppercase opacity-80">Total a Cobrar</span>
        <h2 className="text-5xl font-black italic">R$ {order.total?.toFixed(2)}</h2>
        <p className="text-xs font-bold mt-2 uppercase">Pagamento: {order.paymentMethod}</p>
      </div>

      <div className="bg-[#111] border border-[#222] p-5 rounded-2xl mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[#555] text-[10px] font-black uppercase mb-1">Cliente</h3>
            <p className="text-xl font-bold uppercase">{order.user?.name}</p>
          </div>
          {order.user?.phone && (
            <a href={`tel:${order.user.phone}`} className="bg-[#222] p-3 rounded-full text-green-500"><Phone size={24} /></a>
          )}
        </div>
        
        <div className="flex gap-3 items-start bg-black/30 p-4 rounded-xl border border-[#1a1a1a]">
          <MapPin className="text-[#b91c1c] shrink-0 mt-1" size={20} />
          <p className="text-lg font-bold leading-tight uppercase">{order.address || "Endereço não informado"}</p>
        </div>
      </div>

      <div className="grid gap-4 mt-8">
        <button onClick={openGPS} className="w-full bg-[#3b82f6] h-20 rounded-2xl flex items-center justify-center gap-4 text-2xl font-black italic uppercase shadow-lg">
          <Navigation size={32} /> ABRIR GPS
        </button>

        <button onClick={handleFinish} disabled={completing} className="w-full bg-[#22c55e] h-20 rounded-2xl flex items-center justify-center gap-4 text-2xl font-black italic uppercase shadow-lg disabled:opacity-50">
          {completing ? <Loader2 className="animate-spin" size={32} /> : <><CheckCircle size={32} /> FINALIZAR ENTREGA</>}
        </button>
      </div>
    </div>
  );
}
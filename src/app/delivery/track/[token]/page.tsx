"use client";

import { useEffect, useState } from "react";
import { Navigation, CheckCircle, Phone, MapPin, Loader2, AlertTriangle, XCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation"; // # ALTERAÇÃO: Leitura segura de URL

export default function CourierTrackingPage() {
  const params = useParams();
  const token = params?.token as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  
  // # ALTERAÇÃO: Estado dedicado para sabermos exatamente o que deu errado
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // Força a URL a ignorar cache
    fetch(`/api/delivery/info?token=${token}&t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error); // Salva o erro real que a API devolveu
        } else {
          setOrder(data);
        }
      })
      .catch(err => {
        setErrorMsg("Falha ao conectar com o banco de dados.");
      })
      .finally(() => setLoading(false));
  }, [token]);

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
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setOrder({ ...order, status: "DONE" });
        toast.success("Entregue!");
      } else {
        toast.error("Erro na API de finalizar.");
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

  // # ALTERAÇÃO: Tela de ERRO REAL
  if (errorMsg) return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center font-[family-name:var(--font-oswald)]">
      <XCircle size={80} className="text-red-500 mb-4" />
      <h1 className="text-3xl font-black uppercase italic">ERRO NO LINK</h1>
      <p className="text-gray-400 mt-2 font-sans">{errorMsg}</p>
      <p className="text-red-900 text-xs mt-4">Debug: {token}</p>
    </div>
  );

  // # ALTERAÇÃO: Só mostra "Concluída" se tivermos certeza que o status é DONE
  if (order?.status === "DONE" || order?.status === "CANCELLED") return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center font-[family-name:var(--font-oswald)]">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-black uppercase italic">ENTREGA CONCLUÍDA</h1>
      <p className="text-gray-500 mt-2 font-sans">Este pedido já foi finalizado no sistema.</p>
    </div>
  );

  // Se passou pelos erros, mostra a página normalmente
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-[family-name:var(--font-oswald)]">
      <Toaster theme="dark" position="top-center" richColors />
      
      <div className="bg-[#b91c1c] p-6 rounded-2xl mb-6">
        <span className="text-[10px] font-black uppercase opacity-80">Total a Cobrar</span>
        <h2 className="text-5xl font-black italic">R$ {order?.total?.toFixed(2)}</h2>
        <p className="text-xs font-bold mt-2 uppercase">Pagamento: {order?.paymentMethod}</p>
      </div>

      <div className="bg-[#111] border border-[#222] p-5 rounded-2xl mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[#555] text-[10px] font-black uppercase mb-1">Cliente</h3>
            <p className="text-xl font-bold uppercase">{order?.user?.name || "Sem Nome"}</p>
          </div>
          {order?.user?.phone && (
            <a href={`tel:${order.user.phone}`} className="bg-[#222] p-3 rounded-full text-green-500"><Phone size={24} /></a>
          )}
        </div>
        
        <div className="flex gap-3 items-start bg-black/30 p-4 rounded-xl border border-[#1a1a1a]">
          <MapPin className="text-[#b91c1c] shrink-0 mt-1" size={20} />
          <div>
             <p className="text-lg font-bold leading-tight uppercase">{order?.address || "Endereço não informado"}</p>
             {order?.notes && <p className="text-yellow-500 text-sm mt-2">Obs: {order.notes}</p>}
          </div>
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
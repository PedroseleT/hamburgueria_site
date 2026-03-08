"use client";

import { useEffect, useState } from "react";
import {
  Navigation,
  CheckCircle,
  Phone,
  MapPin,
  Loader2,
  XCircle,
  Bike,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Package,
} from "lucide-react";
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
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setErrorMsg(data.error);
        else setOrder(data);
      })
      .catch(() => setErrorMsg("Falha ao conectar com o servidor."))
      .finally(() => setLoading(false));
  }, [token]);

  const openGPS = () => {
    if (!order?.address) return toast.error("Endereço não cadastrado");
    const encodedAddr = encodeURIComponent(order.address);
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}`,
      "_blank"
    );
  };

  const handleFinish = async () => {
    if (!confirm("O pedido foi entregue ao cliente?")) return;
    setCompleting(true);
    try {
      const res = await fetch("/api/delivery/complete", {
        method: "PATCH",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
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

  // ─── LOADING ────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-[100svh] bg-[#070707] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#b91c1c] opacity-20 blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-full bg-[#111] border border-[#1e1e1e] flex items-center justify-center">
            <Bike className="text-[#b91c1c] animate-pulse" size={36} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#b91c1c]" size={20} />
          <p className="text-[#444] font-mono text-xs tracking-[0.3em] uppercase">
            Buscando Rota...
          </p>
        </div>
      </div>
    );

  // ─── ERROR ──────────────────────────────────────────────────────────────────
  if (errorMsg)
    return (
      <div className="min-h-[100svh] bg-[#070707] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#b91c1c]/20 to-transparent border-b border-[#1e1e1e] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#b91c1c]/10 border border-[#b91c1c]/20 flex items-center justify-center">
                <XCircle size={24} className="text-[#ef4444]" />
              </div>
              <div>
                <h1 className="text-white font-black text-lg uppercase italic tracking-wide">
                  Link Inválido
                </h1>
                <p className="text-[#555] text-xs font-mono">Acesso negado</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[#888] text-sm leading-relaxed">{errorMsg}</p>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3">
                <p className="text-[#333] text-[10px] font-mono break-all">
                  TOKEN: {token}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  // ─── DONE / CANCELLED ───────────────────────────────────────────────────────
  if (order?.status === "DONE" || order?.status === "CANCELLED")
    return (
      <div className="min-h-[100svh] bg-[#070707] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#0f0f0f] border border-[#22c55e]/20 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.08)] text-center">
            <div className="p-10 space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-[#22c55e] opacity-10 rounded-full blur-2xl" />
                <div className="relative w-24 h-24 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mx-auto">
                  <ShieldCheck size={40} className="text-[#22c55e]" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-[#22c55e] font-mono text-xs tracking-[0.3em] uppercase">
                  Missão Cumprida
                </p>
                <h1 className="text-white text-4xl font-black uppercase italic tracking-tight">
                  ENTREGUE
                </h1>
                <p className="text-[#555] text-sm leading-relaxed max-w-xs mx-auto">
                  Esta entrega já foi registrada e finalizada no sistema. Bom
                  trabalho!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const isPix = order?.paymentMethod === "PIX";

  // ─── MAIN ───────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-[100svh] bg-[#070707] text-white font-sans">
      <Toaster theme="dark" position="top-center" richColors />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 bg-[#070707]/80 backdrop-blur-xl border-b border-[#111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#b91c1c] blur-md opacity-40 rounded-full" />
              <div className="relative w-9 h-9 bg-[#b91c1c] rounded-full flex items-center justify-center">
                <Bike size={18} className="text-white" />
              </div>
            </div>
            <div className="leading-none">
              <h1 className="font-black italic text-base uppercase tracking-wider text-white">
                The Flame Grill
              </h1>
              <p className="text-[#b91c1c] text-[10px] font-bold uppercase tracking-[0.2em]">
                Rota de Entrega
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#555] text-[10px] font-mono tracking-widest uppercase">
              Em Rota
            </span>
          </div>
        </div>
      </header>

      {/* ── CONTENT GRID ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* ── LEFT COLUMN (desktop sidebar) ── */}
          <aside className="lg:col-span-4 flex flex-col gap-4">

            {/* Payment Card */}
            <div className={`relative rounded-2xl overflow-hidden border ${
              isPix
                ? "bg-[#0f0f0f] border-[#22c55e]/20"
                : "bg-[#0f0f0f] border-[#b91c1c]/30"
            }`}>
              {/* Decorative glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 ${
                isPix ? "bg-[#22c55e]" : "bg-[#b91c1c]"
              }`} />
              
              {/* Top stripe */}
              <div className={`h-1 w-full ${isPix ? "bg-[#22c55e]" : "bg-[#b91c1c]"}`} />

              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[#444] text-[10px] font-bold uppercase tracking-[0.25em] mb-1">
                      {isPix ? "Pago Online" : "Cobrar do Cliente"}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-lg font-black ${isPix ? "text-[#22c55e]" : "text-[#b91c1c]"}`}>
                        R$
                      </span>
                      <span className="text-5xl font-black italic tracking-tighter text-white leading-none">
                        {order?.total?.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border ${
                    isPix
                      ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20"
                      : "bg-[#b91c1c]/10 text-[#ef4444] border-[#b91c1c]/20"
                  }`}>
                    {order?.paymentMethod}
                  </span>
                </div>

                {!isPix && (
                  <div className="flex items-center gap-2 bg-[#b91c1c]/10 border border-[#b91c1c]/20 p-3 rounded-xl mt-2">
                    <AlertTriangle size={14} className="text-[#fbbf24] shrink-0" />
                    <p className="text-sm font-semibold text-[#fbbf24]">
                      Receber no ato da entrega
                    </p>
                  </div>
                )}

                {isPix && (
                  <div className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 p-3 rounded-xl mt-2">
                    <CheckCircle size={14} className="text-[#22c55e] shrink-0" />
                    <p className="text-sm font-semibold text-[#22c55e]">
                      Pagamento já confirmado
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Card */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-5">
              <p className="text-[#333] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                Cliente
              </p>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-black uppercase text-white truncate">
                    {order?.user?.name || "Sem Nome"}
                  </h2>
                  {order?.user?.phone && (
                    <p className="text-[#444] text-sm font-mono mt-0.5">
                      {order.user.phone}
                    </p>
                  )}
                </div>
                {order?.user?.phone && (
                  <a
                    href={`tel:${order.user.phone}`}
                    className="shrink-0 w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e] hover:bg-[#22c55e]/20 transition-colors active:scale-95"
                  >
                    <Phone size={20} fill="currentColor" />
                  </a>
                )}
              </div>
            </div>

            {/* Desktop action buttons */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              <button
                onClick={openGPS}
                className="bg-[#0f0f0f] border border-[#1a1a1a] h-14 rounded-xl flex items-center justify-center gap-2 text-white hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 transition-all active:scale-95 group"
              >
                <Navigation size={18} className="text-[#3b82f6] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">MAPA</span>
              </button>
              <button
                onClick={handleFinish}
                disabled={completing}
                className="bg-[#b91c1c] h-14 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-[#991b1b] transition-colors active:scale-95 shadow-[0_4px_20px_rgba(185,28,28,0.3)] disabled:opacity-50 disabled:scale-100"
              >
                {completing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span className="text-sm font-black italic uppercase tracking-wider">
                      ENTREGUE
                    </span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Address Card */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              <div className="border-b border-[#111] px-5 py-4 flex items-center gap-2">
                <MapPin size={14} className="text-[#b91c1c]" />
                <p className="text-[#444] text-[10px] font-bold uppercase tracking-[0.25em]">
                  Endereço de Entrega
                </p>
              </div>
              <div className="p-5">
                <p className="text-white text-lg font-bold leading-snug">
                  {order?.address || "Endereço não informado"}
                </p>

                {/* Map preview button */}
                <button
                  onClick={openGPS}
                  className="mt-4 w-full lg:hidden bg-[#111] border border-[#1a1a1a] rounded-xl h-24 flex flex-col items-center justify-center gap-2 text-[#555] hover:border-[#3b82f6]/30 hover:text-[#3b82f6] transition-all active:scale-[0.98] group"
                >
                  <Navigation size={24} className="text-[#3b82f6] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Abrir no Google Maps
                  </span>
                </button>

                <button
                  onClick={openGPS}
                  className="mt-4 w-full hidden lg:flex bg-[#111] border border-[#1a1a1a] rounded-xl h-16 items-center justify-center gap-3 text-[#555] hover:border-[#3b82f6]/30 hover:text-[#3b82f6] transition-all active:scale-[0.98] group"
                >
                  <Navigation size={18} className="text-[#3b82f6]" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Ver rota no Google Maps
                  </span>
                </button>
              </div>
            </div>

            {/* Notes Card */}
            {order?.notes && (
              <div className="bg-[#0f0f0f] border border-[#fbbf24]/10 rounded-2xl overflow-hidden">
                <div className="border-b border-[#fbbf24]/10 px-5 py-4 flex items-center gap-2">
                  <MessageSquare size={14} className="text-[#fbbf24]" />
                  <p className="text-[#664] text-[10px] font-bold uppercase tracking-[0.25em]">
                    Observações do Pedido
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-[#fbbf24] font-semibold leading-relaxed text-sm">
                    "{order.notes}"
                  </p>
                </div>
              </div>
            )}

            {/* Order meta row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={13} className="text-[#444]" />
                  <p className="text-[#333] text-[10px] font-bold uppercase tracking-[0.2em]">
                    Pedido
                  </p>
                </div>
                <p className="text-white font-black text-lg">
                  #{order?.id?.toString().slice(-5) || "—"}
                </p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={13} className="text-[#444]" />
                  <p className="text-[#333] text-[10px] font-bold uppercase tracking-[0.2em]">
                    Status
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                  <p className="text-[#fbbf24] font-black text-sm uppercase tracking-wide">
                    Em Rota
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE FOOTER ACTIONS ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50">
        <div className="bg-gradient-to-t from-[#070707] via-[#070707]/95 to-transparent pt-8 pb-5 px-4">
          <div className="grid grid-cols-12 gap-3 max-w-md mx-auto">
            <button
              onClick={openGPS}
              className="col-span-4 bg-[#0f0f0f] border border-[#1e1e1e] h-16 rounded-2xl flex flex-col items-center justify-center gap-1 text-white active:scale-95 transition-transform"
            >
              <Navigation size={20} className="text-[#3b82f6]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#555]">
                MAPA
              </span>
            </button>
            <button
              onClick={handleFinish}
              disabled={completing}
              className="col-span-8 bg-[#b91c1c] h-16 rounded-2xl flex items-center justify-center gap-2.5 text-white active:scale-95 transition-transform shadow-[0_8px_24px_rgba(185,28,28,0.35)] disabled:opacity-50 disabled:scale-100"
            >
              {completing ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <CheckCircle size={22} />
                  <span className="text-base font-black italic uppercase tracking-wider">
                    ENTREGUE
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding so content isn't hidden behind footer */}
      <div className="h-32 lg:hidden" />
    </main>
  );
}
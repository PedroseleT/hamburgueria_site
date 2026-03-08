"use client";

/*
  ⚙️  AJUSTE DE NAVBAR INFERIOR
  Troque BOTTOM_NAV_HEIGHT pelo tamanho em px da sua navbar inferior.
  Assim os botões de ação nunca ficam escondidos atrás dela.
*/
const BOTTOM_NAV_HEIGHT = 64; // px

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/delivery/info?token=${token}&t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setErrorMsg(data.error);
        else {
          setOrder(data);
          setTimeout(() => setVisible(true), 80);
        }
      })
      .catch(() => setErrorMsg("Falha ao conectar com o servidor."))
      .finally(() => setLoading(false));
  }, [token]);

  const openGPS = () => {
    if (!order?.address) return toast.error("Endereço não cadastrado");
    // Link oficial corrigido para traçar rota direta no Waze/Maps
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address)}`,
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
    } catch {
      toast.error("Erro de conexão ao finalizar.");
    } finally {
      setCompleting(false);
    }
  };

  const isPix = order?.paymentMethod === "PIX";

  /* ═══ LOADING ═══════════════════════════════════════════════════════════ */
  if (loading)
    return (
      <div className="min-h-[100svh] bg-[#060608] flex flex-col items-center justify-center gap-8">
        <style>{GLOBAL_STYLES}</style>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border border-[#b91c1c]/15 animate-ping" />
          <div className="absolute w-20 h-20 rounded-full border border-[#b91c1c]/25 animate-ping [animation-delay:200ms]" />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 30% 30%, #1a0a0a, #0a0305)",
              border: "1px solid rgba(185,28,28,0.3)",
              boxShadow: "0 0 40px rgba(185,28,28,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <Bike size={28} className="text-[#b91c1c]" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={14} className="animate-spin text-[#b91c1c]/50" />
          <p className="flame text-[#555] text-sm tracking-[0.5em] uppercase">
            Buscando Rota
          </p>
        </div>
      </div>
    );

  /* ═══ ERROR ══════════════════════════════════════════════════════════════ */
  if (errorMsg)
    return (
      <div className="min-h-[100svh] bg-[#060608] flex items-center justify-center p-5">
        <style>{GLOBAL_STYLES}</style>
        <div
          className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "#0a0a0d", border: "1px solid rgba(185,28,28,0.15)" }}
        >
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #b91c1c, #ef4444 50%, transparent)" }}
          />
          <div className="p-8 text-center space-y-6">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.15)" }}
            >
              <XCircle size={28} className="text-[#ef4444]" />
            </div>
            <div>
              <p className="flame text-white text-3xl uppercase tracking-wide">Link Inválido</p>
              <p className="text-[#666] text-sm mt-2 leading-relaxed">{errorMsg}</p>
            </div>
            <code
              className="block text-[10px] text-[#444] font-mono rounded-xl px-3 py-3 break-all"
              style={{ background: "#06060a", border: "1px solid #111116" }}
            >
              {token}
            </code>
          </div>
        </div>
      </div>
    );

  /* ═══ DONE / CANCELLED ══════════════════════════════════════════════════ */
  if (order?.status === "DONE" || order?.status === "CANCELLED")
    return (
      <div className="min-h-[100svh] bg-[#060608] flex items-center justify-center p-5">
        <style>{GLOBAL_STYLES}</style>
        <div
          className="w-full max-w-sm rounded-3xl overflow-hidden"
          style={{
            background: "#0a0a0d",
            border: "1px solid rgba(34,197,94,0.12)",
            boxShadow: "0 0 80px rgba(34,197,94,0.05)",
          }}
        >
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #22c55e, #16a34a 50%, transparent)" }}
          />
          <div className="p-10 text-center space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-2xl blur-xl" style={{ background: "rgba(34,197,94,0.15)" }} />
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}
              >
                <ShieldCheck size={36} className="text-[#22c55e]" />
              </div>
            </div>
            <div>
              <p className="text-[#22c55e] text-[9px] tracking-[0.5em] uppercase font-bold mb-2">
                Missão Cumprida
              </p>
              <p className="flame text-white text-4xl uppercase tracking-wide">ENTREGUE</p>
              <p className="text-[#666] text-sm mt-3 leading-relaxed">
                Entrega registrada no sistema. Excelente trabalho!
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  /* ═══ MAIN PAGE ══════════════════════════════════════════════════════════ */
  // Espaçamento calculado para o último card nunca ficar atrás da barra inferior
  const contentPaddingBottom = 90 + BOTTOM_NAV_HEIGHT;

  return (
    <main
      className={`min-h-[100svh] bg-[#060608] text-white transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        backgroundImage: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(185,28,28,0.03) 0%, transparent 60%)",
      }}
    >
      <style>{GLOBAL_STYLES}</style>
      <Toaster theme="dark" position="top-center" richColors />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 px-5 pt-safe"
        style={{
          background: "rgba(6,6,8,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div className="max-w-2xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: "#b91c1c", opacity: 0.4, transform: "scale(1.2)" }}
              />
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, #b91c1c, #6b0f0f)",
                  boxShadow: "0 2px 10px rgba(185,28,28,0.3)",
                }}
              >
                <Bike size={18} className="text-white" />
              </div>
            </div>
            <div>
              <p className="flame text-[16px] text-white uppercase leading-tight tracking-wide">
                The Flame Grill
              </p>
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#b91c1c]">
                Rota de Entrega
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fbbf24]" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777]">
              Em Rota
            </span>
          </div>
        </div>
      </header>

      {/* ── SCROLL CONTENT ──────────────────────────────────────────────────── */}
      <div
        className="max-w-2xl mx-auto px-5 pt-6 flex flex-col gap-4"
        style={{ paddingBottom: `${contentPaddingBottom}px` }}
      >
        {/* ── [1] PAYMENT CARD ───────────────────────────────────────────────── */}
        <div
          className="card-0 relative rounded-3xl overflow-hidden"
          style={{
            background: isPix
              ? "linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(6,6,8,0) 100%)"
              : "linear-gradient(135deg, rgba(185,28,28,0.12) 0%, rgba(6,6,8,0) 100%)",
            border: isPix
              ? "1px solid rgba(34,197,94,0.15)"
              : "1px solid rgba(185,28,28,0.25)",
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[50px] pointer-events-none"
            style={{ background: isPix ? "#22c55e" : "#b91c1c", opacity: 0.1 }}
          />
          <div
            style={{
              height: 2,
              background: isPix
                ? "linear-gradient(90deg, #22c55e, rgba(34,197,94,0.2) 70%, transparent)"
                : "linear-gradient(90deg, #b91c1c, rgba(185,28,28,0.2) 70%, transparent)",
            }}
          />

          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-5">
              <p
                className="text-[10px] font-black tracking-[0.25em] uppercase"
                style={{ color: isPix ? "#22c55e" : "#b91c1c" }}
              >
                {isPix ? "✓ Pago Online" : "⚠ Cobrar na Entrega"}
              </p>
              <span
                className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest"
                style={{
                  background: isPix ? "rgba(34,197,94,0.1)" : "rgba(185,28,28,0.1)",
                  border: isPix
                    ? "1px solid rgba(34,197,94,0.2)"
                    : "1px solid rgba(185,28,28,0.2)",
                  color: isPix ? "#22c55e" : "#ef4444",
                }}
              >
                {order?.paymentMethod}
              </span>
            </div>

            <div className="flex items-start gap-1 leading-none">
              <span
                className="flame text-2xl mt-2"
                style={{ color: isPix ? "#22c55e" : "#fff", opacity: 0.6 }}
              >
                R$
              </span>
              <span
                className="flame"
                style={{
                  fontSize: "clamp(64px, 18vw, 84px)",
                  lineHeight: 1,
                  color: isPix ? "#22c55e" : "#fff",
                  textShadow: isPix
                    ? "0 0 50px rgba(34,197,94,0.2)"
                    : "0 0 30px rgba(255,255,255,0.05)",
                }}
              >
                {order?.total?.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {!isPix && (
              <div
                className="mt-6 flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  background: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.15)",
                }}
              >
                <AlertTriangle size={18} className="text-[#fbbf24] shrink-0" />
                <p className="text-[#fbbf24] text-[13px] font-bold tracking-wide">
                  Receber em dinheiro no ato da entrega
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── [2] CUSTOMER CARD ──────────────────────────────────────────────── */}
        <div
          className="card-1 rounded-3xl p-5 flex items-center justify-between gap-4"
          style={{
            background: "#0a0a0d",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center flame text-2xl shadow-inner"
              style={{
                background: "rgba(185,28,28,0.08)",
                border: "1px solid rgba(185,28,28,0.2)",
                color: "#b91c1c",
              }}
            >
              {(order?.user?.name?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#555] mb-1">
                Cliente
              </p>
              <p className="flame text-2xl text-white uppercase truncate tracking-wide leading-none">
                {order?.user?.name || "Sem Nome"}
              </p>
            </div>
          </div>

          {order?.user?.phone && (
            <a
              href={`tel:${order.user.phone}`}
              className="press shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-[#22c55e]"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Phone size={22} fill="currentColor" />
            </a>
          )}
        </div>

        {/* ── [3] ADDRESS CARD ───────────────────────────────────────────────── */}
        <div
          className="card-2 rounded-3xl overflow-hidden"
          style={{ background: "#0a0a0d", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div
            className="flex items-center gap-2 px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
          >
            <MapPin size={14} style={{ color: "#b91c1c" }} />
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#666]">
              Endereço de Entrega
            </p>
          </div>

          <div className="px-6 pb-6 pt-5">
            <p className="text-white text-[18px] font-bold leading-snug tracking-wide">
              {order?.address || "Endereço não informado"}
            </p>

            <button
              onClick={openGPS}
              className="press mt-5 w-full flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <Navigation size={18} className="text-[#3b82f6]" />
                <span className="text-[#3b82f6] text-[14px] font-bold tracking-wide">
                  Abrir no Waze / Maps
                </span>
              </div>
              <span className="text-[#3b82f6] text-lg font-black opacity-60">→</span>
            </button>
          </div>
        </div>

        {/* ── [4] NOTES ──────────────────────────────────────────────────────── */}
        {order?.notes && (
          <div
            className="card-3 rounded-3xl overflow-hidden"
            style={{
              background: "#0a0a0d",
              border: "1px solid rgba(251,191,36,0.15)",
            }}
          >
            <div
              className="flex items-center gap-2 px-6 py-4"
              style={{ borderBottom: "1px solid rgba(251,191,36,0.08)" }}
            >
              <MessageSquare size={14} className="text-[#fbbf24]" />
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#a18228]">
                Observações do Pedido
              </p>
            </div>
            <div className="px-6 pb-6 pt-4">
              <p className="text-[#fbbf24] text-[15px] font-semibold leading-relaxed">
                "{order.notes}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── ACTION BAR FIXED ────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pointer-events-none"
      >
        <div
          className="w-full pointer-events-auto"
          style={{
            padding: "24px 20px",
            paddingBottom: `calc(20px + ${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`,
            background: "linear-gradient(to top, rgba(6,6,8,1) 0%, rgba(6,6,8,0.95) 70%, rgba(6,6,8,0) 100%)",
          }}
        >
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={openGPS}
              className="press flex-none flex flex-col items-center justify-center gap-2 rounded-[20px]"
              style={{
                width: 80,
                height: 80,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              <Navigation size={24} className="text-[#3b82f6]" />
              <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#777]">
                MAPA
              </span>
            </button>

            <button
              onClick={handleFinish}
              disabled={completing}
              className="press flex-1 flex items-center justify-center gap-3 rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                height: 80,
                background: completing
                  ? "rgba(185,28,28,0.3)"
                  : "linear-gradient(135deg, #c92020 0%, #8b1010 100%)",
                border: "1px solid rgba(185,28,28,0.5)",
                boxShadow: completing
                  ? "none"
                  : "0 8px 30px rgba(185,28,28,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {completing ? (
                <Loader2 className="animate-spin text-white" size={28} />
              ) : (
                <>
                  <CheckCircle size={26} className="text-white" strokeWidth={2.5} />
                  <span className="flame text-[24px] text-white uppercase tracking-wider">
                    Marcar Entregue
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,800;1,900&display=swap');

  .flame {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-style: italic;
  }

  .press {
    transition: transform 0.1s cubic-bezier(.22,.68,0,1.4), box-shadow 0.1s ease;
    cursor: pointer;
  }
  .press:active {
    transform: scale(0.96);
  }

  @keyframes _slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-0 { animation: _slideUp 0.5s cubic-bezier(.22,.68,0,1) 0.05s both; }
  .card-1 { animation: _slideUp 0.5s cubic-bezier(.22,.68,0,1) 0.12s both; }
  .card-2 { animation: _slideUp 0.5s cubic-bezier(.22,.68,0,1) 0.19s both; }
  .card-3 { animation: _slideUp 0.5s cubic-bezier(.22,.68,0,1) 0.26s both; }
  
  /* Ajuste de área segura para iOS */
  .pt-safe { padding-top: env(safe-area-inset-top); }
`;
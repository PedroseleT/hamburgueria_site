"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Calendar, Clock, Flame, CheckCircle2, ChefHat, Bike, XCircle } from "lucide-react";

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

// ─── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; glow: string; icon: React.ReactNode; step: number }> = {
  RECEIVED:         { label: "Recebido",          color: "#f59e0b", glow: "#f59e0b55", icon: <Flame size={13} />,        step: 1 },
  PREPARING:        { label: "Em Preparo",         color: "#f97316", glow: "#f9731655", icon: <ChefHat size={13} />,      step: 2 },
  OUT_FOR_DELIVERY: { label: "Saiu para Entrega",  color: "#3b82f6", glow: "#3b82f655", icon: <Bike size={13} />,         step: 3 },
  DONE:             { label: "Entregue",            color: "#22c55e", glow: "#22c55e55", icon: <CheckCircle2 size={13} />, step: 4 },
  CANCELLED:        { label: "Cancelado",           color: "#ef4444", glow: "#ef444455", icon: <XCircle size={13} />,     step: 0 },
};

// ─── Progress bar ───────────────────────────────────────────────────────────────
function OrderProgress({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.RECEIVED;
  if (status === "CANCELLED") return null;
  const steps = [
    { label: "Recebido", step: 1 },
    { label: "Preparo",  step: 2 },
    { label: "Entrega",  step: 3 },
    { label: "Entregue", step: 4 },
  ];
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((s, i) => {
        const active = cfg.step >= s.step;
        const current = cfg.step === s.step;
        
        // Verifica se a linha que conecta os pontos deve estar animada
        const isLineActive = cfg.step > s.step;
        const isOrderDone = cfg.step === 4;

        return (
          <div key={s.step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: active ? `2px solid ${cfg.color}` : "2px solid #2a2a2a", background: active ? `${cfg.color}22` : "#111", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: current ? `0 0 12px ${cfg.glow}` : "none", transition: "all 0.3s" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? cfg.color : "#333", transition: "all 0.3s" }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: active ? cfg.color : "#444", transition: "all 0.3s" }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              // ALTERAÇÃO SOLICITADA: Correção do conflito de estilos (React Warning)
              <div style={{ 
                flex: 1, 
                height: 3, 
                marginBottom: 18, 
                borderRadius: 2,
                backgroundColor: isLineActive && isOrderDone ? cfg.color : (!isLineActive ? "#1e1e1e" : "transparent"),
                backgroundImage: isLineActive && !isOrderDone ? `linear-gradient(90deg, ${cfg.color} 0%, #ffffff88 50%, ${cfg.color} 100%)` : "none",
                backgroundSize: isLineActive && !isOrderDone ? "200% 100%" : "100% 100%",
                animation: isLineActive && !isOrderDone ? "shimmerBar 1.2s infinite ease-in-out alternate" : "none",
                transition: "all 0.4s" 
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Card de pedido ─────────────────────────────────────────────────────────────
function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.RECEIVED;
  const date = new Date(order.createdAt);

  return (
    <div
      style={{ background: "#0e0e0e", border: "1px solid #1e1e1e", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", animation: `fadeSlideUp 0.4s ease both`, animationDelay: `${index * 0.07}s`, transition: "border-color 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 25px 70px rgba(0,0,0,0.7), 0 0 0 1px ${cfg.color}22`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.6)"; }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#0a0a0a", borderBottom: "1px solid #161616" }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#444", letterSpacing: "0.15em" }}>#{order.id.slice(-8).toUpperCase()}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${cfg.color}15`, border: `1px solid ${cfg.color}33`, padding: "4px 10px", borderRadius: 20 }}>
          <span style={{ color: cfg.color }}>{cfg.icon}</span>
          <span style={{ color: cfg.color, fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>{cfg.label}</span>
        </div>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ marginBottom: 20 }}><OrderProgress status={order.status} /></div>
        <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 12, fontWeight: 600 }}>
            <Calendar size={13} /><span>{date.toLocaleDateString("pt-BR")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 12, fontWeight: 600 }}>
            <Clock size={13} /><span>{date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          {(expanded ? order.items : order.items.slice(0, 2)).map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #141414" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: "#b91c1c", color: "#fff", fontSize: 10, fontWeight: 800, width: 24, height: 24, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic" }}>{item.quantity}x</span>
                <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.product?.name ?? "Produto"}</span>
              </div>
              <span style={{ color: "#555", fontSize: 12, fontFamily: "monospace" }}>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", cursor: "pointer", color: "#444", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 0", width: "100%", textAlign: "left", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")} onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
              {expanded ? "▲ Ocultar itens" : `▼ +${order.items.length - 2} itens`}
            </button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: "#080808", borderTop: "1px solid #141414" }}>
        <div>
          <div style={{ color: "#3a3a3a", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>Total</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ color: "#b91c1c", fontSize: 12, fontWeight: 800 }}>R$</span>
            <span style={{ color: "#fff", fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", fontStyle: "italic" }}>{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ height: 2, background: "#1a1a1a" }} />
      <div style={{ padding: "14px 20px", background: "#0a0a0a", display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 80, height: 12, background: "#1a1a1a", borderRadius: 4 }} />
        <div style={{ width: 100, height: 20, background: "#1a1a1a", borderRadius: 20 }} />
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ width: "100%", height: 8, background: "#141414", borderRadius: 4 }} />
        <div style={{ width: "60%", height: 8, background: "#141414", borderRadius: 4 }} />
        <div style={{ width: "80%", height: 8, background: "#141414", borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ALTERAÇÃO SOLICITADA: redireciona para login e faz polling (atualização automática)
  useEffect(() => {
    const isLogged = document.cookie.includes("user_session");
    if (!isLogged) { router.push("/login?callback=/my-orders"); return; }

    const fetchOrders = () => {
      fetch("/api/orders/user")
        .then((res) => res.json())
        .then((data) => { 
          setOrders(Array.isArray(data) ? data : []); 
          setLoading(false); // Tira o loading apenas na primeira vez
        })
        .catch(() => setLoading(false));
    };

    // Busca imediatamente ao abrir a tela
    fetchOrders();

    // Cria um loop invisível que atualiza os pedidos a cada 10 segundos
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    // Limpa o loop se o usuário sair da página (evita travar o celular)
    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flamePulse { 0%, 100% { text-shadow: 0 0 20px #b91c1c88; } 50% { text-shadow: 0 0 40px #b91c1ccc, 0 0 80px #b91c1c44; } }
        /* ALTERAÇÃO SOLICITADA: Animação de brilho nas barras */
        @keyframes shimmerBar {
          0% { background-position: 0% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Oswald', sans-serif" }}>
        <div style={{ height: 90 }} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")` }} />

        <main style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "40px 20px 160px" }}>
          <header style={{ marginBottom: 48, position: "relative", paddingLeft: 20 }}>
            <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "80%", background: "linear-gradient(180deg, #b91c1c, transparent)", boxShadow: "0 0 20px #b91c1c88", borderRadius: 2 }} />
            <h1 style={{ fontSize: "clamp(42px, 8vw, 64px)", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.95, margin: 0, animation: "flamePulse 3s ease-in-out infinite" }}>
              MEUS <span style={{ color: "#b91c1c" }}>PEDIDOS</span>
            </h1>
          </header>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 12, padding: "80px 40px", textAlign: "center", animation: "fadeSlideUp 0.4s ease both" }}>
              <Package size={52} color="#1e1e1e" style={{ margin: "0 auto 24px" }} />
              <p style={{ color: "#333", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 32 }}>Nenhum pedido encontrado na brasa.</p>
              <Link href="/cardapio" style={{ display: "inline-block", background: "#b91c1c", color: "#fff", padding: "14px 36px", fontWeight: 900, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", fontStyle: "italic", textDecoration: "none", borderRadius: 4, transition: "all 0.2s", boxShadow: "0 8px 30px #b91c1c44" }}>
                ACENDER A BRASA
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: "#333", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {orders.length} pedido{orders.length !== 1 ? "s" : ""} encontrado{orders.length !== 1 ? "s" : ""}
                </span>
                <div style={{ width: 40, height: 1, background: "#1e1e1e" }} />
              </div>
              {orders.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
            </div>
          )}
        </main>
        <div style={{ height: 120 }} />
      </div>
    </>
  );
}
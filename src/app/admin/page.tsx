"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  Flame, ChefHat, Bike, CheckCircle2, XCircle,
  ChevronDown, Calendar, Search, RefreshCw, User, Phone, Mail,
  Package, Clock, Filter, X
} from "lucide-react";

import { createPortal } from "react-dom";
// ── Tipos ─────────────────────────────────────────────────────────────────────
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
  paymentMethod: string;
  notes?: string;
  user: { name: string; email: string; phone?: string };
  items: OrderItem[];
}

// ── Status ────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  RECEIVED:         { label: "Recebido",         color: "#f59e0b", bg: "#f59e0b18", icon: <Flame size={13} />          },
  PREPARING:        { label: "Em Preparo",        color: "#f97316", bg: "#f9731618", icon: <ChefHat size={13} />      },
  OUT_FOR_DELIVERY: { label: "Saiu p/ Entrega",  color: "#3b82f6", bg: "#3b82f618", icon: <Bike size={13} />          },
  DONE:             { label: "Entregue",           color: "#22c55e", bg: "#22c55e18", icon: <CheckCircle2 size={13} /> },
  CANCELLED:        { label: "Cancelado",          color: "#ef4444", bg: "#ef444418", icon: <XCircle size={13} />      },
};

const STATUS_ORDER = ["RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DONE", "CANCELLED"];

// ── StatusSelector — ALTERAÇÃO SOLICITADA: modal centralizado ─────────────────
function StatusSelector({ orderId, current, onUpdate }: { orderId: string; current: string; onUpdate: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (newStatus: string) => {
    if (newStatus === current) { setOpen(false); return; }
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) onUpdate(orderId, newStatus);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cfg = STATUS_CONFIG[current];
  const isDisabled = loading || current === "DONE" || current === "CANCELLED";
  const isAnimated = !["DONE", "CANCELLED"].includes(current);

  const modal = open ? createPortal(
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.80)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0e0e0e", border: "1px solid #222", borderRadius: 14,
          minWidth: 320, overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
          animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}>
          <div>
            <p style={{ color: "#444", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>Atualizar status</p>
            <p style={{ color: "#666", fontSize: 11, fontFamily: "monospace", margin: "4px 0 0", letterSpacing: "0.1em" }}>#{orderId.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "#161616", border: "1px solid #222", color: "#555", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={13} />
          </button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {STATUS_ORDER.map((s) => {
            const c = STATUS_CONFIG[s];
            const isCurrent = s === current;
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 8,
                  background: isCurrent ? c.bg : "#111",
                  border: `1px solid ${isCurrent ? c.color + "55" : "#1a1a1a"}`,
                  color: isCurrent ? c.color : "#555",
                  fontSize: 12, fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isCurrent) { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#161616"; b.style.borderColor = "#2a2a2a"; b.style.color = "#888"; } }}
                onMouseLeave={e => { if (!isCurrent) { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#111"; b.style.borderColor = "#1a1a1a"; b.style.color = "#555"; } }}
              >
                <span style={{ color: c.color, display: "flex" }}>{c.icon}</span>
                {c.label}
                {isCurrent && (
                  <span style={{ marginLeft: "auto", fontSize: 9, background: c.color + "22", border: `1px solid ${c.color}44`, color: c.color, padding: "2px 8px", borderRadius: 10, fontWeight: 900 }}>
                    ATUAL
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={() => { if (!isDisabled) setOpen(true); }}
        disabled={isDisabled}
        className={isAnimated && !loading ? "shimmer-effect" : ""}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: cfg?.bg, border: `1px solid ${cfg?.color}44`,
          color: cfg?.color, padding: "6px 12px", borderRadius: 8,
          fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: isDisabled ? "default" : "pointer",
          opacity: loading ? 0.6 : 1, transition: "all 0.2s",
          position: "relative", overflow: "hidden"
        }}
      >
        {loading ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : cfg?.icon}
        {cfg?.label}
        {!isDisabled && <ChevronDown size={11} />}
      </button>
      {modal}
    </>
  );
}

// ── OrderRow ──────────────────────────────────────────────────────────────────
function OrderRow({ order, index, onUpdate }: { order: Order; index: number; onUpdate: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt);

  return (
    <>
      <tr
        style={{ background: index % 2 === 0 ? "#0a0a0a" : "#0c0c0c", borderBottom: "1px solid #141414", animation: "fadeIn 0.3s ease both", animationDelay: `${index * 0.04}s`, cursor: "pointer", transition: "background 0.15s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#0f0f0f")}
        onMouseLeave={e => (e.currentTarget.style.background = index % 2 === 0 ? "#0a0a0a" : "#0c0c0c")}
        onClick={() => setExpanded(!expanded)}
      >
        <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 11, color: "#444", letterSpacing: "0.12em" }}>#{order.id.slice(-8).toUpperCase()}</td>
        <td style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#ccc" }}>{order.user.name}</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{order.user.email}</div>
          {order.user.phone && <div style={{ fontSize: 11, color: "#444" }}>{order.user.phone}</div>}
        </td>
        <td style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#555", fontSize: 12, fontWeight: 600 }}><Calendar size={12} />{date.toLocaleDateString("pt-BR")}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#444", fontSize: 11, marginTop: 2 }}><Clock size={11} />{date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
        </td>
        <td style={{ padding: "14px 16px" }}><span style={{ color: "#555", fontSize: 12 }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span></td>
        <td style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ color: "#b91c1c", fontSize: 11, fontWeight: 800 }}>R$</span>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.02em" }}>{Number(order.total).toFixed(2)}</span>
          </div>
        </td>
        <td style={{ padding: "14px 16px" }} onClick={e => e.stopPropagation()}>
          <StatusSelector orderId={order.id} current={order.status} onUpdate={onUpdate} />
        </td>
        <td style={{ padding: "14px 16px", textAlign: "center" }}>
          <ChevronDown size={16} color="#333" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </td>
      </tr>

      {expanded && (
        <tr style={{ background: "#080808", borderBottom: "1px solid #1a1a1a" }}>
          <td colSpan={7} style={{ padding: "0 16px 20px" }}>
            <div style={{ paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ borderLeft: "2px solid #b91c1c", paddingLeft: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555" }}>Itens do Pedido</span>
                </div>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #111" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#b91c1c", color: "#fff", fontSize: 9, fontWeight: 900, width: 22, height: 22, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic" }}>{item.quantity}x</span>
                      <span style={{ color: "#bbb", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>{item.product?.name}</span>
                    </div>
                    <span style={{ color: "#444", fontSize: 12, fontFamily: "monospace" }}>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ borderLeft: "2px solid #b91c1c", paddingLeft: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555" }}>Cliente</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 12 }}><User size={13} color="#b91c1c" /> {order.user.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 12 }}><Mail size={13} color="#b91c1c" /> {order.user.email}</div>
                  {order.user.phone && <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 12 }}><Phone size={13} color="#b91c1c" /> {order.user.phone}</div>}
                </div>
                {order.notes && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ borderLeft: "2px solid #b91c1c", paddingLeft: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555" }}>Observações</span>
                    </div>
                    <p style={{ color: "#555", fontSize: 12, fontStyle: "italic", margin: 0 }}>"{order.notes}"</p>
                  </div>
                )}
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: "#333", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pagamento:</span>
                  <span style={{ fontSize: 11, color: "#555", fontWeight: 700 }}>{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  
  // Referência para contagem anterior para o som de alerta
  const prevCountRef = useRef(0);

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      
      // Gatilho do som se houver novos pedidos
      if (prevCountRef.current !== 0 && list.length > prevCountRef.current) {
        const audio = new Audio("/notification.mp3");
        audio.play().catch(e => console.log("Permissão de áudio pendente."));
      }

      setOrders(list);
      prevCountRef.current = list.length;
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Polling automático a cada 15 segundos
  useEffect(() => { 
    fetchOrders(); 
    const interval = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (filterStatus !== "ALL" && o.status !== filterStatus) return false;
      if (filterDate && !o.createdAt.startsWith(filterDate)) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.user.name.toLowerCase().includes(q) || o.user.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [orders, filterStatus, filterDate, search]);

  const stats = useMemo(() => {
    const total = orders.reduce((a, o) => a + Number(o.total), 0);
    const hoje = orders.filter(o => o.createdAt.startsWith(new Date().toISOString().slice(0, 10)));
    const ativos = orders.filter(o => !["DONE", "CANCELLED"].includes(o.status));
    return { total, hoje: hoje.length, ativos: ativos.length, todos: orders.length };
  }, [orders]);

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.92);} to{opacity:1;transform:scale(1);} }
        @keyframes spin    { to{transform:rotate(360deg);} }
        
        /* Efeito Shimmer (Cor vai e vem) */
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        .shimmer-effect::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 2.5s infinite;
        }

        .filter-btn { transition: all 0.2s; cursor: pointer; }
        .filter-btn:hover  { border-color: #b91c1c44 !important; color: #fff !important; }
        .filter-btn.active { background: #b91c1c18 !important; border-color: #b91c1c44 !important; color: #b91c1c !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.3); cursor: pointer; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Oswald', sans-serif" }}>
        <div style={{ height: 90 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>

          <header style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 32, height: 3, background: "linear-gradient(90deg,#b91c1c,#ff4d4d)", boxShadow: "0 0 12px #b91c1c", borderRadius: 2 }} />
              <span style={{ color: "#b91c1c", fontSize: 12, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>The Flame Grill</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div style={{ borderLeft: "3px solid #b91c1c", paddingLeft: 16, boxShadow: "-4px 0 16px #b91c1c22" }}>
                <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, fontStyle: "italic", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.95, margin: 0, color: "#e5e5e5" }}>
                  PAINEL <span style={{ color: "#b91c1c" }}>ADMIN</span>
                </h1>
              </div>
              <button onClick={() => fetchOrders()} style={{ display: "flex", alignItems: "center", gap: 7, background: "#111", border: "1px solid #222", color: "#666", padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#b91c1c44"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#222"; (e.currentTarget as HTMLButtonElement).style.color = "#666"; }}>
                <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                Atualizar
              </button>
            </div>
          </header>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Total Pedidos", value: stats.todos },
              { label: "Pedidos Hoje",  value: stats.hoje  },
              { label: "Em Aberto",     value: stats.ativos },
              { label: "Faturamento",   value: `R$ ${stats.total.toFixed(2)}` },
            ].map((s, i) => (
              <div key={s.label} style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 20px", animation: "fadeIn 0.4s ease both", animationDelay: `${i * 0.06}s` }}>
                <div style={{ height: 2, background: "linear-gradient(90deg,#b91c1c,transparent)", marginBottom: 12, borderRadius: 2 }} />
                <div style={{ fontSize: i === 3 ? 18 : 28, fontWeight: 900, fontStyle: "italic", color: "#fff", letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#444", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 20px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <Filter size={14} color="#333" />
            <div style={{ position: "relative", flex: "1 1 200px" }}>
              <Search size={13} color="#333" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input type="text" placeholder="Buscar cliente, e-mail ou protocolo..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", background: "#080808", border: "1px solid #1e1e1e", borderRadius: 6, padding: "8px 10px 8px 30px", color: "#ccc", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["ALL", ...STATUS_ORDER].map(s => {
                const cfg = s === "ALL" ? null : STATUS_CONFIG[s];
                return (
                  <button key={s} className={`filter-btn${filterStatus === s ? " active" : ""}`} onClick={() => setFilterStatus(s)}
                    style={{ background: "none", border: "1px solid #1e1e1e", color: "#444", padding: "6px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Oswald', sans-serif" }}>
                    {s === "ALL" ? "Todos" : cfg?.label}
                  </button>
                );
              })}
            </div>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              style={{ background: "#080808", border: "1px solid #1e1e1e", borderRadius: 6, padding: "7px 10px", color: "#666", fontSize: 12, outline: "none", fontFamily: "sans-serif", cursor: "pointer" }} />
            {filterDate && (
              <button onClick={() => setFilterDate("")} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>✕ Limpar data</button>
            )}
          </div>

          <div style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: 2, background: "linear-gradient(90deg,#b91c1c,#ff4d4d,transparent)" }} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #161616" }}>
                    {["Protocolo", "Cliente", "Data", "Itens", "Total", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#333" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} onUpdate={handleUpdate} />
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "12px 16px", borderTop: "1px solid #111", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#333", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {filtered.length} de {orders.length} pedido{orders.length !== 1 ? "s" : ""}
                </span>
                <span style={{ color: "#222", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Clique em um pedido para ver detalhes
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
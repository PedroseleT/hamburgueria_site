"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Bike, MapPin, Package, Loader2, ArrowLeft } from "lucide-react";

export default function EntregadorPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/user`); // Reutilizando a rota que busca pedidos
      const data = await res.json();
      const currentOrder = data.find((o: any) => o.id === params.id);
      
      if (!currentOrder) throw new Error("Pedido não encontrado.");
      setOrder(currentOrder);
    } catch (err) {
      setError("Erro ao carregar dados da entrega.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [params.id]);

  const finalizarEntrega = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      });

      if (res.ok) {
        setOrder({ ...order, status: "DONE" });
        alert("Entrega confirmada com sucesso! Bom trabalho.");
      }
    } catch (err) {
      alert("Erro ao confirmar entrega. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={containerStyle}><Loader2 className="animate-spin" color="#b91c1c" /></div>;
  if (error || !order) return <div style={containerStyle}><p>{error || "Pedido não encontrado"}</p></div>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <Bike size={24} color="#b91c1c" />
        <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>ENTREGA: #{order.id.slice(-6).toUpperCase()}</h1>
      </header>

      <main style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div style={cardStyle}>
          <div style={sectionStyle}>
            <MapPin size={16} color="#b91c1c" />
            <div>
              <p style={labelStyle}>CLIENTE</p>
              <p style={valueStyle}>{order.user?.name || "Cliente"}</p>
            </div>
          </div>

          <div style={sectionStyle}>
            <Package size={16} color="#b91c1c" />
            <div>
              <p style={labelStyle}>ITENS</p>
              {order.items.map((item: any) => (
                <p key={item.id} style={{ fontSize: '14px', color: '#ccc' }}>{item.quantity}x {item.product?.name}</p>
              ))}
            </div>
          </div>
        </div>

        {order.status !== "DONE" ? (
          <button 
            onClick={finalizarEntrega} 
            disabled={updating}
            style={btnConfirmarStyle}
          >
            {updating ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
            CONFIRMAR ENTREGA
          </button>
        ) : (
          <div style={statusFinalizadoStyle}>
            <CheckCircle size={32} color="#22c55e" />
            <p>ENTREGA FINALIZADA</p>
          </div>
        )}
        
        <button onClick={() => router.back()} style={btnVoltarStyle}>
          <ArrowLeft size={16} /> Voltar
        </button>
      </main>
    </div>
  );
}

// Estilos Mobile-First
const containerStyle: React.CSSProperties = { minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' };
const headerStyle: React.CSSProperties = { width: '100%', padding: '25px', background: '#0e0e0e', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '15px' };
const cardStyle: React.CSSProperties = { background: '#0e0e0e', borderRadius: '15px', padding: '20px', border: '1px solid #1a1a1a', marginBottom: '20px' };
const sectionStyle: React.CSSProperties = { display: 'flex', gap: '12px', marginBottom: '20px' };
const labelStyle: React.CSSProperties = { fontSize: '10px', color: '#555', fontWeight: 'bold', letterSpacing: '1px' };
const valueStyle: React.CSSProperties = { fontSize: '16px', fontWeight: 'bold', color: '#fff' };
const btnConfirmarStyle: React.CSSProperties = { width: '100%', padding: '20px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const statusFinalizadoStyle: React.CSSProperties = { textAlign: 'center', padding: '30px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid #22c55e44', color: '#22c55e', fontWeight: 'bold' };
const btnVoltarStyle: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', color: '#444', marginTop: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px' };
"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const finalizarPedidoWhatsApp = () => {
    const numeroWhatsApp = "5519992676339";
    let mensagem = "🍔 *Novo Pedido* \n\n";
    cart.forEach(item => mensagem += `*${item.quantity}x* ${item.name}\n`);
    mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", paddingBottom: "100px", paddingTop: '80px' }}>
      <section style={headerSection}>
        <span style={subtitleStyle}>Meu</span>
        <h1 style={titleStyle}>CARRINHO</h1>
      </section>

      <section style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>Seu carrinho está vazio.</p>
            <Link href="/cardapio" style={{ color: '#b91c1c' }}>VOLTAR AO CARDÁPIO</Link>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} style={thumbStyle} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "18px", textTransform: "uppercase" }}>{item.name}</h3>
                    <p style={{ color: "#b91c1c", fontWeight: "bold" }}>R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div style={qtyControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={qtyBtn}><Minus size={14}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}><Plus size={14}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={deleteBtn}><Trash2 size={20} /></button>
                </div>
              ))}
            </div>

            <div style={resumoStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "22px", fontWeight: "900" }}>
                <span>TOTAL:</span>
                <span style={{ color: "#b91c1c" }}>R$ {total.toFixed(2)}</span>
              </div>
              <button onClick={finalizarPedidoWhatsApp} className="btn-checkout">FINALIZAR NO WHATSAPP</button>
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        .cart-item {
          display: flex; align-items: center; gap: 15px; background: #111; padding: 15px; border-radius: 10px; border: 1px solid #222;
        }
        .btn-checkout {
          width: 100%; padding: 20px; background-color: #b91c1c; color: #fff; border: none; font-weight: bold; margin-top: 20px; cursor: pointer;
        }
        @media (max-width: 600px) {
          .cart-item { flex-wrap: wrap; justify-content: center; text-align: center; }
          .cart-item img { width: 100px; height: 100px; }
        }
      `}</style>
    </main>
  );
}

const headerSection: React.CSSProperties = { height: "250px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/banner-fome.jpg')", backgroundSize: "cover" };
const subtitleStyle: React.CSSProperties = { color: '#fff', fontSize: '16px', textTransform: 'uppercase', fontWeight: 'bold' };
const titleStyle: React.CSSProperties = { fontSize: '50px', fontWeight: '900', color: '#b91c1c', fontFamily: 'Impact' };
const thumbStyle: React.CSSProperties = { width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" };
const qtyControls: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", background: "#000", padding: "5px", borderRadius: "5px" };
const qtyBtn: React.CSSProperties = { background: "none", border: "none", color: "#b91c1c", cursor: "pointer" };
const deleteBtn: React.CSSProperties = { background: "none", border: "none", color: "#666", cursor: "pointer" };
const resumoStyle: React.CSSProperties = { marginTop: "30px", padding: "20px", background: "#111", borderRadius: "10px", textAlign: "center" };
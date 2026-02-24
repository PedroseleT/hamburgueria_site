"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingBasket } from "lucide-react";

export default function CardapioCompleto() {
  const { addToCart } = useCart();
  const router = useRouter();
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const [observacao, setObservacao] = useState("");

  const produtos = [
    { id: "1", nome: "Bacon Handcrafted", desc: "Blend bovino 180g, cheddar e bacon.", preco: 38.90, foto: "/person-holding-delicious-burger-with-beef-yellow-cheese-bacon.jpg" },
    { id: "2", nome: "Smoky Texas Grill", desc: "Hambúrguer na brasa e molho especial.", preco: 42.00, foto: "/grilled-gourmet-cheeseburger-with-fresh-vegetables-fries-generated-by-ai.jpg" },
    { id: "3", nome: "Double Cheddar Board", desc: "Dois smash burgers e fritas.", preco: 45.90, foto: "/still-life-delicious-american-hamburger.jpg" }
  ];

  // Listas sincronizadas com o Carrinho e Home
  const molhosGratis = [
    { nome: "Ketchup", preco: 0 },
    { nome: "Mostarda", preco: 0 },
    { nome: "Maionese Tradicional", preco: 0 }
  ];

  const molhosCasa = [
    { nome: "Maionese Artesanal 30ml", preco: 3.50 },
    { nome: "Barbecue Defumado 30ml", preco: 4.00 },
    { nome: "Chipotle Picante 30ml", preco: 4.50 }
  ];

  const complementos = [
    { nome: "Hambúrguer Extra 180g", preco: 12.00 },
    { nome: "Bacon em Tiras", preco: 6.00 },
    { nome: "Queijo Cheddar", preco: 5.00 },
    { nome: "Salada Fresca", preco: 3.00 }
  ];

  const handleOpenModal = (p: any) => {
    // Verifica login (opcional, mantido conforme seu original)
    const isLogged = document.cookie.includes("user_session");
    if (!isLogged) { router.push("/login?callback=/cardapio"); return; }
    
    setSelectedProduct(p);
    setQuantity(1);
    setCustomOptions([]);
    setObservacao("");
  };

  const updateOptionQtd = (item: any, delta: number, limit: number, sectionItems: any[]) => {
    const currentOptionsInSection = customOptions.filter(opt => sectionItems.some(s => s.nome === opt.nome));
    const totalInSection = currentOptionsInSection.reduce((acc, curr) => acc + curr.qtd, 0);
    const existingIndex = customOptions.findIndex(opt => opt.nome === item.nome);

    if (delta > 0 && totalInSection >= limit) return;

    let newOptions = [...customOptions];
    if (existingIndex > -1) {
      const newQtd = newOptions[existingIndex].qtd + delta;
      if (newQtd <= 0) newOptions.splice(existingIndex, 1);
      else newOptions[existingIndex].qtd = newQtd;
    } else if (delta > 0) {
      newOptions.push({ ...item, qtd: 1 });
    }
    setCustomOptions(newOptions);
  };

  const getQtd = (nome: string) => customOptions.find(o => o.nome === nome)?.qtd || 0;

  const handleConfirmarPedido = () => {
    const adicionalTotal = customOptions.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);
    
    addToCart({
      id: `${selectedProduct.id}-${Date.now()}`,
      name: selectedProduct.nome,
      price: selectedProduct.preco + adicionalTotal, // Preço com extras
      image: selectedProduct.foto,
      quantity: quantity,
      customization: {
        // PADRÃO DE SALVAMENTO: "1x Nome" (Crucial para a edição funcionar)
        extras: customOptions.map(o => `${o.qtd}x ${o.nome}`),
        obs: observacao
      }
    });
    
    setSelectedProduct(null);
    router.push("/carrinho");
  };

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#fff", paddingBottom: "100px", paddingTop: '80px' }}>
      <section style={headerSection}>
        <span style={subtitleStyle}>Escolha seu Burger</span>
        <h1 style={titleStyle}>CARDÁPIO</h1>
      </section>
      
      <div style={{ padding: "40px 20px" }}>
        <div className="menu-grid">
          {produtos.map((p) => (
            <div key={p.id} style={cardStyle}>
              <img src={p.foto} alt={p.nome} style={imgStyle} />
              <h3 style={{ marginTop: "15px", fontWeight: '900', fontSize: '20px' }}>{p.nome}</h3>
              <div style={{ color: "#b91c1c", fontWeight: "900", fontSize: "22px", margin: "10px 0" }}>
                R$ {p.preco.toFixed(2).replace(".", ",")}
              </div>
              <button onClick={() => handleOpenModal(p)} style={btnPedirStyle}>
                <ShoppingBasket size={18} /> PEDIR AGORA
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content custom-scrollbar">
            <button className="close-btn" onClick={() => setSelectedProduct(null)}><X size={20}/></button>
            <img src={selectedProduct.foto} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900' }}>{selectedProduct.nome}</h2>
              
              {[
                { title: "MOLHOS (GRÁTIS)", items: molhosGratis },
                { title: "MOLHOS DA CASA", items: molhosCasa },
                { title: "ADICIONAIS", items: complementos }
              ].map(section => (
                <div key={section.title} style={{ marginBottom: '20px' }}>
                  <h4 style={sectionTitleStyle}>{section.title} <small style={{float:'right', color:'#888'}}>Limite: 5</small></h4>
                  {section.items.map(item => (
                    <div key={item.nome} style={optionRowStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{fontWeight:'bold', fontSize: '15px'}}>{item.nome}</div>
                        {item.preco > 0 && <div style={{color:'#b91c1c', fontSize:'13px', fontWeight: 'bold'}}>+ R$ {item.preco.toFixed(2).replace('.',',')}</div>}
                      </div>
                      <div style={counterStyle}>
                        <button onClick={() => updateOptionQtd(item, -1, 5, section.items)} style={miniBtnStyle}><Minus size={14}/></button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{getQtd(item.nome)}</span>
                        <button onClick={() => updateOptionQtd(item, 1, 5, section.items)} style={miniBtnStyle}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <textarea placeholder="Observações..." value={observacao} onChange={(e)=>setObservacao(e.target.value)} style={textareaStyle} />

              <div style={footerModalStyle}>
                <div style={qtyContainerStyle}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={qtyBtnStyle}><Minus size={18}/></button>
                  <span style={{ fontWeight: 'bold' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={qtyBtnStyle}><Plus size={18}/></button>
                </div>
                <button onClick={handleConfirmarPedido} className="btn-confirmar">
                  ADICIONAR R$ {((selectedProduct.preco + customOptions.reduce((a,c)=>a+(c.preco*c.qtd),0))*quantity).toFixed(2).replace('.',',')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; max-width: 1200px; margin: 0 auto; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(5px); }
        .modal-content { background: #111; width: 100%; max-width: 480px; border-radius: 20px; overflow-y: auto; max-height: 85vh; border: 1px solid #333; position: relative; color: #fff; }
        .close-btn { position: absolute; top: 15px; right: 15px; background: #000; border: none; color: #fff; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; }
        .btn-confirmar { background: #b91c1c; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: bold; cursor: pointer; flex: 1; margin-left: 15px; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #b91c1c; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// Estilos Cardápio
const headerSection: React.CSSProperties = { height: "250px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/banner-fome.jpg')", backgroundSize: "cover" };
const subtitleStyle: React.CSSProperties = { color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '4px' };
const titleStyle: React.CSSProperties = { fontSize: '60px', fontWeight: '900', color: '#b91c1c', fontFamily: 'Impact' };
const cardStyle: React.CSSProperties = { background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #222", textAlign: "center" };
const imgStyle: React.CSSProperties = { width: "100%", height: "200px", objectFit: "cover", borderRadius: '8px' };
const btnPedirStyle: React.CSSProperties = { width: "100%", padding: "14px", color: "#fff", background: "#b91c1c", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const sectionTitleStyle: React.CSSProperties = { fontSize: '13px', borderLeft: '4px solid #b91c1c', paddingLeft: '10px', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' };
const optionRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #222' };
const counterStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', background: '#000', padding: '5px 12px', borderRadius: '20px', border: '1px solid #333' };
const miniBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' };
const textareaStyle: React.CSSProperties = { width: '100%', background: '#000', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', height: '60px', margin: '15px 0' };
const footerModalStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', borderTop: '1px solid #222', paddingTop: '15px' };
const qtyContainerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', background: '#1a1a1a', padding: '10px 15px', borderRadius: '10px' };
const qtyBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' };
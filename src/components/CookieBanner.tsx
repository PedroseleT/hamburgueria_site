"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X, Check } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (decision: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", decision);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={wrapper}>
      <div style={container}>
        <div style={iconBox}><Cookie size={24} color="#b91c1c" /></div>
        <div style={{ flex: 1 }}>
          <h4 style={title}>PRIVACIDADE NA BRASA</h4>
          <p style={desc}>Usamos cookies para deixar sua experiência mais saborosa. Aceita?</p>
        </div>
        <div style={group}>
          <button onClick={() => handleConsent("declined")} style={btnDecline}>RECUSAR</button>
          <button onClick={() => handleConsent("accepted")} style={btnAccept}><Check size={14}/> ACEITAR</button>
        </div>
      </div>
    </div>
  );
}

const wrapper: React.CSSProperties = { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10000, width: '95%', maxWidth: '600px' };
const container: React.CSSProperties = { background: '#111', border: '1px solid #222', borderRadius: '15px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', flexWrap: 'wrap' };
const iconBox: React.CSSProperties = { background: 'rgba(185,28,28,0.1)', padding: '12px', borderRadius: '10px' };
const title: React.CSSProperties = { fontSize: '12px', fontWeight: '900', letterSpacing: '1px', margin: '0 0 3px 0', color: '#fff' };
const desc: React.CSSProperties = { fontSize: '11px', color: '#888', margin: 0 };
const group: React.CSSProperties = { display: 'flex', gap: '10px' };
const btnAccept: React.CSSProperties = { background: '#b91c1c', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const btnDecline: React.CSSProperties = { background: 'transparent', color: '#555', border: '1px solid #222', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' };
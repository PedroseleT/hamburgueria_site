"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [status, setStatus] = useState({ sent: false, verified: false, loading: false });
  const [codes, setCodes] = useState({ server: "", user: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validação profissional campo a campo
  const validate = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!formData.email.includes("@")) newErrors.email = "E-mail inválido.";
    if (formData.phone.length < 10) newErrors.phone = "Número de WhatsApp inválido.";
    if (!status.verified) newErrors.phone = "Você precisa validar o WhatsApp primeiro.";
    if (formData.password.length < 6) newErrors.password = "A senha deve ter pelo menos 6 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envio do código via Z-API
  const handleSendCode = async () => {
    if (formData.phone.length < 10) {
      setErrors({ ...errors, phone: "Digite um WhatsApp válido para validar." });
      return;
    }
    setStatus({ ...status, loading: true });
    setErrors({ ...errors, phone: "" });

    try {
      const res = await fetch("/api/auth/send-sms", {
        method: "POST",
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setCodes({ ...codes, server: data.code });
        setStatus({ ...status, sent: true, loading: false });
      }
    } catch {
      setStatus({ ...status, loading: false });
      setErrors({ ...errors, phone: "Erro ao conectar com o serviço de SMS." });
    }
  };

  const handleVerify = () => {
    if (codes.user === codes.server && codes.server !== "") {
      setStatus({ ...status, verified: true });
      setErrors({ ...errors, phone: "" });
    } else {
      setErrors({ ...errors, phone: "Código de verificação incorreto." });
    }
  };

  // SALVAR NO BANCO DE DADOS (PRISMA)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStatus({ ...status, loading: true });
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          }),
        });

        if (res.ok) {
          alert("🍟 Cadastro realizado com sucesso!");
          window.location.href = "/"; // Redireciona e atualiza os cookies da sessão
        } else {
          const errorData = await res.json();
          setErrors({ ...errors, email: errorData.error || "Erro ao cadastrar. Verifique os dados." });
        }
      } catch (err) {
        setErrors({ ...errors, email: "Erro de conexão com o servidor." });
      } finally {
        setStatus({ ...status, loading: false });
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoContainer}>
          <img src="/logo_hamburgueria.png" alt="Logo" style={{ height: "60px", marginBottom: "10px" }} />
          <h1 style={brandStyle}>CADASTRO</h1>
          <p style={subtitleStyle}>O BRASIL EM CADA MORDIDA</p>
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          {/* NOME */}
          <div style={inputGroup}>
            <label style={labelStyle}>NOME COMPLETO</label>
            <input 
              style={{...inputStyle, border: errors.name ? "1px solid #b91c1c" : "1px solid #1a1a1a"}} 
              placeholder="Ex: Pedro Silva"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
          </div>

          {/* EMAIL */}
          <div style={inputGroup}>
            <label style={labelStyle}>E-MAIL</label>
            <input 
              type="email" 
              style={{...inputStyle, border: errors.email ? "1px solid #b91c1c" : "1px solid #1a1a1a"}} 
              placeholder="seu@email.com"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
          </div>

          {/* WHATSAPP */}
          <div style={inputGroup}>
            <label style={labelStyle}>WHATSAPP (DDD)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                style={{...inputStyle, border: status.verified ? "1px solid #15803d" : errors.phone ? "1px solid #b91c1c" : "1px solid #1a1a1a"}} 
                placeholder="11999999999"
                disabled={status.verified}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              {!status.verified && (
                <button type="button" onClick={handleSendCode} style={verifyButtonStyle}>
                  {status.loading ? "..." : status.sent ? "REENVIAR" : "VALIDAR"}
                </button>
              )}
            </div>
            {errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
          </div>

          {/* BOX DE CÓDIGO */}
          {status.sent && !status.verified && (
            <div style={verifyBox}>
              <p style={{fontSize: '11px', color: '#999', marginBottom: '10px'}}>DIGITE O CÓDIGO DO WHATSAPP:</p>
              <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                <input 
                  maxLength={4} 
                  style={{...inputStyle, width: '100px', textAlign: 'center', fontSize: '20px'}} 
                  placeholder="0000"
                  onChange={e => setCodes({...codes, user: e.target.value})}
                />
                <button type="button" onClick={handleVerify} style={confirmButtonStyle}>OK</button>
              </div>
            </div>
          )}

          {/* SENHA */}
          <div style={inputGroup}>
            <label style={labelStyle}>SUA SENHA</label>
            <input 
              type="password" 
              style={{...inputStyle, border: errors.password ? "1px solid #b91c1c" : "1px solid #1a1a1a"}} 
              placeholder="••••••••"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
          </div>

          <button type="submit" style={buttonStyle} disabled={status.loading}>
            {status.loading ? "PROCESSANDO..." : "FINALIZAR CADASTRO"}
          </button>
        </form>

        <p style={footerTextStyle}>
          Já tem uma conta? <Link href="/login" style={linkStyle}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

// ESTILOS PREMIUM BASEADOS NAS IMAGENS
const containerStyle: React.CSSProperties = { minHeight: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 20px" };
const cardStyle: React.CSSProperties = { backgroundColor: "#0a0a0a", padding: "50px 40px", borderRadius: "12px", width: "100%", maxWidth: "450px", border: "1px solid #1a1a1a", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" };
const brandStyle: React.CSSProperties = { color: "#fff", fontSize: "32px", fontWeight: "900", letterSpacing: "2px", margin: "10px 0" };
const subtitleStyle: React.CSSProperties = { color: "#b91c1c", fontSize: "12px", marginBottom: "40px", fontWeight: "bold", letterSpacing: "1px" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "25px" };
const inputGroup: React.CSSProperties = { textAlign: "left" };
const labelStyle: React.CSSProperties = { color: "#999", fontSize: "12px", fontWeight: "900", marginBottom: "10px", display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "16px", backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", color: "#fff", outline: "none", boxSizing: "border-box", fontSize: "14px" };
const buttonStyle: React.CSSProperties = { backgroundColor: "#b91c1c", color: "#fff", padding: "18px", borderRadius: "8px", fontWeight: "900", border: "none", cursor: "pointer", marginTop: "10px", textTransform: "uppercase", letterSpacing: "1px" };
const errorTextStyle: React.CSSProperties = { color: "#b91c1c", fontSize: "11px", marginTop: "6px", display: "block", fontWeight: "bold" };
const verifyButtonStyle: React.CSSProperties = { backgroundColor: "#b91c1c", color: "#fff", border: "none", padding: "0 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" };
const confirmButtonStyle: React.CSSProperties = { backgroundColor: "#15803d", color: "#fff", border: "none", padding: "0 25px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const verifyBox: React.CSSProperties = { padding: "20px", backgroundColor: "#050505", borderRadius: "8px", border: "1px dashed #333" };
const footerTextStyle: React.CSSProperties = { color: "#555", fontSize: "14px", marginTop: "30px" };
const linkStyle: React.CSSProperties = { color: "#b91c1c", fontWeight: "bold", textDecoration: "none" };
const logoContainer: React.CSSProperties = { marginBottom: "10px" };
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [originalData, setOriginalData] = useState({ email: "", phone: "" });
  const [status, setStatus] = useState({ sent: false, verified: true, loading: false });
  const [codes, setCodes] = useState({ server: "", user: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) {
        try {
          const data = JSON.parse(decodeURIComponent(match[2]));
          const formattedData = {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone ? maskPhone(data.phone) : "",
            password: "" 
          };
          setFormData(formattedData);
          setOriginalData({ email: formattedData.email, phone: formattedData.phone });
          return data;
        } catch { return null; }
      }
    };
    const session = getCookie("user_session");
    if (!session) router.push("/login");
  }, [router]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
    setSuccessMessage("");
  };

  // AGORA VALIDA O E-MAIL EM VEZ DO SMS
  const handleSendCode = async () => {
    if (!formData.email.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }
    setStatus({ ...status, loading: true });
    try {
      const res = await fetch("/api/auth/send-email", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setCodes({ ...codes, server: data.code });
        setStatus({ ...status, sent: true, loading: false, verified: false });
        setError("");
      }
    } catch {
      setStatus({ ...status, loading: false });
      setError("Erro ao enviar código de verificação.");
    }
  };

  const handleVerify = () => {
    if (codes.user === codes.server && codes.server !== "") {
      setStatus({ ...status, verified: true, sent: false });
      setOriginalData({ ...originalData, email: formData.email });
      setError("");
    } else {
      setError("Código incorreto.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status.verified) {
      setError("Valide o novo e-mail primeiro.");
      return;
    }
    
    setStatus({ ...status, loading: true });
    setError("");

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          originalEmail: originalData.email 
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: "" }));
        setOriginalData({ email: formData.email, phone: formData.phone });
        setStatus({ ...status, loading: false });
        setSuccessMessage("Dados atualizados com sucesso!");
        router.refresh(); 
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao salvar.");
        setStatus({ ...status, loading: false });
      }
    } catch {
      setError("Erro de conexão.");
      setStatus({ ...status, loading: false });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={brandStyle}>MINHA CONTA</h1>
        
        <form style={formStyle} onSubmit={handleSubmit}>
          {/* NOME */}
          <div style={inputGroup}>
            <label style={labelStyle}>NOME</label>
            <input 
              value={formData.name || ""} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              readOnly={!isEditing}
              style={{...inputStyle, opacity: isEditing ? 1 : 0.6, border: isEditing ? "1px solid #b91c1c" : "1px solid #222"}} 
            />
          </div>

          {/* E-MAIL (COM VALIDAÇÃO AGORA) */}
          <div style={inputGroup}>
            <label style={labelStyle}>E-MAIL</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                value={formData.email || ""} 
                onChange={(e) => {
                    const newEmail = e.target.value;
                    setFormData({...formData, email: newEmail});
                    setStatus({ ...status, verified: newEmail === originalData.email });
                }}
                readOnly={!isEditing}
                style={{...inputStyle, flex: 1, opacity: isEditing ? 1 : 0.6, border: !status.verified && isEditing ? "1px solid #f59e0b" : isEditing ? "1px solid #b91c1c" : "1px solid #222"}} 
                />
                {isEditing && !status.verified && (
                <button type="button" onClick={handleSendCode} style={verifyButtonStyle}>
                    {status.loading ? "..." : "VALIDAR"}
                </button>
                )}
            </div>
          </div>

          {/* WHATSAPP (APENAS MÁSCARA, SEM TRAVA DE SMS) */}
          <div style={inputGroup}>
            <label style={labelStyle}>WHATSAPP</label>
            <input 
                value={formData.phone || ""} 
                onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                readOnly={!isEditing}
                placeholder="(00) 00000-0000"
                style={{...inputStyle, opacity: isEditing ? 1 : 0.6, border: isEditing ? "1px solid #b91c1c" : "1px solid #222"}} 
            />
          </div>

          {isEditing && (
            <div style={inputGroup}>
              <label style={labelStyle}>NOVA SENHA (DEIXE EM BRANCO PARA MANTER)</label>
              <input 
                type="password"
                placeholder="********"
                value={formData.password || ""} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{...inputStyle, border: "1px solid #b91c1c"}} 
              />
            </div>
          )}

          {status.sent && (
            <div style={verifyBox}>
              <p style={{fontSize: '10px', color: '#666', marginBottom: '8px'}}>CÓDIGO ENVIADO PARA O NOVO E-MAIL:</p>
              <div style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                <input 
                  maxLength={4} 
                  style={{...inputStyle, width: '80px', textAlign: 'center'}} 
                  placeholder="0000"
                  onChange={e => setCodes({...codes, user: e.target.value})}
                />
                <button type="button" onClick={handleVerify} style={confirmButtonStyle}>OK</button>
              </div>
            </div>
          )}

          {error && <span style={errorTextStyle}>{error}</span>}
          {successMessage && <span style={successTextStyle}>{successMessage}</span>}

          {!isEditing ? (
            <button type="button" onClick={handleEditClick} style={buttonStyle}>EDITAR MEUS DADOS</button>
          ) : (
            <button 
              type="submit" 
              style={{...saveButtonStyle, opacity: status.verified ? 1 : 0.5, cursor: (status.verified && !status.loading) ? "pointer" : "not-allowed"}}
              disabled={!status.verified || status.loading}
            >
              {status.loading ? "SALVANDO..." : status.verified ? "SALVAR ALTERAÇÕES" : "AGUARDANDO VALIDAÇÃO DE E-MAIL"}
            </button>
          )}
          
          {/* BOTÃO SAIR DA CONTA ATUALIZADO */}
<button 
  type="button" 
  onClick={() => {
    // 1. Limpa o Cookie de Sessão
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 2. # ALTERAÇÃO SOLICITADA: Limpa o LocalStorage (Carrinho e Endereços)
    // Isso evita que a conta nova herde lixo da conta antiga
    localStorage.clear();

    // 3. Limpa caches de sessão do navegador
    sessionStorage.clear();

    // 4. Redireciona e força um reload total para limpar o estado da aplicação
    window.location.href = "/login";
  }} 
  style={logoutButtonStyle}
>
  SAIR DA CONTA
</button>
        </form>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { minHeight: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 20px" };
const cardStyle: React.CSSProperties = { backgroundColor: "#0a0a0a", padding: "40px", borderRadius: "8px", width: "100%", maxWidth: "420px", border: "1px solid #b91c1c", textAlign: "center" };
const brandStyle: React.CSSProperties = { color: "#fff", fontSize: "24px", fontWeight: "900", marginBottom: "30px" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup: React.CSSProperties = { textAlign: "left" };
const labelStyle: React.CSSProperties = { color: "#999", fontSize: "11px", fontWeight: "bold", marginBottom: "8px", display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "4px", color: "#fff", outline: "none", boxSizing: "border-box" };
const buttonStyle: React.CSSProperties = { backgroundColor: "#b91c1c", color: "#fff", padding: "14px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", border: "none" };
const saveButtonStyle: React.CSSProperties = { backgroundColor: "#15803d", color: "#fff", padding: "14px", borderRadius: "4px", fontWeight: "bold", border: "none" };
const verifyButtonStyle: React.CSSProperties = { backgroundColor: "#b91c1c", color: "#fff", border: "none", borderRadius: "4px", padding: "0 15px", cursor: "pointer", fontSize: "10px", fontWeight: 'bold' };
const confirmButtonStyle: React.CSSProperties = { backgroundColor: "#15803d", color: "#fff", border: "none", padding: "0 20px", borderRadius: "4px", cursor: "pointer" };
const verifyBox: React.CSSProperties = { padding: "15px", backgroundColor: "#050505", borderRadius: "4px", border: "1px dashed #333" };
const errorTextStyle: React.CSSProperties = { color: "#b91c1c", fontSize: "11px", fontWeight: "bold" };
const successTextStyle: React.CSSProperties = { color: "#15803d", fontSize: "11px", fontWeight: "bold" };
const logoutButtonStyle: React.CSSProperties = { backgroundColor: "transparent", color: "#555", padding: "10px", cursor: "pointer", border: "none", fontSize: "12px", marginTop: "10px" };
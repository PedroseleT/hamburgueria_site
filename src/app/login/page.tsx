"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // PROTEÇÃO: Se já estiver logado, não deixa ficar na página de login
  useEffect(() => {
    const hasSession = document.cookie.includes("user_session");
    if (hasSession) {
      router.push("/");
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();

      if (response.ok) {
        // Redireciona e atualiza a página para a Navbar notar o login
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Falha ao entrar. Verifique seus dados.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoContainer}>
          <span style={{ fontSize: "40px" }}>🔥</span>
          <h1 style={brandStyle}>ENTRAR</h1>
          <p style={subtitleStyle}>Acesse sua conta para pedir</p>
        </div>

        {error && (
          <div style={errorBoxStyle}>
            {error}
          </div>
        )}

        <form style={formStyle} onSubmit={handleLogin}>
          <div style={inputGroup}>
            <label style={labelStyle}>E-MAIL</label>
            <input name="email" type="email" placeholder="seu@email.com" style={inputStyle} required />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>SENHA</label>
            <input name="password" type="password" placeholder="••••••••" style={inputStyle} required />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "CARREGANDO..." : "ENTRAR"}
          </button>
        </form>

        <p style={footerTextStyle}>
          Ainda não tem conta? <Link href="/register" style={linkStyle}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

// ESTILOS MANTIDOS E ALINHADOS COM A MARCA
const errorBoxStyle: React.CSSProperties = {
  backgroundColor: "rgba(185, 28, 28, 0.1)",
  color: "#b91c1c",
  padding: "10px",
  borderRadius: "4px",
  fontSize: "13px",
  marginBottom: "20px",
  border: "1px solid #b91c1c",
  textAlign: "center"
};

const containerStyle: React.CSSProperties = { minHeight: "100vh", backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 20px 40px 20px" };
const cardStyle: React.CSSProperties = { backgroundColor: "#0a0a0a", padding: "50px 40px", borderRadius: "8px", width: "100%", maxWidth: "420px", border: "1px solid #1a1a1a", textAlign: "center" };
const brandStyle: React.CSSProperties = { color: "#fff", fontSize: "28px", fontWeight: "900", letterSpacing: "3px", margin: "10px 0" };
const subtitleStyle: React.CSSProperties = { color: "#666", fontSize: "13px", marginBottom: "40px", textTransform: "uppercase" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "25px" };
const inputGroup: React.CSSProperties = { textAlign: "left" };
const labelStyle: React.CSSProperties = { color: "#999", fontSize: "11px", fontWeight: "bold", marginBottom: "10px", display: "block" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "15px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "4px", color: "#fff", outline: "none" };
const buttonStyle: React.CSSProperties = { backgroundColor: "#b91c1c", color: "#fff", padding: "16px", borderRadius: "4px", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "15px" };
const footerTextStyle: React.CSSProperties = { color: "#555", fontSize: "13px", marginTop: "30px" };
const linkStyle: React.CSSProperties = { color: "#b91c1c", fontWeight: "bold", textDecoration: "none" };
const logoContainer: React.CSSProperties = { marginBottom: "10px" };
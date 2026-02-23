"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Enviando...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Usuário criado! Redirecionando...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      setStatus("❌ Erro ao conectar com o servidor.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#111", padding: "40px", borderRadius: "10px", width: "100%", maxWidth: "400px", border: "1px solid #b91c1c" }}>
        <h2 style={{ color: "#b91c1c", textAlign: "center", marginBottom: "30px" }}>CADASTRAR ADMIN</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Nome:</label>
          <input type="text" required style={{ width: "100%", padding: "10px", backgroundColor: "#222", border: "1px solid #333", color: "#fff" }}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>E-mail:</label>
          <input type="email" required style={{ width: "100%", padding: "10px", backgroundColor: "#222", border: "1px solid #333", color: "#fff" }}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Senha:</label>
          <input type="password" required style={{ width: "100%", padding: "10px", backgroundColor: "#222", border: "1px solid #333", color: "#fff" }}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>

        <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#b91c1c", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>
          CRIAR CONTA
        </button>

        {status && <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>{status}</p>}
      </form>
    </main>
  );
}
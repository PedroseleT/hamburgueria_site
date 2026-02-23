"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao entrar");

      router.push("/cardapio");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 mb-4 relative">
             {/* Substitua pelo caminho real da sua logo se preferir */}
            <div className="text-4xl text-center">🔥</div> 
            <h1 className="text-white font-bold text-xl mt-2 tracking-widest uppercase">The Flame Grill</h1>
          </div>
          <h2 className="text-zinc-400 text-sm">Acesse sua conta para pedir</h2>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">E-mail</label>
            <input
              type="email"
              required
              placeholder="exemplo@email.com"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Senha</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 py-3 text-white font-bold uppercase tracking-widest hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-orange-900/20"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-zinc-500">
            Ainda não tem conta?{" "}
            <Link href="/register" className="font-bold text-orange-500 hover:text-orange-400 underline-offset-4 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
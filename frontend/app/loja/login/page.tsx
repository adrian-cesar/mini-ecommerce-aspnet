"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

type Mode = "login" | "register";

function LojaLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/loja";
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, senha);
      } else {
        await register(nome, email, senha);
      }
      router.push(redirectTo);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível concluir a operação";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#f5f3fa" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8" style={{ border: "1px solid #e8e2f4" }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 cursor-pointer" onClick={() => router.push("/loja")}>
              <Image
                src="/primebox-logo.svg"
                alt="PrimeBox"
                width={200}
                height={70}
                className="w-48 h-auto"
              />
            </div>
            <p className="text-sm" style={{ color: "#6e52a8" }}>
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-4 rounded-lg border text-sm font-medium"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {error}
              </div>
            )}

            {mode === "register" && (
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#2d1f3d" }}
                >
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                  style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#2d1f3d" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#2d1f3d" }}
              >
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 font-bold rounded-lg text-white transition-colors disabled:opacity-50 cursor-pointer"
              style={{ background: "#E24B4A" }}
              onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#A32D2D"; }}
              onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#E24B4A"; }}
            >
              {isSubmitting
                ? "Aguarde..."
                : mode === "login"
                ? "Entrar"
                : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#6e52a8" }}>
            {mode === "login" ? (
              <>
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-semibold transition-colors"
                  style={{ color: "#4a3570" }}
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-semibold transition-colors"
                  style={{ color: "#4a3570" }}
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LojaLoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: "#f5f3fa" }}
        >
          <p style={{ color: "#6e52a8" }}>Carregando...</p>
        </div>
      }
    >
      <LojaLoginContent />
    </Suspense>
  );
}

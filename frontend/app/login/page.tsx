"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, logout, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAdmin, router]);

  if (isAuthenticated && isAdmin) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);

      if (loggedUser.role !== "admin") {
        await logout();
        setError("Acesso restrito ao painel administrativo");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao fazer login";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1a1220 0%, #2d1f3d 50%, #4a3570 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-2xl p-8" style={{ background: "#ffffff" }}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/primebox-logo.svg"
                alt="PrimeBox"
                width={220}
                height={80}
                className="w-56 h-auto"
              />
            </div>
            <p className="text-sm mt-1" style={{ color: "#6e52a8" }}>
              Painel de Gerenciamento
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-4 rounded-lg border text-sm font-medium"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {error}
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
                disabled={isLoading}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                style={{
                  border: "2px solid #e8e2f4",
                  color: "#1a1220",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#2d1f3d" }}
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                style={{
                  border: "2px solid #e8e2f4",
                  color: "#1a1220",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 font-bold rounded-lg text-white transition-colors disabled:opacity-50 cursor-pointer"
              style={{ background: "#E24B4A" }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#A32D2D"; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "#E24B4A"; }}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#9b7fd4" }}>
            admin@primebox.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

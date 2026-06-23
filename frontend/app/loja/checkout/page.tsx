"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useClients } from "@/hooks/useClients";
import { useSales } from "@/hooks/useSales";
import { useAuth } from "@/hooks/useAuth";
import { LojaHeader } from "@/components/LojaHeader";
import { emitDataRefresh } from "@/lib/dataRefresh";
import { apiFetch } from "@/lib/api";

const steps = [
  { key: "cart", label: "Carrinho" },
  { key: "client", label: "Cliente" },
  { key: "payment", label: "Pagamento" },
  { key: "success", label: "Concluído" },
] as const;

type Step = (typeof steps)[number]["key"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { createGuest } = useClients();
  const { createSale } = useSales();
  const { user, isAuthenticated, isLoading: authLoading, register } = useAuth();

  const [step, setStep] = useState<Step>("cart");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [newAccount, setNewAccount] = useState({ nome: "", email: "", senha: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve automaticamente o clienteId de quem já está autenticado (não precisa do step "client").
  // Se a resolução acontecer durante o step "client" (registro feito no checkout), avança para o pagamento.
  useEffect(() => {
    if (authLoading || !user || selectedClientId !== null) return;

    let active = true;
    apiFetch<{ id: number }>(`/cliente/por-usuario/${user.id}`)
      .then((cliente) => {
        if (!active) return;
        setSelectedClientId(cliente.id);
        setStep((prev) => (prev === "client" ? "payment" : prev));
        setIsProcessing(false);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar seus dados");
        }
      });

    return () => {
      active = false;
    };
  }, [authLoading, user, selectedClientId]);

  const handleRegisterAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newAccount.nome || !newAccount.email || !newAccount.senha) {
      setError("Nome, email e senha são obrigatórios");
      return;
    }

    setIsProcessing(true);

    try {
      await register(newAccount.nome, newAccount.email, newAccount.senha);
      // selectedClientId é resolvido pelo efeito acima quando o usuário autenticado muda,
      // o que também dispara o avanço automático para o step "payment".
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
      setIsProcessing(false);
    }
  };

  const handleFinalizePurchase = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let clientId = selectedClientId;

      if (!clientId) {
        try {
          const guest = await createGuest();
          clientId = guest.id;
          setSelectedClientId(guest.id);
        } catch {
          setError("Cliente não selecionado e não foi possível criar convidado");
          setIsProcessing(false);
          return;
        }
      }

      if (items.length === 0) {
        setError("Carrinho vazio");
        setIsProcessing(false);
        return;
      }

      await createSale({
        clienteId: clientId,
        itens: items.map((item) => ({
          produtoId: item.product.id,
          quantidade: item.quantity,
        })),
      });

      clearCart();
      emitDataRefresh();
      setStep("success");

      setTimeout(() => {
        router.push(`/loja/meus-pedidos?clienteId=${clientId}`);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao finalizar compra";
      console.error("Erro ao finalizar compra:", err);
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const currentStepIdx = steps.findIndex((s) => s.key === step);

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
        <LojaHeader />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
          <div className="text-center">
            <p className="text-lg mb-4" style={{ color: "#6e52a8" }}>
              Seu carrinho está vazio
            </p>
            <button
              onClick={() => router.push("/loja")}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ background: "#E24B4A" }}
            >
              Voltar para a loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
      <LojaHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={
                      idx <= currentStepIdx
                        ? { background: "#E24B4A", color: "#ffffff" }
                        : { background: "#e8e2f4", color: "#9b7fd4" }
                    }
                  >
                    {idx + 1}
                  </div>
                  <span
                    className="text-xs mt-1 font-medium hidden sm:block"
                    style={{ color: idx <= currentStepIdx ? "#E24B4A" : "#9b7fd4" }}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className="flex-1 h-1 mx-2"
                    style={{
                      background: idx < currentStepIdx
                        ? "linear-gradient(90deg, #E24B4A, #6e52a8)"
                        : "#e8e2f4",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success */}
        {step === "success" && (
          <div
            className="bg-white rounded-xl shadow p-12 text-center"
            style={{ border: "1px solid #e8e2f4" }}
          >
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#1a1220" }}>
              Compra Finalizada!
            </h1>
            <p className="mb-6" style={{ color: "#6e52a8" }}>
              Sua compra foi registrada com sucesso. Redirecionando para seus pedidos...
            </p>
            <button
              onClick={() => router.push("/loja")}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ background: "#E24B4A" }}
            >
              Voltar para a loja
            </button>
          </div>
        )}

        {/* Cart Step */}
        {step === "cart" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
              Seu Carrinho
            </h1>

            <div
              className="bg-white rounded-xl shadow overflow-hidden"
              style={{ border: "1px solid #e8e2f4" }}
            >
              <div className="p-6 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center p-4 rounded-lg"
                    style={{ border: "1px solid #f0ecfa" }}
                  >
                    <div>
                      <h3 className="font-semibold" style={{ color: "#1a1220" }}>
                        {item.product.nome}
                      </h3>
                      <p className="text-sm" style={{ color: "#9b7fd4" }}>
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <span className="text-lg font-bold" style={{ color: "#E24B4A" }}>
                      R$ {(item.product.preco * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="pt-4 text-right" style={{ borderTop: "2px solid #f0ecfa", marginTop: "8px" }}>
                  <div className="text-2xl font-bold" style={{ color: "#1a1220" }}>
                    Total: R$ {total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div
                className="p-4 rounded-lg border text-sm"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/loja")}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ border: "2px solid #e8e2f4", color: "#4a3570" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6e52a8";
                  e.currentTarget.style.background = "#f0ecfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e2f4";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  if (isAuthenticated && selectedClientId !== null) {
                    setStep("payment");
                  } else {
                    setStep("client");
                  }
                }}
                disabled={isAuthenticated && selectedClientId === null}
                className="flex-1 px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                style={{ background: "#E24B4A" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
              >
                {isAuthenticated && selectedClientId === null ? "Carregando seus dados..." : "Continuar"}
              </button>
            </div>
          </div>
        )}

        {/* Client Step */}
        {step === "client" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
              Quem você é?
            </h1>

            {error && (
              <div
                className="p-4 rounded-lg border text-sm"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {error}
              </div>
            )}

            <div
              className="bg-white rounded-xl shadow p-6"
              style={{ border: "1px solid #e8e2f4" }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#1a1220" }}>
                Criar conta
              </h2>
              <form onSubmit={handleRegisterAndContinue} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome"
                  value={newAccount.nome}
                  onChange={(e) => setNewAccount({ ...newAccount, nome: e.target.value })}
                  disabled={isProcessing}
                  className="w-full px-3 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                  style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  disabled={isProcessing}
                  className="w-full px-3 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                  style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={newAccount.senha}
                  onChange={(e) => setNewAccount({ ...newAccount, senha: e.target.value })}
                  disabled={isProcessing}
                  className="w-full px-3 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                  style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                  required
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-4 py-2.5 rounded-lg font-medium text-white disabled:opacity-50 transition-colors"
                  style={{ background: "#4a3570" }}
                  onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.background = "#2d1f3d"; }}
                  onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.background = "#4a3570"; }}
                >
                  {isProcessing ? "Criando conta..." : "Criar conta e continuar"}
                </button>
              </form>

              <p className="text-center text-sm mt-4" style={{ color: "#6e52a8" }}>
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/loja/login?redirect=/loja/checkout")}
                  className="font-semibold"
                  style={{ color: "#4a3570" }}
                >
                  Entrar
                </button>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("cart")}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ border: "2px solid #e8e2f4", color: "#4a3570" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6e52a8";
                  e.currentTarget.style.background = "#f0ecfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e2f4";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
              Confirmar Pedido
            </h1>

            <div
              className="bg-white rounded-xl shadow p-6 space-y-3"
              style={{ border: "1px solid #e8e2f4" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "#1a1220" }}>
                Resumo do Pedido
              </h2>

              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center pb-3"
                  style={{ borderBottom: "1px solid #f0ecfa" }}
                >
                  <div>
                    <p className="font-medium" style={{ color: "#1a1220" }}>
                      {item.product.nome}
                    </p>
                    <p className="text-sm" style={{ color: "#9b7fd4" }}>
                      {item.quantity}x R$ {item.product.preco.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold" style={{ color: "#4a3570" }}>
                    R$ {(item.product.preco * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="pt-2 text-right">
                <p className="text-2xl font-bold" style={{ color: "#E24B4A" }}>
                  Total: R$ {total.toFixed(2)}
                </p>
              </div>
            </div>

            {error && (
              <div
                className="p-4 rounded-lg border text-sm"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {error}
              </div>
            )}

            <div
              className="rounded-xl p-4"
              style={{ background: "linear-gradient(135deg, #f0ecfa, #e8e2f4)", border: "1px solid #9b7fd4" }}
            >
              <p style={{ color: "#4a3570" }}>
                💳 <strong>Simulação de Pagamento</strong>
                <br />
                Este é um sistema de demonstração. Clique em &quot;Finalizar Compra&quot; para
                simular o pagamento.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(isAuthenticated ? "cart" : "client")}
                disabled={isProcessing}
                className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ border: "2px solid #e8e2f4", color: "#4a3570" }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.borderColor = "#6e52a8";
                    e.currentTarget.style.background = "#f0ecfa";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e2f4";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Voltar
              </button>
              <button
                onClick={handleFinalizePurchase}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 rounded-lg font-bold text-white disabled:opacity-50 transition-colors"
                style={{ background: "#E24B4A" }}
                onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.background = "#A32D2D"; }}
                onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.background = "#E24B4A"; }}
              >
                {isProcessing ? "Processando..." : "Finalizar Compra"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

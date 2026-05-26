"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useClients } from "@/hooks/useClients";
import { useSales } from "@/hooks/useSales";
import { LojaHeader } from "@/components/LojaHeader";
import { emitDataRefresh } from "@/lib/dataRefresh";

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
  const { createClient, createGuest } = useClients();
  const { createSale } = useSales();

  const [step, setStep] = useState<Step>("cart");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [newClient, setNewClient] = useState({ nome: "", email: "", telefone: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      if (!newClient.nome || !newClient.email) {
        setError("Nome e email são obrigatórios");
        setIsProcessing(false);
        return;
      }

      const client = await createClient(newClient);
      setSelectedClientId(client.id);
      setNewClient({ nome: "", email: "", telefone: "" });
      setIsProcessing(false);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar cliente");
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
        router.push("/dashboard");
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
              Sua compra foi registrada com sucesso. Redirecionando em breve...
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
                onClick={() => setStep("client")}
                className="flex-1 px-6 py-2 rounded-lg font-medium text-white"
                style={{ background: "#E24B4A" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
              >
                Continuar
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
                Seus dados
              </h2>
              <form onSubmit={handleCreateClient} className="space-y-3">
                {[
                  { type: "text", placeholder: "Nome", key: "nome", required: true },
                  { type: "email", placeholder: "Email", key: "email", required: true },
                  { type: "tel", placeholder: "Telefone (opcional)", key: "telefone", required: false },
                ].map((field) => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={newClient[field.key as keyof typeof newClient]}
                    onChange={(e) =>
                      setNewClient({ ...newClient, [field.key]: e.target.value })
                    }
                    disabled={isProcessing}
                    className="w-full px-3 py-2.5 rounded-lg outline-none transition-colors disabled:opacity-50 text-sm"
                    style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                    required={field.required}
                  />
                ))}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-4 py-2.5 rounded-lg font-medium text-white disabled:opacity-50 transition-colors"
                  style={{ background: "#4a3570" }}
                  onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.background = "#2d1f3d"; }}
                  onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.background = "#4a3570"; }}
                >
                  {isProcessing ? "Salvando..." : "Continuar"}
                </button>
              </form>
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
                Este é um sistema de demonstração. Clique em "Finalizar Compra" para
                simular o pagamento.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("client")}
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useClients } from "@/hooks/useClients";
import { useSales } from "@/hooks/useSales";
import { Navbar } from "@/components/Navbar";
import { emitDataRefresh } from "@/lib/dataRefresh";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { clients, createClient } = useClients();
  const { createSale } = useSales();

  const [step, setStep] = useState<"cart" | "client" | "payment" | "success">(
    "cart"
  );
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [newClient, setNewClient] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
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
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar cliente");
      setIsProcessing(false);
    }
  };

  const handleSelectClient = () => {
    if (!selectedClientId) {
      setError("Selecione um cliente");
      return;
    }
    setStep("payment");
  };

  const handleFinalizePurchase = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!selectedClientId) {
        setError("Cliente não selecionado");
        setIsProcessing(false);
        return;
      }

      if (items.length === 0) {
        setError("Carrinho vazio");
        setIsProcessing(false);
        return;
      }

      console.log("Iniciando criação de venda com dados:", {
        clienteId: selectedClientId,
        itens: items.map((item) => ({
          produtoId: item.product.id,
          quantidade: item.quantity,
        })),
      });

      // Create sale
      await createSale({
        clienteId: selectedClientId,
        itens: items.map((item) => ({
          produtoId: item.product.id,
          quantidade: item.quantity,
        })),
      });

      console.log("Venda criada com sucesso!");

      // Clear cart and emit refresh
      clearCart();
      emitDataRefresh();

      setStep("success");

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/loja");
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao finalizar compra";
      console.error("Erro ao finalizar compra:", err);
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Seu carrinho está vazio</p>
            <button
              onClick={() => router.push("/loja")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar para a loja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[
              { key: "cart", label: "Carrinho" },
              { key: "client", label: "Cliente" },
              { key: "payment", label: "Pagamento" },
              { key: "success", label: "Concluído" },
            ].map((s, idx, arr) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === s.key || arr.indexOf(arr.find((x) => x.key === step)!) < idx
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      arr.indexOf(arr.find((x) => x.key === step)!) < idx
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success State */}
        {step === "success" && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Compra Finalizada!
            </h1>
            <p className="text-gray-600 mb-4">
              Sua compra foi registrada com sucesso. Você será redirecionado em
              breve...
            </p>
            <button
              onClick={() => router.push("/loja")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar para a loja
            </button>
          </div>
        )}

        {/* Cart Step */}
        {step === "cart" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Seu Carrinho</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.product.nome}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        R$ {(item.product.preco * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t-2 text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    Total: R$ {total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/loja")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep("client")}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Client Step */}
        {step === "client" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Quem você é?
            </h1>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Existing Client */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cliente Existente
                </h2>
                <select
                  value={selectedClientId || ""}
                  onChange={(e) =>
                    setSelectedClientId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                >
                  <option value="">-- Selecione um cliente --</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nome} ({client.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSelectClient}
                  disabled={isProcessing || !selectedClientId}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  Continuar com este cliente
                </button>
              </div>

              {/* New Client */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Novo Cliente
                </h2>
                <form onSubmit={handleCreateClient} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newClient.nome}
                    onChange={(e) =>
                      setNewClient({ ...newClient, nome: e.target.value })
                    }
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefone (opcional)"
                    value={newClient.telefone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, telefone: e.target.value })
                    }
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {isProcessing ? "Criando..." : "Criar cliente"}
                  </button>
                </form>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("cart")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Confirmar Pedido</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>

              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center pb-3 border-b"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.product.nome}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x R$ {item.product.preco.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    R$ {(item.product.preco * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="pt-4 text-right">
                <p className="text-2xl font-bold text-blue-600">
                  Total: R$ {total.toFixed(2)}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700">
                💳 <strong>Simulação de Pagamento</strong><br />
                Este é um sistema de demonstração. Clique em "Finalizar Compra" para
                simular o pagamento.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("client")}
                disabled={isProcessing}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleFinalizePurchase}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
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

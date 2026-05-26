"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { LojaHeader } from "@/components/LojaHeader";
import { LojaFooter } from "@/components/LojaFooter";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
        <LojaHeader />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
          <div className="text-center">
            <p className="text-4xl mb-4">🛒</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#1a1220" }}>
              Seu carrinho está vazio
            </h1>
            <p className="mb-8" style={{ color: "#6e52a8" }}>
              Comece a adicionar produtos para comprar
            </p>
            <button
              onClick={() => router.push("/loja")}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{ background: "#E24B4A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
            >
              Voltar para a loja
            </button>
          </div>
        </div>
        <LojaFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
      <LojaHeader />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8" style={{ color: "#1a1220" }}>
          🛒 Seu Carrinho
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl shadow p-6 flex gap-4 items-start"
                style={{ border: "1px solid #e8e2f4" }}
              >
                {/* Product Image */}
                <div
                  className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f0ecfa 0%, #e8e2f4 100%)" }}
                >
                  {item.product.imagemUrl ? (
                    <img
                      src={item.product.imagemUrl}
                      alt={item.product.nome}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" style={{ color: "#1a1220" }}>
                    {item.product.nome}
                  </h3>
                  {item.product.categoria && (
                    <span
                      className="inline-block px-2 py-1 text-xs font-semibold rounded mt-2"
                      style={{ background: "#f0ecfa", color: "#6e52a8" }}
                    >
                      {item.product.categoria}
                    </span>
                  )}
                  <p className="font-bold mt-2 text-lg" style={{ color: "#E24B4A" }}>
                    R$ {item.product.preco.toFixed(2)}
                  </p>
                </div>

                {/* Quantity and Remove */}
                <div className="flex flex-col items-end gap-3">
                  <div
                    className="flex items-center rounded-lg overflow-hidden"
                    style={{ border: "2px solid #e8e2f4" }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-1 transition-colors"
                      style={{ color: "#4a3570" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ecfa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-medium" style={{ color: "#1a1220" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.min(item.product.estoque, item.quantity + 1)
                        )
                      }
                      disabled={item.quantity >= item.product.estoque}
                      className="px-3 py-1 transition-colors disabled:opacity-50"
                      style={{ color: "#4a3570" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ecfa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="font-medium text-sm transition-colors"
                    style={{ color: "#E24B4A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#A32D2D")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#E24B4A")}
                  >
                    Remover
                  </button>

                  <p className="text-sm" style={{ color: "#6e52a8" }}>
                    Subtotal:{" "}
                    <span className="font-bold" style={{ color: "#1a1220" }}>
                      R$ {(item.product.preco * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div
              className="bg-white rounded-xl shadow p-6 sticky top-20 space-y-6"
              style={{ border: "1px solid #e8e2f4" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "#1a1220" }}>
                Resumo
              </h2>

              <div className="space-y-2 pb-4" style={{ borderBottom: "2px solid #f0ecfa" }}>
                <div className="flex justify-between text-sm" style={{ color: "#6e52a8" }}>
                  <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "#6e52a8" }}>
                  <span>Frete</span>
                  <span className="font-medium" style={{ color: "#2d8a4e" }}>Grátis</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold" style={{ color: "#1a1220" }}>
                  Total:
                </span>
                <span className="text-2xl font-bold" style={{ color: "#E24B4A" }}>
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => router.push("/loja/checkout")}
                className="w-full px-6 py-3 rounded-lg font-bold text-white transition-colors"
                style={{ background: "#E24B4A" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
              >
                Ir para Checkout
              </button>

              <button
                onClick={() => router.push("/loja")}
                className="w-full px-6 py-2 rounded-lg font-medium transition-colors"
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
                Continuar Comprando
              </button>

              <button
                onClick={clearCart}
                className="w-full px-6 py-2 font-medium transition-colors"
                style={{ color: "#E24B4A" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#A32D2D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#E24B4A")}
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>
      </main>

      <LojaFooter />
    </div>
  );
}

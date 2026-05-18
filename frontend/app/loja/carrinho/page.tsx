"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Navbar } from "@/components/Navbar";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-4xl mb-4">🛒</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Comece a adicionar produtos para comprar
            </p>
            <button
              onClick={() => router.push("/loja")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-lg shadow p-6 flex gap-4 items-start"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
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
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {item.product.nome}
                  </h3>
                  {item.product.categoria && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded mt-2">
                      {item.product.categoria}
                    </span>
                  )}
                  <p className="text-blue-600 font-bold mt-2 text-lg">
                    R$ {item.product.preco.toFixed(2)}
                  </p>
                </div>

                {/* Quantity and Remove */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.min(
                            item.product.estoque,
                            item.quantity + 1
                          )
                        )
                      }
                      disabled={item.quantity >= item.product.estoque}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remover
                  </button>

                  <p className="text-gray-600 text-sm">
                    Subtotal: R${" "}
                    <span className="font-bold text-gray-900">
                      {(item.product.preco * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo
                </h2>

                <div className="space-y-2 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="font-medium text-green-600">Grátis</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/loja/checkout")}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold mb-3"
                >
                  Ir para Checkout
                </button>

                <button
                  onClick={() => router.push("/loja")}
                  className="w-full px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium mb-3"
                >
                  Continuar Comprando
                </button>

                <button
                  onClick={clearCart}
                  className="w-full px-6 py-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

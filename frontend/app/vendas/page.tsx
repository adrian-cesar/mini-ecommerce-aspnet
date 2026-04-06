"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProducts } from "@/hooks/useProducts";
import { useClients } from "@/hooks/useClients";
import { useSales } from "@/hooks/useSales";
import type { ItemVenda } from "@/types";

export default function SalesPage() {
  const { products } = useProducts();
  const { clients } = useClients();
  const { sales, isLoading, error: salesError, createSale } = useSales();

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [items, setItems] = useState<ItemVenda[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddItem = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = items.find((item) => item.produtoId === productId);
    if (existingItem) {
      if (existingItem.quantidade < product.estoque) {
        setItems(
          items.map((item) =>
            item.produtoId === productId
              ? { ...item, quantidade: item.quantidade + 1 }
              : item,
          ),
        );
      } else {
        setFormError("Quantidade insuficiente em estoque");
      }
    } else {
      setItems([
        ...items,
        {
          produtoId: productId,
          quantidade: 1,
          precoUnitario: product.preco,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.estoque) {
      setFormError("Quantidade insuficiente em estoque");
      return;
    }

    setItems(
      items.map((item) =>
        item.produtoId === productId
          ? { ...item, quantidade: quantity }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId: number) => {
    setItems(items.filter((item) => item.produtoId !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!selectedClientId) {
      setFormError("Selecione um cliente");
      return;
    }

    if (items.length === 0) {
      setFormError("Adicione pelo menos um produto");
      return;
    }

    setIsSubmitting(true);

    try {
      await createSale({
        clienteId: selectedClientId,
        itensVenda: items.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
      });

      setSuccessMessage("Venda registrada com sucesso!");
      setSelectedClientId(null);
      setItems([]);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao registrar venda");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.precoUnitario * item.quantidade,
    0,
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600 mt-1">Registre novas vendas</p>
        </div>

        {salesError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{salesError}</p>
          </div>
        )}

        {formError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{formError}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selecione um Cliente
            </h2>

            <select
              value={selectedClientId || ""}
              onChange={(e) =>
                setSelectedClientId(
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">-- Selecione um cliente --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selecione Produtos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddItem(product.id)}
                  disabled={product.estoque === 0 || isSubmitting}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    product.estoque === 0
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{product.nome}</h3>
                  <p className="text-sm text-gray-600">
                    R$ {product.preco.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      product.estoque > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Estoque: {product.estoque}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Itens da Venda
                </h2>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Preço Unit.
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const product = products.find((p) => p.id === item.produtoId);
                    return (
                      <tr key={item.produtoId} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product?.nome}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          R$ {item.precoUnitario.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="1"
                            max={product?.estoque}
                            value={item.quantidade}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.produtoId,
                                parseInt(e.target.value),
                              )
                            }
                            disabled={isSubmitting}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                          R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.produtoId)}
                            disabled={isSubmitting}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Processando..." : "Finalizar Venda"}
              </button>
            </div>
          )}
        </form>

        {!isLoading && sales.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ultimas Vendas
            </h2>

            <div className="space-y-2">
              {sales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                >
                  <div className="text-sm text-gray-600">
                    Venda #{sale.id} - {new Date(sale.dataVenda).toLocaleDateString(
                      "pt-BR",
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    R$ {sale.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

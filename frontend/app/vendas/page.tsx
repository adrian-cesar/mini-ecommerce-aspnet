"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useSales } from "@/hooks/useSales";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Data indisponível";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data indisponível";
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Data indisponível";
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function SalesPage() {
  const { sales, isLoading } = useSales();

  const summary = useMemo(() => {
    const total = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const averageValue = total > 0 ? totalRevenue / total : 0;
    const lastSale = sales.length > 0 ? sales[sales.length - 1] : null;

    return { total, totalRevenue, averageValue, lastSale };
  }, [sales]);

  const recentSales = useMemo(() => {
    return sales.slice().reverse().slice(0, 10);
  }, [sales]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Vendas</h1>
          <p className="text-gray-600 mt-1">Registro de todas as vendas</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Fluxo automático:</strong> As vendas realizadas na loja aparecem
            aqui automaticamente. Não é necessário registrar manualmente.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando vendas...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm font-medium opacity-90">Total de Vendas</p>
                <p className="text-3xl font-bold mt-2">{summary.total}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm font-medium opacity-90">Receita Total</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(summary.totalRevenue)}</p>
              </div>

              <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm font-medium opacity-90">Valor Médio</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(summary.averageValue)}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm font-medium opacity-90">Última Venda</p>
                <p className="text-sm mt-2">
                  {summary.lastSale
                    ? formatDate(summary.lastSale.dataVenda)
                    : "Nenhuma venda"}
                </p>
              </div>
            </div>

            {recentSales.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Últimas Vendas
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Data
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                          Itens
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale) => (
                        <tr key={sale.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            #{sale.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {sale.cliente?.nome || "Cliente"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(sale.dataVenda)}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600">
                            {sale.itensVenda?.length ?? 0}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">
                            {formatCurrency(sale.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">Nenhuma venda registrada ainda</p>
                <p className="text-gray-400 text-sm mt-2">
                  As vendas aparecerão aqui quando forem realizadas na loja
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

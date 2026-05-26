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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function SalesPage() {
  const { sales, isLoading } = useSales();

  const summary = useMemo(() => {
    const total = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const averageValue = total > 0 ? totalRevenue / total : 0;
    const lastSale = sales.length > 0 ? sales[sales.length - 1] : null;

    return { total, totalRevenue, averageValue, lastSale };
  }, [sales]);

  const recentSales = useMemo(() => sales.slice().reverse().slice(0, 10), [sales]);

  const kpiCards = [
    { label: "Total de Vendas", value: summary.total, gradient: "linear-gradient(135deg, #E24B4A 0%, #A32D2D 100%)" },
    { label: "Receita Total", value: formatCurrency(summary.totalRevenue), gradient: "linear-gradient(135deg, #4a3570 0%, #2d1f3d 100%)" },
    { label: "Valor Médio", value: formatCurrency(summary.averageValue), gradient: "linear-gradient(135deg, #6e52a8 0%, #4a3570 100%)" },
    {
      label: "Última Venda",
      value: summary.lastSale ? formatDate(summary.lastSale.dataVenda) : "Nenhuma",
      gradient: "linear-gradient(135deg, #FAC775 0%, #e8a830 100%)",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
            Painel de Vendas
          </h1>
          <p className="mt-1" style={{ color: "#6e52a8" }}>
            Registro de todas as vendas
          </p>
        </div>

        <div
          className="p-4 rounded-xl border text-sm"
          style={{ background: "#f5f3fa", borderColor: "#9b7fd4", color: "#4a3570" }}
        >
          <strong>Fluxo automático:</strong> As vendas realizadas na loja aparecem aqui
          automaticamente. Não é necessário registrar manualmente.
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: "#E24B4A" }} />
            <p className="mt-4" style={{ color: "#6e52a8" }}>Carregando vendas...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiCards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-xl shadow-lg p-6 text-white"
                  style={{ background: card.gradient }}
                >
                  <p className="text-sm font-medium opacity-90">{card.label}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
              ))}
            </div>

            {recentSales.length > 0 ? (
              <div
                className="bg-white rounded-xl shadow overflow-hidden"
                style={{ border: "1px solid #e8e2f4" }}
              >
                <div className="p-6" style={{ borderBottom: "2px solid #f0ecfa" }}>
                  <h2 className="text-lg font-semibold" style={{ color: "#1a1220" }}>
                    Últimas Vendas
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ background: "#f5f3fa", borderBottom: "2px solid #e8e2f4" }}>
                      <tr>
                        {["ID", "Cliente", "Data", "Itens", "Total"].map((h, i) => (
                          <th
                            key={h}
                            className={`px-6 py-3 text-sm font-semibold ${i === 4 ? "text-right" : i === 3 ? "text-center" : "text-left"}`}
                            style={{ color: "#2d1f3d" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale) => (
                        <tr
                          key={sale.id}
                          style={{ borderBottom: "1px solid #f0ecfa" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#fdfcff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <td className="px-6 py-4 text-sm font-bold" style={{ color: "#E24B4A" }}>
                            #{sale.id}
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: "#1a1220" }}>
                            {sale.cliente?.nome || "Cliente"}
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: "#9b7fd4" }}>
                            {formatDate(sale.dataVenda)}
                          </td>
                          <td className="px-6 py-4 text-center text-sm" style={{ color: "#6e52a8" }}>
                            {sale.itensVenda?.length ?? 0}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold" style={{ color: "#4a3570" }}>
                            {formatCurrency(sale.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-xl shadow p-12 text-center"
                style={{ border: "1px solid #e8e2f4" }}
              >
                <p className="text-lg" style={{ color: "#9b7fd4" }}>
                  Nenhuma venda registrada ainda
                </p>
                <p className="text-sm mt-2" style={{ color: "#9b7fd4" }}>
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

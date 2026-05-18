"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProducts } from "@/hooks/useProducts";
import { useClients } from "@/hooks/useClients";
import { useSales } from "@/hooks/useSales";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDateLabel = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
  } catch {
    return "N/A";
  }
};

export default function DashboardPage() {
  const { products } = useProducts();
  const { clients } = useClients();
  const { sales } = useSales();

  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalItemsSold = sales.reduce((sum, s) => sum + (s.itensVenda?.length ?? 0), 0);
    const activeProducts = products.filter((p) => p.estoque > 0).length;
    const lowStockProducts = products.filter(
      (p) => p.estoque > 0 && p.estoque <= 5,
    ).length;
    const outOfStockProducts = products.filter((p) => p.estoque === 0).length;

    return {
      totalRevenue,
      totalItemsSold,
      averageTicket: sales.length > 0 ? totalRevenue / sales.length : 0,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [products, sales]);

  const last7DaysSalesData = useMemo(() => {
    const salesByDate: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      salesByDate[dateKey] = 0;
    }

    sales.forEach((sale) => {
      try {
        const saleDate = new Date(sale.dataVenda).toISOString().split("T")[0];
        if (saleDate in salesByDate) {
          salesByDate[saleDate] += sale.total;
        }
      } catch {
        // Ignore invalid dates
      }
    });

    return Object.entries(salesByDate).map(([date, total]) => ({
      date,
      total,
      label: formatDateLabel(date),
    }));
  }, [sales]);

  const maxRevenueDay =
    last7DaysSalesData.length > 0
      ? Math.max(...last7DaysSalesData.map((d) => d.total))
      : 0;

  const categoryDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};

    products.forEach((p) => {
      const category = p.categoria || "Sem categoria";
      distribution[category] = (distribution[category] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / products.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [products]);

  const topProducts = useMemo(() => {
    if (!sales || !Array.isArray(sales)) return [];
    
    const productSales: Record<string, { nome: string; quantidade: number }> =
      {};

    sales.forEach((sale) => {
      if (!sale || !Array.isArray(sale.itensVenda)) return;
      
      sale.itensVenda.forEach((item) => {
        if (!item) return;
        
        const key = item.produtoId.toString();
        const product = products.find((p) => p && p.id === item.produtoId);
        if (product) {
          if (!productSales[key]) {
            productSales[key] = { nome: product.nome, quantidade: 0 };
          }
          productSales[key].quantidade += item.quantidade || 0;
        }
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);
  }, [sales, products]);

  const recentSales = useMemo(() => {
    return sales.slice().reverse().slice(0, 5);
  }, [sales]);

  const kpiCards = [
    {
      label: "Receita Total",
      value: formatCurrency(metrics.totalRevenue),
      icon: "💰",
      gradient: "from-sky-500 to-cyan-500",
    },
    {
      label: "Itens Vendidos",
      value: metrics.totalItemsSold,
      icon: "📦",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Ticket Médio",
      value: formatCurrency(metrics.averageTicket),
      icon: "📊",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      label: "Produtos Ativos",
      value: `${metrics.activeProducts}/${products.length}`,
      icon: "✅",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const alerts = [];
  if (metrics.outOfStockProducts > 0) {
    alerts.push({
      type: "error",
      message: `${metrics.outOfStockProducts} produtos fora de estoque`,
    });
  }
  if (metrics.lowStockProducts > 0) {
    alerts.push({
      type: "warning",
      message: `${metrics.lowStockProducts} produtos com estoque baixo`,
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao sistema de gerenciamento
          </p>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  alert.type === "error"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg p-6 text-white`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium opacity-90">{card.label}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Receita (Últimos 7 Dias)
            </h2>
            <div className="space-y-2">
              {last7DaysSalesData.map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-12">
                    {day.label}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full transition-all duration-300"
                      style={{
                        width: `${
                          maxRevenueDay > 0
                            ? (day.total / maxRevenueDay) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                    {formatCurrency(day.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Distribuição por Categoria
            </h2>
            <div className="space-y-3">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {cat.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {cat.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top 5 Produtos
            </h2>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {product.nome}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {product.quantidade}x
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Sem vendas ainda
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vendas Recentes
            </h2>
            <div className="space-y-2">
              {recentSales.length > 0 ? (
                recentSales.map((sale, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {sale.cliente?.nome || "Cliente"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateLabel(sale.dataVenda)}
                      </p>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(sale.total)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Sem vendas ainda
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Atalhos Rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/produtos"
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">📦</div>
              <p className="font-medium text-gray-900">Gerenciar Produtos</p>
            </a>
            <a
              href="/clientes"
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <p className="font-medium text-gray-900">Gerenciar Clientes</p>
            </a>
            <a
              href="/vendas"
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">💳</div>
              <p className="font-medium text-gray-900">Ver Vendas</p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

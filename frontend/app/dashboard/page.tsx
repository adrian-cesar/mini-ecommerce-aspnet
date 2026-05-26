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

    const productSales: Record<string, { nome: string; quantidade: number }> = {};

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
      gradient: "linear-gradient(135deg, #E24B4A 0%, #A32D2D 100%)",
    },
    {
      label: "Itens Vendidos",
      value: metrics.totalItemsSold,
      icon: "📦",
      gradient: "linear-gradient(135deg, #4a3570 0%, #2d1f3d 100%)",
    },
    {
      label: "Ticket Médio",
      value: formatCurrency(metrics.averageTicket),
      icon: "📊",
      gradient: "linear-gradient(135deg, #6e52a8 0%, #4a3570 100%)",
    },
    {
      label: "Produtos Ativos",
      value: `${metrics.activeProducts}/${products.length}`,
      icon: "✅",
      gradient: "linear-gradient(135deg, #FAC775 0%, #e8a830 100%)",
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
          <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
            Dashboard
          </h1>
          <p className="mt-2" style={{ color: "#6e52a8" }}>
            Bem-vindo ao painel PrimeBox
          </p>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border text-sm font-medium"
                style={
                  alert.type === "error"
                    ? { background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }
                    : { background: "#fffbeb", borderColor: "#FAC775", color: "#92640a" }
                }
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-lg p-6 text-white"
              style={{ background: card.gradient }}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6" style={{ border: "1px solid #e8e2f4" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#2d1f3d" }}>
              Receita (Últimos 7 Dias)
            </h2>
            <div className="space-y-2">
              {last7DaysSalesData.map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12" style={{ color: "#6e52a8" }}>
                    {day.label}
                  </span>
                  <div className="flex-1 rounded-full h-6 overflow-hidden" style={{ background: "#f0ecfa" }}>
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${maxRevenueDay > 0 ? (day.total / maxRevenueDay) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #E24B4A 0%, #6e52a8 100%)",
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-20 text-right" style={{ color: "#1a1220" }}>
                    {formatCurrency(day.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6" style={{ border: "1px solid #e8e2f4" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#2d1f3d" }}>
              Distribuição por Categoria
            </h2>
            <div className="space-y-3">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: "#4a3570" }}>
                      {cat.category}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "#1a1220" }}>
                      {cat.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: "#f0ecfa" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${cat.percentage}%`,
                        background: "linear-gradient(90deg, #4a3570 0%, #9b7fd4 100%)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6" style={{ border: "1px solid #e8e2f4" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#2d1f3d" }}>
              Top 5 Produtos
            </h2>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "#f5f3fa" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold"
                        style={{ background: idx === 0 ? "#E24B4A" : "#4a3570" }}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-medium" style={{ color: "#1a1220" }}>
                        {product.nome}
                      </span>
                    </div>
                    <span className="font-semibold" style={{ color: "#6e52a8" }}>
                      {product.quantidade}x
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-4" style={{ color: "#9b7fd4" }}>
                  Sem vendas ainda
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6" style={{ border: "1px solid #e8e2f4" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#2d1f3d" }}>
              Vendas Recentes
            </h2>
            <div className="space-y-2">
              {recentSales.length > 0 ? (
                recentSales.map((sale, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "#f5f3fa" }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: "#1a1220" }}>
                        {sale.cliente?.nome || "Cliente"}
                      </p>
                      <p className="text-xs" style={{ color: "#9b7fd4" }}>
                        {formatDateLabel(sale.dataVenda)}
                      </p>
                    </div>
                    <span className="font-semibold" style={{ color: "#E24B4A" }}>
                      {formatCurrency(sale.total)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-4" style={{ color: "#9b7fd4" }}>
                  Sem vendas ainda
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow p-6" style={{ border: "1px solid #e8e2f4" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#2d1f3d" }}>
            Atalhos Rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: "/produtos", icon: "📦", label: "Gerenciar Produtos" },
              { href: "/clientes", icon: "👥", label: "Gerenciar Clientes" },
              { href: "/vendas", icon: "💳", label: "Ver Vendas" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="p-4 rounded-lg text-center transition-all hover:shadow-md"
                style={{ border: "2px solid #e8e2f4" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#E24B4A";
                  e.currentTarget.style.background = "#fff5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e2f4";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <p className="font-medium" style={{ color: "#2d1f3d" }}>
                  {link.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

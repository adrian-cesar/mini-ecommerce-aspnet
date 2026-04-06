"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useProducts } from "@/hooks/useProducts";
import { useClients } from "@/hooks/useClients";
import { useSales } from "@/hooks/useSales";

export default function DashboardPage() {
  const { products } = useProducts();
  const { clients } = useClients();
  const { sales } = useSales();

  const stats = [
    {
      label: "Produtos",
      value: products.length,
      icon: "📦",
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Clientes",
      value: clients.length,
      icon: "👥",
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Vendas",
      value: sales.length,
      icon: "💳",
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Faturamento",
      value: `R$ ${sales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}`,
      icon: "💰",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao sistema de gerenciamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
          ))}
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
              <p className="font-medium text-gray-900">Registrar Venda</p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

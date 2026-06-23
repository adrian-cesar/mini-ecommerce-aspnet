"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { LojaHeader } from "@/components/LojaHeader";
import { useAuth } from "@/hooks/useAuth";

interface PedidoProduto {
  id: number;
  nome: string;
  preco: number;
}

interface PedidoItem {
  id: number;
  produtoId: number;
  produto?: PedidoProduto;
  quantidade: number;
}

interface Pedido {
  id: number;
  clienteId: number;
  data: string;
  total: number;
  itensVenda: PedidoItem[];
}

function formatarData(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function MeusPedidosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteIdParam = searchParams.get("clienteId");
  const { user, isLoading: authLoading } = useAuth();

  const [resolvedClienteId, setResolvedClienteId] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // clienteId vem da query string (fluxo do checkout) ou, na falta dela, é resolvido a partir do usuário logado.
  const clienteId = clienteIdParam ?? resolvedClienteId;

  // Resolve o clienteId a partir do usuário logado quando não veio na query string.
  useEffect(() => {
    if (clienteIdParam) return;

    if (authLoading) return;

    if (!user) {
      setNeedsLogin(true);
      setIsLoading(false);
      return;
    }

    let active = true;

    apiFetch<{ id: number }>(`/cliente/por-usuario/${user.id}`)
      .then((cliente) => {
        if (active) setResolvedClienteId(String(cliente.id));
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [clienteIdParam, authLoading, user]);

  // Busca os pedidos assim que o clienteId é resolvido.
  useEffect(() => {
    if (!clienteId) return;

    let active = true;

    async function fetchPedidos() {
      if (active) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const data = await apiFetch<Pedido[]>(`/venda/cliente/${clienteId}`);
        if (active) setPedidos(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchPedidos();

    return () => {
      active = false;
    };
  }, [clienteId]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
      <LojaHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8" style={{ color: "#1a1220" }}>
          Meus Pedidos
        </h1>

        {isLoading && !needsLogin && (
          <div className="text-center py-12">
            <p style={{ color: "#6e52a8" }}>Carregando seus pedidos...</p>
          </div>
        )}

        {needsLogin && (
          <div className="bg-white rounded-xl shadow p-12 text-center" style={{ border: "1px solid #e8e2f4" }}>
            <p className="text-4xl mb-4">🔒</p>
            <p className="text-lg mb-6" style={{ color: "#6e52a8" }}>
              Faça login para ver seus pedidos
            </p>
            <button
              onClick={() => router.push("/loja/login")}
              className="px-6 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ background: "#E24B4A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
            >
              Fazer login
            </button>
          </div>
        )}

        {!isLoading && !needsLogin && error && (
          <div
            className="p-4 rounded-lg border text-sm mb-6"
            style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
          >
            {error}
          </div>
        )}

        {!isLoading && !needsLogin && !error && pedidos.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center" style={{ border: "1px solid #e8e2f4" }}>
            <p className="text-4xl mb-4">📦</p>
            <p className="text-lg" style={{ color: "#6e52a8" }}>
              Você ainda não fez nenhum pedido.
            </p>
          </div>
        )}

        {!isLoading && !needsLogin && !error && pedidos.length > 0 && (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white rounded-xl shadow overflow-hidden"
                style={{ border: "1px solid #e8e2f4" }}
              >
                <div
                  className="px-6 py-4 flex items-center justify-between flex-wrap gap-2"
                  style={{ borderBottom: "1px solid #f0ecfa" }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: "#1a1220" }}>
                      Pedido #{pedido.id}
                    </p>
                    <p className="text-sm" style={{ color: "#9b7fd4" }}>
                      {formatarData(pedido.data)}
                    </p>
                  </div>
                  <span className="text-lg font-bold" style={{ color: "#E24B4A" }}>
                    R$ {pedido.total.toFixed(2)}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  {pedido.itensVenda.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium" style={{ color: "#1a1220" }}>
                          {item.produto?.nome ?? `Produto #${item.produtoId}`}
                        </p>
                        <p className="text-sm" style={{ color: "#9b7fd4" }}>
                          {item.quantidade}x R$ {(item.produto?.preco ?? 0).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold" style={{ color: "#4a3570" }}>
                        R$ {((item.produto?.preco ?? 0) * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <button
            onClick={() => router.push("/loja")}
            className="px-6 py-2 rounded-lg text-white font-medium transition-colors"
            style={{ background: "#E24B4A" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
          >
            Voltar para a loja
          </button>
        </div>
      </main>
    </div>
  );
}

export default function MeusPedidosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
          <LojaHeader />
          <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full text-center">
            <p style={{ color: "#6e52a8" }}>Carregando seus pedidos...</p>
          </div>
        </div>
      }
    >
      <MeusPedidosContent />
    </Suspense>
  );
}

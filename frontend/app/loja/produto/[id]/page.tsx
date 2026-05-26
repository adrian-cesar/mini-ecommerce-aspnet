"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/services/productService";
import { useCart } from "@/hooks/useCart";
import { LojaHeader } from "@/components/LojaHeader";
import { LojaFooter } from "@/components/LojaFooter";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const p = await productService.getById(Number(id));
        if (!cancelled) setProduct(p);
      } catch (err) {
        console.error(err);
        setError("Produto não encontrado");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [params]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
        <LojaHeader />
        <div className="flex-1 max-w-4xl mx-auto p-8 text-center" style={{ color: "#6e52a8" }}>
          Carregando...
        </div>
        <LojaFooter />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
        <LojaHeader />
        <div className="flex-1 max-w-4xl mx-auto p-8 text-center">
          <p style={{ color: "#E24B4A" }}>{error ?? "Produto não encontrado"}</p>
          <button
            onClick={() => router.push("/loja")}
            className="mt-4 px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: "#E24B4A" }}
          >
            Voltar à loja
          </button>
        </div>
        <LojaFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
      <LojaHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow p-6"
          style={{ border: "1px solid #e8e2f4" }}
        >
          {/* Image */}
          <div
            className="w-full h-96 flex items-center justify-center overflow-hidden rounded-lg"
            style={{ background: "linear-gradient(135deg, #f0ecfa 0%, #e8e2f4 100%)" }}
          >
            {product.imagemUrl ? (
              <img
                src={product.imagemUrl}
                alt={product.nome}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-6xl">📦</div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categoria && (
              <div
                className="mb-4 text-sm font-semibold inline-block px-3 py-1 rounded-full"
                style={{ background: "#f0ecfa", color: "#6e52a8" }}
              >
                {product.categoria}
              </div>
            )}

            <h1 className="text-2xl font-bold mb-4" style={{ color: "#1a1220" }}>
              {product.nome}
            </h1>

            <p className="mb-6" style={{ color: "#4a3570" }}>
              {product.descricao}
            </p>

            <div className="text-3xl font-extrabold mb-4" style={{ color: "#E24B4A" }}>
              R$ {product.preco.toFixed(2)}
            </div>

            <div className="mb-6">
              Estoque:{" "}
              <span
                className="font-semibold"
                style={{ color: product.estoque > 0 ? "#2d8a4e" : "#E24B4A" }}
              >
                {product.estoque}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="px-5 py-2.5 rounded-lg font-bold text-white transition-colors"
                style={{ background: added ? "#2d8a4e" : "#E24B4A" }}
                onMouseEnter={(e) => {
                  if (!added) e.currentTarget.style.background = "#A32D2D";
                }}
                onMouseLeave={(e) => {
                  if (!added) e.currentTarget.style.background = "#E24B4A";
                }}
              >
                {added ? "✓ Adicionado" : "🛒 Adicionar ao carrinho"}
              </button>

              <button
                onClick={() => router.push("/loja")}
                className="px-5 py-2.5 rounded-lg font-medium transition-colors"
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
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      </main>

      <LojaFooter />
    </div>
  );
}

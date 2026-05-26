"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { LojaHeader } from "@/components/LojaHeader";
import { LojaFooter } from "@/components/LojaFooter";

export default function LojaPage() {
  const { products, isLoading } = useProducts();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(
      products.filter((p) => p.categoria).map((p) => p.categoria)
    );
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.descricao &&
          product.descricao.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === null
          ? true
          : selectedCategory === "sem-categoria"
          ? !product.categoria || product.categoria === ""
          : product.categoria === selectedCategory;

      return matchesSearch && matchesCategory && product.estoque > 0;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
      <LojaHeader />

      {/* Hero Banner */}
      <div
        className="text-white py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #1a1220 0%, #2d1f3d 50%, #4a3570 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
            Bem-vindo à <span style={{ color: "#E24B4A" }}>Prime</span>
            <span style={{ color: "#FAC775" }}>Box</span>
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: "#9b7fd4" }}>
            Descubra produtos premium com os melhores preços
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["✓ Frete Grátis", "✓ Seguro", "✓ Devolução Fácil"].map((item) => (
              <div
                key={item}
                className="backdrop-blur px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(155,127,212,0.3)", color: "#ffffff" }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-xl shadow p-6 sticky top-24"
              style={{ border: "1px solid #e8e2f4" }}
            >
              <h2 className="text-xl font-bold mb-6" style={{ color: "#1a1220" }}>
                Filtros
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: "#4a3570" }}>
                  🔍 Buscar
                </label>
                <input
                  type="text"
                  placeholder="Produto ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm transition-colors"
                  style={{ border: "2px solid #e8e2f4", color: "#1a1220" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: "#4a3570" }}>
                  📂 Categorias
                </label>
                <div className="space-y-1">
                  {[
                    { key: null, label: "Todas as Categorias" },
                    { key: "sem-categoria", label: "Sem categoria" },
                    ...categories.map((cat) => ({ key: cat, label: cat })),
                  ].map((item) => (
                    <button
                      key={String(item.key)}
                      onClick={() => setSelectedCategory(item.key as string | null)}
                      className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                      style={
                        selectedCategory === item.key
                          ? { background: "#E24B4A", color: "#ffffff" }
                          : { color: "#4a3570" }
                      }
                      onMouseEnter={(e) => {
                        if (selectedCategory !== item.key) {
                          e.currentTarget.style.background = "#f0ecfa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== item.key) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: "#6e52a8" }}>Carregando produtos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg mb-4" style={{ color: "#6e52a8" }}>
                  Nenhum produto encontrado
                </p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ background: "#E24B4A" }}
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm" style={{ color: "#6e52a8" }}>
                  Mostrando {filteredProducts.length} de {products.length} produtos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/loja/produto/${product.id}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col no-underline"
                      style={{ border: "1px solid #e8e2f4" }}
                    >
                      {/* Image */}
                      <div
                        className="w-full h-48 flex items-center justify-center overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #f0ecfa 0%, #e8e2f4 100%)" }}
                      >
                        {product.imagemUrl ? (
                          <img
                            src={product.imagemUrl}
                            alt={product.nome}
                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="text-4xl">📦</div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        {product.categoria && (
                          <span
                            className="inline-block px-2 py-1 text-xs font-semibold rounded mb-2 w-fit"
                            style={{ background: "#f0ecfa", color: "#6e52a8" }}
                          >
                            {product.categoria}
                          </span>
                        )}

                        <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: "#1a1220" }}>
                          {product.nome}
                        </h3>

                        {product.descricao && (
                          <p className="text-sm mb-3 line-clamp-2" style={{ color: "#6e52a8" }}>
                            {product.descricao}
                          </p>
                        )}

                        <div className="mt-auto">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-2xl font-bold" style={{ color: "#E24B4A" }}>
                              R$ {product.preco.toFixed(2)}
                            </span>
                            <span className="text-xs" style={{ color: "#9b7fd4" }}>
                              Estoque: {product.estoque}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="w-full py-2 rounded-lg font-bold transition-all text-white text-sm"
                            style={{
                              background: addedProductId === product.id ? "#2d8a4e" : "#E24B4A",
                            }}
                          >
                            {addedProductId === product.id ? "✓ Adicionado!" : "🛒 Adicionar ao Carrinho"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <LojaFooter />
    </div>
  );
}

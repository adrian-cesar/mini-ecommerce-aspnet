"use client";

import { useMemo, useRef, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/hooks/useCart";
import { LojaHeader } from "@/components/LojaHeader";
import { LojaFooter } from "@/components/LojaFooter";
import { LojaHeroBanner } from "@/components/LojaHeroBanner";
import { LojaCategoriesSection } from "@/components/LojaCategoriesSection";
import { LojaBestSellersSection } from "@/components/LojaBestSellersSection";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

type CategoryFilter = number | "sem-categoria" | null;

export default function LojaPage() {
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const productsSectionRef = useRef<HTMLDivElement>(null);

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
          ? product.categoriaId == null
          : product.categoriaId === selectedCategory;

      return matchesSearch && matchesCategory && product.estoque > 0;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handleSelectCategory = (categoriaId: number) => {
    setSelectedCategory(categoriaId);
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f3fa" }}>
      <LojaHeader />

      <div className="max-w-7xl mx-auto w-full px-4 pt-8 pb-4">
        <LojaHeroBanner />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4">
        <LojaCategoriesSection categories={categories} onSelectCategory={handleSelectCategory} />
        <LojaBestSellersSection
          products={products}
          addedProductId={addedProductId}
          onAddToCart={handleAddToCart}
        />
      </div>

      <main ref={productsSectionRef} className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
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
                    { key: null as CategoryFilter, label: "Todas as Categorias" },
                    { key: "sem-categoria" as CategoryFilter, label: "Sem categoria" },
                    ...categories.map((cat) => ({ key: cat.id as CategoryFilter, label: cat.nome })),
                  ].map((item) => (
                    <button
                      key={String(item.key)}
                      onClick={() => setSelectedCategory(item.key)}
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAdded={addedProductId === product.id}
                      onAddToCart={handleAddToCart}
                    />
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

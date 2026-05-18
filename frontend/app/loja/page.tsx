"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { LojaHeader } from "@/components/LojaHeader";
import { LojaFooter } from "@/components/LojaFooter";

export default function LojaPage() {
  const router = useRouter();
  const { products, isLoading } = useProducts();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(
      products
        .filter((p) => p.categoria)
        .map((p) => p.categoria)
    );
    return Array.from(cats);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.descricao &&
          product.descricao.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === null ||
        selectedCategory === "sem-categoria"
          ? !product.categoria || product.categoria === ""
          : product.categoria === selectedCategory;

      return (
        matchesSearch && matchesCategory && product.estoque > 0
      );
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LojaHeader />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo à E-Shop
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Descubra os melhores produtos com os melhores preços
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              ✓ Frete Grátis
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              ✓ Seguro
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              ✓ Devolução Fácil
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Buscar
                </label>
                <input
                  type="text"
                  placeholder="Produto ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📂 Categorias
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Todas as Categorias
                  </button>
                  <button
                    onClick={() => setSelectedCategory("sem-categoria")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === "sem-categoria"
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Sem categoria
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {cat}
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
                <p className="text-gray-600 text-lg">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  Nenhum produto encontrado
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Mostrando {filteredProducts.length} de {products.length} produtos
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
                    >
                      {/* Image */}
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
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
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded mb-2 w-fit">
                            {product.categoria}
                          </span>
                        )}

                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                          {product.nome}
                        </h3>

                        {product.descricao && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.descricao}
                          </p>
                        )}

                        <div className="mt-auto">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-2xl font-bold text-blue-600">
                              R$ {product.preco.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Em estoque: {product.estoque}
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`w-full py-2 rounded-lg font-bold transition-all ${
                              addedProductId === product.id
                                ? "bg-green-500 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {addedProductId === product.id
                              ? "✓ Adicionado!"
                              : "🛒 Adicionar ao Carrinho"}
                          </button>
                        </div>
                      </div>
                    </div>
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

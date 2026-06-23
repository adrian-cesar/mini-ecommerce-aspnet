"use client";

import Link from "next/link";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isAdded: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, isAdded, onAddToCart }: ProductCardProps) {
  return (
    <Link
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
              onAddToCart(product);
            }}
            className="w-full py-2 rounded-lg font-bold transition-all text-white text-sm"
            style={{
              background: isAdded ? "#2d8a4e" : "#E24B4A",
            }}
          >
            {isAdded ? "✓ Adicionado!" : "🛒 Adicionar ao Carrinho"}
          </button>
        </div>
      </div>
    </Link>
  );
}

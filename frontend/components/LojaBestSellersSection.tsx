"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { saleService } from "@/services/saleService";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types";

interface LojaBestSellersSectionProps {
  products: Product[];
  addedProductId: number | null;
  onAddToCart: (product: Product) => void;
}

export function LojaBestSellersSection({ products, addedProductId, onAddToCart }: LojaBestSellersSectionProps) {
  const { isAuthenticated } = useAuth();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    function resolveBestSellers() {
      if (!isAuthenticated || products.length === 0) {
        setBestSellers([]);
        return;
      }

      saleService
        .getAll()
        .then((sales) => {
          if (!active) return;

          const quantityByProductId = new Map<number, number>();
          sales.forEach((sale) => {
            sale.itensVenda.forEach((item) => {
              quantityByProductId.set(
                item.produtoId,
                (quantityByProductId.get(item.produtoId) || 0) + item.quantidade,
              );
            });
          });

          const ranked = Array.from(quantityByProductId.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([produtoId]) => products.find((p) => p.id === produtoId))
            .filter((p): p is Product => p !== undefined)
            .slice(0, 4);

          setBestSellers(ranked);
        })
        .catch((err) => {
          console.warn(
            "Error loading sales for best sellers:",
            err instanceof Error ? err.message : err,
          );
          if (active) setBestSellers([]);
        });
    }

    resolveBestSellers();

    return () => {
      active = false;
    };
  }, [isAuthenticated, products]);

  if (bestSellers.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-5">
        <h2 className="text-2xl font-bold whitespace-nowrap" style={{ color: "#1a1220" }}>
          Mais vendidos
        </h2>
        <div className="flex-1 h-px" style={{ background: "#e8e2f4" }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdded={addedProductId === product.id}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

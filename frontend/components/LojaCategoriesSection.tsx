"use client";

import type { Category } from "@/types";

interface LojaCategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (categoriaId: number) => void;
}

export function LojaCategoriesSection({ categories, onSelectCategory }: LojaCategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-5" style={{ color: "#1a1220" }}>
        Categorias
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ border: "1px solid #e8e2f4" }}
          >
            <div
              className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f0ecfa 0%, #e8e2f4 100%)" }}
            >
              {category.imagemUrl ? (
                <img
                  src={category.imagemUrl}
                  alt={category.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🏷️</span>
              )}
            </div>
            <span className="text-sm font-medium text-center line-clamp-1" style={{ color: "#4a3570" }}>
              {category.nome}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

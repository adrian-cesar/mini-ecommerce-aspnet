"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export function LojaHeader() {
  const router = useRouter();
  const { items } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/loja")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <div className="text-3xl">🛒</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">E-Shop</h1>
            <p className="text-xs text-gray-500">Os melhores produtos</p>
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => router.push("/loja/carrinho")}
          className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          🛒 Carrinho
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {items.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

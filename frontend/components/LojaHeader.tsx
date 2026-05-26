"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export function LojaHeader() {
  const router = useRouter();
  const { items } = useCart();

  return (
    <header
      className="sticky top-0 z-50 shadow-lg border-b"
      style={{ background: "#1a1220", borderColor: "#4a3570" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => router.push("/loja")}
          className="flex items-center gap-2 cursor-pointer opacity-100 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/primebox-logo.svg"
            alt="PrimeBox"
            width={160}
            height={55}
            className="h-12 w-auto"
          />
        </div>

        <button
          onClick={() => router.push("/loja/carrinho")}
          className="relative px-5 py-2 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          style={{ background: "#E24B4A" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
        >
          🛒 Carrinho
          {items.length > 0 && (
            <span
              className="absolute -top-2 -right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#FAC775", color: "#1a1220" }}
            >
              {items.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

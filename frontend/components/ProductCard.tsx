import type { Product } from "@/types/Product";

interface ProductCardProps {
  product: Product;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-cyan-200/40 to-emerald-200/40 blur-2xl transition-transform duration-300 group-hover:scale-125" />

      <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Produto
      </p>
      <h2 className="relative mt-2 min-h-14 text-lg font-semibold text-zinc-900">
        {product.nome}
      </h2>

      <div className="relative mt-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">Preco</span>
        <span className="text-xl font-bold text-zinc-900">
          {formatCurrency(product.preco)}
        </span>
      </div>
    </article>
  );
}

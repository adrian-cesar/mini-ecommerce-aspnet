const floatingCategories = [
  { icon: "🎧", name: "Eletrônicos", count: "120 itens" },
  { icon: "👕", name: "Moda", count: "85 itens" },
  { icon: "⌚", name: "Acessórios", count: "64 itens" },
];

export function LojaHeroBanner() {
  return (
    <div
      className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
      style={{
        background: "#1a1025",
        borderRadius: "12px",
        padding: "56px 48px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #e11d48)" }}
      />

      {/* Left side: copy + CTAs */}
      <div className="max-w-xl">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{
            background: "rgba(124, 58, 237, 0.15)",
            color: "#c4b5fd",
            border: "1px solid rgba(124, 58, 237, 0.4)",
          }}
        >
          Nova temporada
        </span>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ color: "#ffffff" }}>
          Renove seu estilo nesta{" "}
          <span style={{ color: "#e11d48" }}>temporada</span>
        </h1>

        <p className="text-base mb-8" style={{ color: "#9ca3af" }}>
          Aproveite descontos exclusivos em produtos selecionados para você.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#produtos"
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#e11d48", color: "#ffffff" }}
          >
            Ver produtos
          </a>
          <a
            href="#produtos"
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
            style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.25)", color: "#ffffff" }}
          >
            Ofertas do dia
          </a>
        </div>
      </div>

      {/* Right side: floating category cards (hidden on mobile) */}
      <div className="hidden md:flex flex-col gap-4 shrink-0">
        {floatingCategories.map((category, idx) => (
          <div
            key={category.name}
            className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(6px)",
              marginLeft: idx % 2 === 1 ? "28px" : "0px",
            }}
          >
            <span className="text-2xl">{category.icon}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                {category.name}
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                {category.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

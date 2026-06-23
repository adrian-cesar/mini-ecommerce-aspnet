"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/produtos", label: "Produtos", icon: "📦" },
  { href: "/categorias", label: "Categorias", icon: "🏷️" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/vendas", label: "Vendas", icon: "💳" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 h-screen fixed left-0 top-16 overflow-y-auto border-r"
      style={{ background: "#2d1f3d", borderColor: "#4a3570" }}
    >
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium"
              style={
                isActive
                  ? { background: "#E24B4A", color: "#ffffff" }
                  : { color: "#9b7fd4" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#4a3570";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9b7fd4";
                }
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: "#4a3570" }}>
        <Link
          href="/loja"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: "#FAC775" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#4a3570";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span>🛒</span>
          <span>Ver Loja</span>
        </Link>
      </div>
    </aside>
  );
}

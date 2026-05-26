"use client";

import Image from "next/image";

export function LojaFooter() {
  return (
    <footer className="mt-20" style={{ background: "#1a1220", color: "#ffffff" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <Image
                src="/primebox-logo.svg"
                alt="PrimeBox"
                width={140}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm mb-4" style={{ color: "#9b7fd4" }}>
              A loja premium com os melhores produtos e preços do mercado.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: "#2d1f3d" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E24B4A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2d1f3d")}
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: "#2d1f3d" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#6e52a8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2d1f3d")}
                title="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                style={{ background: "#2d1f3d" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E24B4A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2d1f3d")}
                title="Instagram"
              >
                📷
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Produtos</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9b7fd4" }}>
              {["Eletrônicos", "Roupas", "Acessórios", "Promoções"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Suporte</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9b7fd4" }}>
              {["Central de Ajuda", "Rastrear Pedido", "Devoluções", "Contato"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9b7fd4" }}>
              {["Política de Privacidade", "Termos de Serviço", "Política de Cookies", "Contrato de Compra"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: "linear-gradient(135deg, #2d1f3d 0%, #4a3570 100%)", border: "1px solid #6e52a8" }}
        >
          <h3 className="text-lg font-bold mb-1 text-white">Receba Ofertas Exclusivas</h3>
          <p className="text-sm mb-4" style={{ color: "#9b7fd4" }}>
            Inscreva-se na newsletter PrimeBox para receber descontos e promoções
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Seu email"
              className="flex-1 px-4 py-2 rounded-lg outline-none text-sm"
              style={{ background: "#1a1220", border: "1px solid #4a3570", color: "#ffffff" }}
            />
            <button
              className="px-6 py-2 rounded-lg font-bold text-white transition-colors"
              style={{ background: "#E24B4A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#A32D2D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#E24B4A")}
            >
              Inscrever
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t" style={{ borderColor: "#2d1f3d" }}>
          <p className="text-sm" style={{ color: "#9b7fd4" }}>
            © 2026 PrimeBox. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm" style={{ color: "#FAC775" }}>
            <span>✓ Frete Grátis</span>
            <span>✓ Seguro</span>
            <span>✓ Devolução Fácil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

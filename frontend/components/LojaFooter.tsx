"use client";

export function LojaFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              🛒 E-Shop
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              A melhor loja online com os melhores produtos e preços.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
                title="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                title="Instagram"
              >
                📷
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4">Produtos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Eletrônicos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Roupas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Acessórios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Promoções
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Rastriar Pedido
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Devoluções
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contrato de Compra
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-2">Receba Ofertas Exclusivas</h3>
          <p className="text-gray-100 text-sm mb-4">
            Inscreva-se na nossa newsletter para receber descontos e promoções
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Seu email"
              className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Inscrever
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 E-Shop. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>✓ Frete Grátis</span>
            <span>✓ Seguro</span>
            <span>✓ Devolução Fácil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

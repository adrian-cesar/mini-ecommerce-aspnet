using MiniEcommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace MiniEcommerce.Data
{
    /// <summary>
    /// Classe para popular banco de dados com dados iniciais
    /// </summary>
    public static class SeedData
    {
        /// <summary>
        /// Inicializa o banco de dados com dados padrão
        /// </summary>
        public static void InitializeDb(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider
                    .GetRequiredService<AppDbContext>();

                try
                {
                    context.Database.Migrate();

                    SeedAdmin(context);
                    SeedCategorias(context);
                    SeedProdutos(context);
                    SeedClientesEVendaDemo(context);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Erro ao popular banco: {ex.Message}");
                }
            }
        }

        private static void SeedAdmin(AppDbContext context)
        {
            if (!context.Usuarios.Any(u => u.Email == "admin@primebox.com"))
            {
                context.Usuarios.Add(new Usuario
                {
                    Email = "admin@primebox.com",
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Nome = "Admin",
                    Role = "admin"
                });
                context.SaveChanges();
                Console.WriteLine("✅ Usuário admin padrão criado.");
            }

            // Hotfix: garante que o admin tenha Role = "admin" mesmo se criado antes deste campo existir
            var admin = context.Usuarios.FirstOrDefault(u => u.Email == "admin@primebox.com");
            if (admin != null && admin.Role != "admin")
            {
                admin.Role = "admin";
                context.SaveChanges();
                Console.WriteLine("Role do admin corrigida para 'admin'.");
            }
        }

        private static void SeedCategorias(AppDbContext context)
        {
            if (context.Categorias.Any())
            {
                return;
            }

            var categorias = new[]
            {
                new Categoria
                {
                    Nome = "Eletrônicos",
                    ImagemUrl = "https://static.vecteezy.com/ti/vetor-gratis/p3/5035225-icone-do-monitor-do-computador-vetor.jpg"
                },
                new Categoria
                {
                    Nome = "Roupas",
                    ImagemUrl = "https://static.vecteezy.com/system/resources/previews/015/064/265/original/used-clothes-donation-icon-color-outline-vector.jpg"
                },
                new Categoria
                {
                    Nome = "Pets",
                    ImagemUrl = "https://svgstack.com/media/img/dog-cat-icon-SqEa934265.webp"
                },
            };

            context.Categorias.AddRange(categorias);
            context.SaveChanges();
            Console.WriteLine($"✅ {categorias.Length} categorias criadas.");
        }

        private static void SeedProdutos(AppDbContext context)
        {
            if (context.Produtos.Any())
            {
                RestaurarEstoquesDemo(context);
                return;
            }

            var eletronicos = context.Categorias.First(c => c.Nome == "Eletrônicos");
            var roupas = context.Categorias.First(c => c.Nome == "Roupas");
            var pets = context.Categorias.First(c => c.Nome == "Pets");

            var produtos = new[]
            {
                new Produto
                {
                    Nome = "Notebook Dell Inspiron",
                    Preco = 3500.00m,
                    Estoque = 5,
                    CategoriaId = eletronicos.Id,
                    ImagemUrl = "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSBeQ7Y2PpE1MVJFS0ZO3ALg1oyPesxf9Raf8lC0ZhQRajylX2uF4y2DGYAo0RHzG01Z7SuRoH_oOfI45m99Uzw2n7pJZtg673WSrBKUFQ0xjPtkX_MyLbfyA"
                },
                new Produto
                {
                    Nome = "Mouse Logitech MX Master",
                    Preco = 120.00m,
                    Estoque = 20,
                    CategoriaId = eletronicos.Id,
                    ImagemUrl = "https://m.media-amazon.com/images/I/615c1OkxYwL._AC_SL1500_.jpg"
                },
                new Produto
                {
                    Nome = "Iphone 15 PRO MAX",
                    Preco = 5000.00m,
                    Estoque = 3,
                    CategoriaId = eletronicos.Id,
                    ImagemUrl = "https://http2.mlstatic.com/D_NQ_NP_2X_768868-MLA96868173301_102025-F.webp"
                },
                new Produto
                {
                    Nome = "Camiseta \"Barra Ahlma\" Preta Estonada",
                    Preco = 256.00m,
                    Estoque = 1,
                    CategoriaId = roupas.Id,
                    ImagemUrl = "https://cdn.vnda.com.br/1200x/barracrew/2026/03/14/22_41_28_123_camiseta-20barra-20ahlma-20-preta-20estonada-20frente-20-1-22032390.png?v=1773538913"
                },
                new Produto
                {
                    Nome = "Ração Guabi Natural Cães",
                    Preco = 99.90m,
                    Estoque = 10,
                    CategoriaId = pets.Id,
                    ImagemUrl = "https://m.media-amazon.com/images/I/61bjYoe-2rL._AC_SX679_.jpg"
                },
            };

            context.Produtos.AddRange(produtos);
            context.SaveChanges();
            Console.WriteLine($"✅ {produtos.Length} produtos criados.");
        }

        // Hotfix: se algum produto estiver com estoque 0 (devido a testes), restaura valores seed mínimos
        private static void RestaurarEstoquesDemo(AppDbContext context)
        {
            var needsRestore = context.Produtos.Any(p => p.Estoque == 0);
            if (!needsRestore)
            {
                return;
            }

            Console.WriteLine("Restaurando estoques para valores seed (hotfix)...");
            var estoquesPadrao = new Dictionary<string, int>
            {
                ["Notebook Dell Inspiron"] = 5,
                ["Mouse Logitech MX Master"] = 20,
                ["Iphone 15 PRO MAX"] = 3,
                ["Camiseta \"Barra Ahlma\" Preta Estonada"] = 1,
            };

            foreach (var (nome, estoque) in estoquesPadrao)
            {
                var produto = context.Produtos.FirstOrDefault(p => p.Nome == nome);
                if (produto != null)
                {
                    produto.Estoque = estoque;
                }
            }

            context.SaveChanges();
            Console.WriteLine("Estoques restaurados.");
        }

        private static void SeedClientesEVendaDemo(AppDbContext context)
        {
            if (context.Clientes.Any() || context.Vendas.Any())
            {
                return;
            }

            var primeiroProduto = context.Produtos.OrderBy(p => p.Id).First();

            var clientes = new[]
            {
                new Cliente { Nome = "João Silva", Email = "joao@example.com" },
                new Cliente { Nome = "Maria Santos", Email = "maria@example.com" },
            };

            context.Clientes.AddRange(clientes);
            context.SaveChanges();

            var venda = new Venda
            {
                ClienteId = clientes[0].Id,
                Data = DateTime.UtcNow,
                Total = primeiroProduto.Preco,
                ItensVenda = new List<ItemVenda>
                {
                    new ItemVenda
                    {
                        ProdutoId = primeiroProduto.Id,
                        Quantidade = 1
                    }
                }
            };

            context.Vendas.Add(venda);
            context.SaveChanges();

            Console.WriteLine("✅ Clientes e venda de demonstração criados.");
        }
    }
}

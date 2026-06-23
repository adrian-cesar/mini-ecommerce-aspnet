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

                    if (!context.Usuarios.Any())
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

                    // Se já tem dados, não adiciona novamente, porém corrige estoques zerados (hotfix dev)
                    if (context.Produtos.Any() || context.Clientes.Any() || context.Vendas.Any())
                    {
                        Console.WriteLine("Banco de dados já está populado.");

                        // Hotfix: se algum produto estiver com estoque 0 (devido a testes), restaura valores seed mínimos
                        var needsRestore = context.Produtos.Any(p => p.Estoque == 0);
                        if (needsRestore)
                        {
                            Console.WriteLine("Restaurando estoques para valores seed (hotfix)...");
                            var notebook = context.Produtos.FirstOrDefault(p => p.Nome == "Notebook Dell Inspiron");
                            if (notebook != null) notebook.Estoque = 5;
                            var mouse = context.Produtos.FirstOrDefault(p => p.Nome == "Mouse Logitech MX Master");
                            if (mouse != null) mouse.Estoque = 20;
                            var iphone = context.Produtos.FirstOrDefault(p => p.Nome == "Iphone 15 PRO MAX");
                            if (iphone != null) iphone.Estoque = 3;
                            var camiseta = context.Produtos.FirstOrDefault(p => p.Nome == "Camiseta \"Barra Ahlma\" Preta Estonada");
                            if (camiseta != null) camiseta.Estoque = 1;
                            context.SaveChanges();
                            Console.WriteLine("Estoques restaurados.");
                        }

                        return;
                    }

                    // Seed mínimo para demonstração
                    var produtos = new[]
                    {
                        new Produto 
                        { 
                            Nome = "Notebook Dell Inspiron", 
                            Preco = 3500.00m, 
                            Estoque = 5 
                        },
                        new Produto 
                        { 
                            Nome = "Mouse Logitech MX Master", 
                            Preco = 120.00m, 
                            Estoque = 20 
                        }
                    };

                    context.Produtos.AddRange(produtos);

                    var clientes = new[]
                    {
                        new Cliente 
                        { 
                            Nome = "João Silva", 
                            Email = "joao@example.com" 
                        },
                        new Cliente 
                        { 
                            Nome = "Maria Santos", 
                            Email = "maria@example.com" 
                        },
                    };

                    context.Clientes.AddRange(clientes);
                    context.SaveChanges();

                    var venda = new Venda
                    {
                        ClienteId = clientes[0].Id,
                        Data = DateTime.UtcNow,
                        Total = produtos[0].Preco,
                        ItensVenda = new List<ItemVenda>
                        {
                            new ItemVenda
                            {
                                ProdutoId = produtos[0].Id,
                                Quantidade = 1
                            }
                        }
                    };

                    context.Vendas.Add(venda);
                    context.SaveChanges();

                    Console.WriteLine("✅ Banco de dados populado com sucesso!");
                    Console.WriteLine($"   - {produtos.Length} produtos criados");
                    Console.WriteLine($"   - {clientes.Length} clientes criados");
                    Console.WriteLine("   - 1 venda de exemplo criada");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Erro ao popular banco: {ex.Message}");
                }
            }
        }
    }
}

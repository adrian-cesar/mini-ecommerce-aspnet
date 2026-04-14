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

                    // Se já tem dados, não adiciona novamente
                    if (context.Produtos.Any() || context.Clientes.Any() || context.Vendas.Any())
                    {
                        Console.WriteLine("Banco de dados já está populado.");
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

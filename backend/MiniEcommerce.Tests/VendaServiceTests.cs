using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using MiniEcommerce.Data;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;
using MiniEcommerce.Repositories;
using MiniEcommerce.Services;
using Moq;

namespace MiniEcommerce.Tests
{
    public class VendaServiceTests
    {
        private static AppDbContext CreateContext(SqliteConnection connection)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new AppDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }

        private static VendaService CreateService(
            AppDbContext context,
            Mock<IVendaRepository> vendaRepository,
            Mock<IProdutoRepository> produtoRepository,
            Mock<IClienteRepository> clienteRepository)
        {
            return new VendaService(
                vendaRepository.Object,
                produtoRepository.Object,
                clienteRepository.Object,
                context);
        }

        [Fact]
        public void Create_WithValidData_CreatesVendaAndReducesStock()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);

            var cliente = new Cliente { Id = 1, Nome = "Cliente Teste", Email = "cliente@teste.com" };
            var produto = new Produto { Id = 1, Nome = "Notebook", Preco = 3500m, Estoque = 10 };

            context.Clientes.Add(cliente);
            context.Produtos.Add(produto);
            context.SaveChanges();

            var vendaRepository = new Mock<IVendaRepository>();
            var produtoRepository = new Mock<IProdutoRepository>();
            var clienteRepository = new Mock<IClienteRepository>();

            clienteRepository.Setup(r => r.GetById(1)).Returns(cliente);
            produtoRepository.Setup(r => r.GetById(1)).Returns(() => context.Produtos.Find(1));
            produtoRepository.Setup(r => r.Update(It.IsAny<Produto>()))
                .Callback<Produto>(p =>
                {
                    context.Produtos.Update(p);
                    context.SaveChanges();
                });
            vendaRepository.Setup(r => r.Add(It.IsAny<Venda>()))
                .Returns<Venda>(v =>
                {
                    context.Vendas.Add(v);
                    context.SaveChanges();
                    return v;
                });

            var service = CreateService(context, vendaRepository, produtoRepository, clienteRepository);

            var dto = new CreateVendaDto
            {
                ClienteId = 1,
                Itens = new List<CriarItemVendaDto>
                {
                    new() { ProdutoId = 1, Quantidade = 2 }
                }
            };

            var result = service.Create(dto);

            Assert.NotNull(result);
            Assert.Equal(7000m, result.Total);
            Assert.Single(result.ItensVenda);

            var produtoAtualizado = context.Produtos.Find(1);
            Assert.NotNull(produtoAtualizado);
            Assert.Equal(8, produtoAtualizado!.Estoque);
        }

        [Fact]
        public void Create_WithInsufficientStock_ThrowsException()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);

            var cliente = new Cliente { Id = 1, Nome = "Cliente Teste", Email = "cliente@teste.com" };
            var produto = new Produto { Id = 1, Nome = "Mouse", Preco = 100m, Estoque = 1 };

            context.Clientes.Add(cliente);
            context.Produtos.Add(produto);
            context.SaveChanges();

            var vendaRepository = new Mock<IVendaRepository>();
            var produtoRepository = new Mock<IProdutoRepository>();
            var clienteRepository = new Mock<IClienteRepository>();

            clienteRepository.Setup(r => r.GetById(1)).Returns(cliente);
            produtoRepository.Setup(r => r.GetById(1)).Returns(produto);

            var service = CreateService(context, vendaRepository, produtoRepository, clienteRepository);

            var dto = new CreateVendaDto
            {
                ClienteId = 1,
                Itens = new List<CriarItemVendaDto>
                {
                    new() { ProdutoId = 1, Quantidade = 2 }
                }
            };

            var exception = Assert.Throws<Exception>(() => service.Create(dto));

            Assert.Contains("Estoque insuficiente", exception.Message);
        }

        [Fact]
        public void Create_WithMissingClient_ThrowsException()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);

            var vendaRepository = new Mock<IVendaRepository>();
            var produtoRepository = new Mock<IProdutoRepository>();
            var clienteRepository = new Mock<IClienteRepository>();

            clienteRepository.Setup(r => r.GetById(99)).Returns((Cliente)null);

            var service = CreateService(context, vendaRepository, produtoRepository, clienteRepository);

            var dto = new CreateVendaDto
            {
                ClienteId = 99,
                Itens = new List<CriarItemVendaDto>
                {
                    new() { ProdutoId = 1, Quantidade = 1 }
                }
            };

            var exception = Assert.Throws<Exception>(() => service.Create(dto));

            Assert.Contains("Cliente n", exception.Message);
        }
    }
}
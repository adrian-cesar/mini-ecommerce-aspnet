using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using MiniEcommerce.Data;
using MiniEcommerce.Models;
using MiniEcommerce.Repositories;
using MiniEcommerce.Services;
using Moq;

namespace MiniEcommerce.Tests
{
    public class AuthServiceTests
    {
        private static AppDbContext CreateContext(SqliteConnection connection)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new AppDbContext(options);
            context.Database.ExecuteSqlRaw("PRAGMA foreign_keys = ON;");
            context.Database.EnsureCreated();
            return context;
        }

        [Fact]
        public void Register_WithValidData_ReturnsUsuarioAndCliente()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);
            var service = new AuthService(context);

            var usuario = service.Register("João Silva", "joao@example.com", "senha123");

            Assert.NotNull(usuario);
            Assert.True(usuario.Id > 0);
            Assert.Equal("joao@example.com", usuario.Email);
            Assert.Equal("cliente", usuario.Role);

            var clienteCriado = context.Clientes.FirstOrDefault(c => c.UsuarioId == usuario.Id);
            Assert.NotNull(clienteCriado);
            Assert.Equal("joao@example.com", clienteCriado!.Email);
        }

        [Fact]
        public void Register_WithDuplicateEmail_ThrowsException()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);
            var service = new AuthService(context);

            service.Register("João Silva", "joao@example.com", "senha123");

            var exception = Assert.Throws<InvalidOperationException>(
                () => service.Register("João Duplicado", "joao@example.com", "outrasenha"));

            Assert.Contains("já cadastrado", exception.Message);
        }

        [Fact]
        public void Login_WithValidCredentials_ReturnsUsuario()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);
            var service = new AuthService(context);

            service.Register("Maria Santos", "maria@example.com", "senha123");

            var usuario = service.Login("maria@example.com", "senha123");

            Assert.NotNull(usuario);
            Assert.Equal("maria@example.com", usuario.Email);
            Assert.Equal("Maria Santos", usuario.Nome);
        }

        [Fact]
        public void Login_WithWrongPassword_ThrowsException()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            using var context = CreateContext(connection);
            var service = new AuthService(context);

            service.Register("Maria Santos", "maria@example.com", "senha123");

            var exception = Assert.Throws<UnauthorizedAccessException>(
                () => service.Login("maria@example.com", "senhaErrada"));

            Assert.Contains("inválidos", exception.Message);
        }

        [Fact]
        public void GetByUsuarioId_WithExistingId_ReturnsCliente()
        {
            var clienteEsperado = new Cliente
            {
                Id = 1,
                Nome = "João Silva",
                Email = "joao@example.com",
                UsuarioId = 10
            };

            var mockRepository = new Mock<IClienteRepository>();
            mockRepository.Setup(r => r.GetByUsuarioId(10)).Returns(clienteEsperado);

            var service = new ClienteService(mockRepository.Object);

            var resultado = service.GetByUsuarioId(10);

            Assert.NotNull(resultado);
            Assert.Equal("João Silva", resultado.Nome);
            Assert.Equal(10, resultado.UsuarioId);
        }

        [Fact]
        public void GetByUsuarioId_WithNonExistingId_ReturnsNull()
        {
            var mockRepository = new Mock<IClienteRepository>();
            mockRepository.Setup(r => r.GetByUsuarioId(99)).Returns((Cliente)null);

            var service = new ClienteService(mockRepository.Object);

            var resultado = service.GetByUsuarioId(99);

            Assert.Null(resultado);
        }

        [Fact]
        public void Delete_ClienteWithVendaVinculada_ThrowsException()
        {
            using var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            int clienteId;

            // Cria o cliente, o produto e a venda em um contexto separado, simulando uma requisição anterior:
            // assim o contexto usado no Delete não tem essas entidades já rastreadas em memória.
            using (var setupContext = CreateContext(connection))
            {
                var cliente = new Cliente { Nome = "Cliente Teste", Email = "cliente@teste.com" };
                var produto = new Produto { Nome = "Notebook", Preco = 3500m, Estoque = 10 };
                setupContext.Clientes.Add(cliente);
                setupContext.Produtos.Add(produto);
                setupContext.SaveChanges();

                var venda = new Venda
                {
                    ClienteId = cliente.Id,
                    Data = DateTime.UtcNow,
                    Total = produto.Preco,
                    ItensVenda = new List<ItemVenda>
                    {
                        new() { ProdutoId = produto.Id, Quantidade = 1 }
                    }
                };
                setupContext.Vendas.Add(venda);
                setupContext.SaveChanges();

                clienteId = cliente.Id;
            }

            using var context = CreateContext(connection);
            var repository = new ClienteRepository(context);
            var service = new ClienteService(repository);

            var exception = Assert.Throws<InvalidOperationException>(() => service.Delete(clienteId));

            Assert.Contains("pedidos", exception.Message);
        }
    }
}

using Xunit;
using Moq;
using MiniEcommerce.Services;
using MiniEcommerce.Repositories;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Tests
{
    public class ClienteServiceTests
    {
        private readonly Mock<IClienteRepository> _mockRepository;
        private readonly ClienteService _service;

        public ClienteServiceTests()
        {
            _mockRepository = new Mock<IClienteRepository>();
            _service = new ClienteService(_mockRepository.Object);
        }

        [Fact]
        public void GetById_WithValidId_ReturnsCliente()
        {
            // Arrange
            var clienteId = 1;
            var expectedCliente = new Cliente
            {
                Id = clienteId,
                Nome = "João Silva",
                Email = "joao@example.com"
            };

            _mockRepository
                .Setup(r => r.GetById(clienteId))
                .Returns(expectedCliente);

            // Act
            var result = _service.GetById(clienteId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("João Silva", result.Nome);
            Assert.Equal("joao@example.com", result.Email);
        }

        [Fact]
        public void Create_WithValidDto_ReturnsCliente()
        {
            // Arrange
            var dto = new CreateClienteDto
            {
                Nome = "Maria Santos",
                Email = "maria@example.com"
            };

            var createdCliente = new Cliente
            {
                Id = 1,
                Nome = dto.Nome,
                Email = dto.Email
            };

            _mockRepository
                .Setup(r => r.Add(It.IsAny<Cliente>()))
                .Returns(createdCliente);

            // Act
            var result = _service.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.Equal("Maria Santos", result.Nome);
        }

        [Fact]
        public void GetAll_ReturnsAllClientes()
        {
            // Arrange
            var clientes = new List<Cliente>
            {
                new Cliente { Id = 1, Nome = "Cliente 1", Email = "cliente1@example.com" },
                new Cliente { Id = 2, Nome = "Cliente 2", Email = "cliente2@example.com" }
            };

            _mockRepository
                .Setup(r => r.GetAll())
                .Returns(clientes);

            // Act
            var result = _service.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }
    }
}

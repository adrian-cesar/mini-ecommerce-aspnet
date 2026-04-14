using Xunit;
using Moq;
using MiniEcommerce.Services;
using MiniEcommerce.Repositories;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Tests
{
    public class ProdutoServiceTests
    {
        private readonly Mock<IProdutoRepository> _mockRepository;
        private readonly ProdutoService _service;

        public ProdutoServiceTests()
        {
            _mockRepository = new Mock<IProdutoRepository>();
            _service = new ProdutoService(_mockRepository.Object);
        }

        [Fact]
        public void GetById_WithValidId_ReturnsProduto()
        {
            // Arrange - Preparar dados
            var produtoId = 1;
            var expectedProduto = new Produto
            {
                Id = produtoId,
                Nome = "Notebook Dell",
                Preco = 3500.00m,
                Estoque = 5
            };

            _mockRepository
                .Setup(r => r.GetById(produtoId))
                .Returns(expectedProduto);

            // Act - Executar
            var result = _service.GetById(produtoId);

            // Assert - Verificar
            Assert.NotNull(result);
            Assert.Equal(produtoId, result.Id);
            Assert.Equal("Notebook Dell", result.Nome);
            Assert.Equal(3500.00m, result.Preco);
            Assert.Equal(5, result.Estoque);

            // Verificar que o repositório foi chamado
            _mockRepository.Verify(r => r.GetById(produtoId), Times.Once());
        }

        [Fact]
        public void GetById_WithInvalidId_ReturnsNull()
        {
            // Arrange
            var invalidId = 999;
            _mockRepository
                .Setup(r => r.GetById(invalidId))
                .Returns((Produto)null);

            // Act
            var result = _service.GetById(invalidId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void Create_WithValidDto_ReturnsProdutoWithId()
        {
            // Arrange
            var dto = new CreateProdutoDto
            {
                Nome = "Mouse Logitech",
                Preco = 120.00m,
                Estoque = 20
            };

            var createdProduto = new Produto
            {
                Id = 2,
                Nome = dto.Nome,
                Preco = dto.Preco,
                Estoque = dto.Estoque
            };

            _mockRepository
                .Setup(r => r.Add(It.IsAny<Produto>()))
                .Returns(createdProduto);

            // Act
            var result = _service.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.Equal("Mouse Logitech", result.Nome);
            Assert.Equal(120.00m, result.Preco);
            Assert.Equal(20, result.Estoque);

            _mockRepository.Verify(r => r.Add(It.IsAny<Produto>()), Times.Once());
        }

        [Fact]
        public void Update_WithValidData_UpdatesProduto()
        {
            // Arrange
            var produtoId = 1;
            var existente = new Produto
            {
                Id = produtoId,
                Nome = "Produto Antigo",
                Preco = 100m,
                Estoque = 10
            };

            var updateDto = new UpdateProdutoDto
            {
                Nome = "Produto Atualizado",
                Preco = 150m,
                Estoque = 15
            };

            _mockRepository
                .Setup(r => r.GetById(produtoId))
                .Returns(existente);

            _mockRepository
                .Setup(r => r.Update(It.IsAny<Produto>()))
                .Callback<Produto>(p =>
                {
                    p.Nome = updateDto.Nome;
                    p.Preco = updateDto.Preco;
                    p.Estoque = updateDto.Estoque;
                });

            // Act
            var result = _service.Update(produtoId, updateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Produto Atualizado", result.Nome);
            Assert.Equal(150m, result.Preco);
            Assert.Equal(15, result.Estoque);

            _mockRepository.Verify(r => r.Update(It.IsAny<Produto>()), Times.Once());
        }

        [Fact]
        public void GetAll_ReturnsAllProdutos()
        {
            // Arrange
            var produtos = new List<Produto>
            {
                new Produto { Id = 1, Nome = "Produto 1", Preco = 100m, Estoque = 10 },
                new Produto { Id = 2, Nome = "Produto 2", Preco = 200m, Estoque = 20 },
                new Produto { Id = 3, Nome = "Produto 3", Preco = 300m, Estoque = 30 }
            };

            _mockRepository
                .Setup(r => r.GetAll())
                .Returns(produtos);

            // Act
            var result = _service.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count());
            _mockRepository.Verify(r => r.GetAll(), Times.Once());
        }
    }
}

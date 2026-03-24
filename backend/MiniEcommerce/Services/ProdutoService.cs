using System.Collections.Generic;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;
using MiniEcommerce.Repositories;

namespace MiniEcommerce.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _repository;

        public ProdutoService(IProdutoRepository repository)
        {
            _repository = repository;
        }

        // Retorna todos os produtos cadastrados.
        public IEnumerable<Produto> GetAll()
        {
            return _repository.GetAll();
        }

        // Busca um produto pelo ID.
        public Produto GetById(int id)
        {
            return _repository.GetById(id);
        }

        // Cria um produto novo a partir do DTO recebido.
        public Produto Create(CreateProdutoDto dto)
        {
            var produto = new Produto
            {
                Nome = dto.Nome,
                Preco = dto.Preco,
                Estoque = dto.Estoque
            };
            return _repository.Add(produto);
        }

        // Atualiza um produto existente; retorna null se não encontrar.
        public Produto Update(int id, UpdateProdutoDto dto)
        {
            var existente = _repository.GetById(id);
            if (existente == null) return null;
            existente.Nome = dto.Nome;
            existente.Preco = dto.Preco;
            existente.Estoque = dto.Estoque;
            _repository.Update(existente);
            return existente;
        }

        // Remove um produto pelo ID.
        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}

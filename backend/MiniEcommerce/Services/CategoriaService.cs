using System.Collections.Generic;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;
using MiniEcommerce.Repositories;

namespace MiniEcommerce.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ICategoriaRepository _repository;

        public CategoriaService(ICategoriaRepository repository)
        {
            _repository = repository;
        }

        // Retorna todas as categorias cadastradas.
        public IEnumerable<Categoria> GetAll()
        {
            return _repository.GetAll();
        }

        // Busca uma categoria pelo ID.
        public Categoria GetById(int id)
        {
            return _repository.GetById(id);
        }

        // Cria uma categoria nova a partir do DTO recebido.
        public Categoria Create(CreateCategoriaDto dto)
        {
            var categoria = new Categoria
            {
                Nome = dto.Nome,
                ImagemUrl = dto.ImagemUrl
            };
            return _repository.Add(categoria);
        }

        // Atualiza uma categoria existente; retorna null se não encontrar.
        public Categoria Update(int id, UpdateCategoriaDto dto)
        {
            var existente = _repository.GetById(id);
            if (existente == null) return null;
            existente.Nome = dto.Nome;
            existente.ImagemUrl = dto.ImagemUrl;
            _repository.Update(existente);
            return existente;
        }

        // Remove uma categoria pelo ID.
        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}

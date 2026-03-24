using System.Collections.Generic;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;
using MiniEcommerce.Repositories;

namespace MiniEcommerce.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _repository;

        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }

        // Retorna todos os clientes.
        public IEnumerable<Cliente> GetAll()
        {
            return _repository.GetAll();
        }

        // Busca um cliente específico pelo ID.
        public Cliente GetById(int id)
        {
            return _repository.GetById(id);
        }

        // Cria um novo cliente a partir do DTO.
        public Cliente Create(CreateClienteDto dto)
        {
            var cliente = new Cliente
            {
                Nome = dto.Nome,
                Email = dto.Email
            };
            return _repository.Add(cliente);
        }

        // Atualiza um cliente existente.
        public Cliente Update(int id, UpdateClienteDto dto)
        {
            var existente = _repository.GetById(id);
            if (existente == null) return null;
            
            existente.Nome = dto.Nome;
            existente.Email = dto.Email;
            _repository.Update(existente);
            return existente;
        }

        // Remove um cliente do sistema.
        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}

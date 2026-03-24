using System.Collections.Generic;
using System.Linq;
using MiniEcommerce.Data;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly AppDbContext _context;

        public ClienteRepository(AppDbContext context)
        {
            _context = context;
        }

        // Retorna todos os clientes cadastrados.
        public IEnumerable<Cliente> GetAll()
        {
            return _context.Clientes.ToList();
        }

        // Busca um cliente pelo ID.
        public Cliente GetById(int id)
        {
            return _context.Clientes.Find(id);
        }

        // Adiciona um novo cliente no banco.
        public Cliente Add(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            _context.SaveChanges();
            return cliente;
        }

        // Atualiza os dados de um cliente.
        public void Update(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            _context.SaveChanges();
        }

        // Remove um cliente pelo ID.
        public void Delete(int id)
        {
            var cliente = _context.Clientes.Find(id);
            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
                _context.SaveChanges();
            }
        }
    }
}

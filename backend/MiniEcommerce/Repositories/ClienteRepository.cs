using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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

        // Busca o cliente vinculado a um usuário (conta da loja).
        public Cliente GetByUsuarioId(int usuarioId)
        {
            return _context.Clientes.FirstOrDefault(c => c.UsuarioId == usuarioId);
        }

        // Adiciona um novo cliente no banco.
        public Cliente Add(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            _context.SaveChanges();
            return cliente;
        }

        // Cria e persiste um cliente 'convidado' com email gerado automaticamente.
        public Cliente CreateGuest()
        {
            var cliente = new Cliente
            {
                Nome = "Convidado",
                Email = $"guest_{System.Guid.NewGuid()}@primebox.com"
            };
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
            if (cliente == null) return;

            _context.Clientes.Remove(cliente);

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                // Violação de FK: o cliente possui vendas vinculadas (ON DELETE RESTRICT).
                throw new InvalidOperationException("Este cliente possui pedidos e não pode ser excluído");
            }
        }
    }
}

using System.Collections.Generic;
using System.Linq;
using MiniEcommerce.Data;
using MiniEcommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace MiniEcommerce.Repositories
{
    public class VendaRepository : IVendaRepository
    {
        private readonly AppDbContext _context;

        public VendaRepository(AppDbContext context)
        {
            _context = context;
        }

        // Retorna todas as vendas realizadas (com seus itens)
        public IEnumerable<Venda> GetAll()
        {
            return _context.Vendas.Include(v => v.ItensVenda).ToList();
        }

        // Busca uma venda espec�fica pelo ID
        public Venda GetById(int id)
        {
            return _context.Vendas.Include(v => v.ItensVenda).FirstOrDefault(v => v.Id == id);
        }

        // Retorna todas as vendas de um cliente específico (com itens e produtos)
        public IEnumerable<Venda> GetByClienteId(int clienteId)
        {
            return _context.Vendas
                .Include(v => v.ItensVenda)
                    .ThenInclude(i => i.Produto)
                .Where(v => v.ClienteId == clienteId)
                .ToList();
        }

        // Registra uma nova venda no banco de dados
        public Venda Add(Venda venda)
        {
            _context.Vendas.Add(venda);
            _context.SaveChanges();
            return venda;
        }

        // Remove uma venda (raramente usado, mas implementado)
        public void Delete(int id)
        {
            var venda = _context.Vendas.Find(id);
            if (venda != null)
            {
                _context.Vendas.Remove(venda);
                _context.SaveChanges();
            }
        }
    }
}

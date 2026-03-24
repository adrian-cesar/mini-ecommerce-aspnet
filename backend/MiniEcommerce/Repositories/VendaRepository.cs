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

        // Busca uma venda específica pelo ID
        public Venda GetById(int id)
        {
            return _context.Vendas.Include(v => v.ItensVenda).FirstOrDefault(v => v.Id == id);
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

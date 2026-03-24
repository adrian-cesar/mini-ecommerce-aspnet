using System.Collections.Generic;
using System.Linq;
using MiniEcommerce.Data;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly AppDbContext _context;

        public ProdutoRepository(AppDbContext context)
        {
            _context = context;
        }

        // Retorna todos os produtos.
        public IEnumerable<Produto> GetAll()
        {
            return _context.Produtos.ToList();
        }

        // Busca produto por ID.
        public Produto GetById(int id)
        {
            return _context.Produtos.Find(id);
        }

        // Adiciona um produto novo no banco.
        public Produto Add(Produto produto)
        {
            _context.Produtos.Add(produto);
            _context.SaveChanges();
            return produto;
        }

        // Atualiza um produto existente.
        public void Update(Produto produto)
        {
            _context.Produtos.Update(produto);
            _context.SaveChanges();
        }

        // Remove produto por ID, se existir.
        public void Delete(int id)
        {
            var p = _context.Produtos.Find(id);
            if (p != null)
            {
                _context.Produtos.Remove(p);
                _context.SaveChanges();
            }
        }
    }
}

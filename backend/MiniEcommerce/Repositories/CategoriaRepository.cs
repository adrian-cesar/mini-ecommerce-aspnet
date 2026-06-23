using System.Collections.Generic;
using System.Linq;
using MiniEcommerce.Data;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly AppDbContext _context;

        public CategoriaRepository(AppDbContext context)
        {
            _context = context;
        }

        // Retorna todas as categorias.
        public IEnumerable<Categoria> GetAll()
        {
            return _context.Categorias.ToList();
        }

        // Busca categoria por ID.
        public Categoria GetById(int id)
        {
            return _context.Categorias.Find(id);
        }

        // Adiciona uma categoria nova no banco.
        public Categoria Add(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            _context.SaveChanges();
            return categoria;
        }

        // Atualiza uma categoria existente.
        public void Update(Categoria categoria)
        {
            _context.Categorias.Update(categoria);
            _context.SaveChanges();
        }

        // Remove categoria por ID, se existir.
        public void Delete(int id)
        {
            var c = _context.Categorias.Find(id);
            if (c != null)
            {
                _context.Categorias.Remove(c);
                _context.SaveChanges();
            }
        }
    }
}

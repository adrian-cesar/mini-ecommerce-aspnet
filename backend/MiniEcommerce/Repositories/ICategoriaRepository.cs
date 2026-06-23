using System.Collections.Generic;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public interface ICategoriaRepository
    {
        IEnumerable<Categoria> GetAll();
        Categoria GetById(int id);
        Categoria Add(Categoria categoria);
        void Update(Categoria categoria);
        void Delete(int id);
    }
}

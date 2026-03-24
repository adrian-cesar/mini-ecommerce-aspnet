using System.Collections.Generic;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public interface IProdutoRepository
    {
        IEnumerable<Produto> GetAll();
        Produto GetById(int id);
        Produto Add(Produto produto);
        void Update(Produto produto);
        void Delete(int id);
    }
}

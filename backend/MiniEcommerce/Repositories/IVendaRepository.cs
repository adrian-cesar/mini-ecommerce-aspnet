using System.Collections.Generic;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Repositories
{
    public interface IVendaRepository
    {
        IEnumerable<Venda> GetAll();
        Venda GetById(int id);
        Venda Add(Venda venda);
        void Delete(int id);
    }
}

using System.Collections.Generic;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public interface IClienteRepository
    {
        IEnumerable<Cliente> GetAll();
        Cliente GetById(int id);
        Cliente Add(Cliente cliente);
        void Update(Cliente cliente);
        void Delete(int id);
    }
}

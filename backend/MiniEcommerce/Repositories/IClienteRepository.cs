using System.Collections.Generic;
using MiniEcommerce.Models;

namespace MiniEcommerce.Repositories
{
    public interface IClienteRepository
    {
        IEnumerable<Cliente> GetAll();
        Cliente GetById(int id);
        Cliente GetByUsuarioId(int usuarioId);
        Cliente Add(Cliente cliente);
        Cliente CreateGuest();
        void Update(Cliente cliente);
        void Delete(int id);
    }
}

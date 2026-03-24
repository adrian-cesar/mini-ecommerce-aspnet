using System.Collections.Generic;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Services
{
    public interface IClienteService
    {
        IEnumerable<Cliente> GetAll();
        Cliente GetById(int id);
        Cliente Create(CreateClienteDto dto);
        Cliente Update(int id, UpdateClienteDto dto);
        void Delete(int id);
    }
}

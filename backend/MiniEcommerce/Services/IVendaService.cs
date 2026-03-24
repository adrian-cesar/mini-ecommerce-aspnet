using System.Collections.Generic;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Services
{
    public interface IVendaService
    {
        IEnumerable<Venda> GetAll();
        Venda GetById(int id);
        
        // Este é o método mais importante: cria a venda validando estoque
        Venda Create(CreateVendaDto dto);
    }
}

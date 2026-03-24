using System.Collections.Generic;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Services
{
    public interface IProdutoService
    {
        IEnumerable<Produto> GetAll();
        Produto GetById(int id);
        Produto Create(CreateProdutoDto dto);
        Produto Update(int id, UpdateProdutoDto dto);
        void Delete(int id);
    }
}

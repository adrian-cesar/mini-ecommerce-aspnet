using System.Collections.Generic;
using MiniEcommerce.Models;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Services
{
    public interface ICategoriaService
    {
        IEnumerable<Categoria> GetAll();
        Categoria GetById(int id);
        Categoria Create(CreateCategoriaDto dto);
        Categoria Update(int id, UpdateCategoriaDto dto);
        void Delete(int id);
    }
}

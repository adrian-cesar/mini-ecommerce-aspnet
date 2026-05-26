using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MiniEcommerce.Services;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("admin")]
    public class AdminController : ControllerBase
    {
        private readonly IProdutoService _produtoService;

        public AdminController(IProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        // TEMP: Restaura estoques para valores seed (apenas para correção rápida em dev)
        [HttpPost("reset-seeds")]
        [AllowAnonymous]
        public IActionResult ResetSeeds()
        {
            var updates = new[]
            {
                new { Id = 1, Estoque = 5 },
                new { Id = 2, Estoque = 20 },
                new { Id = 3, Estoque = 3 },
                new { Id = 4, Estoque = 1 },
            };

            foreach (var u in updates)
            {
                var prod = _produtoService.GetById(u.Id);
                if (prod != null)
                {
                    prod.Estoque = u.Estoque;
                    _produtoService.Update(u.Id, new MiniEcommerce.Dtos.UpdateProdutoDto
                    {
                        Nome = prod.Nome,
                        Preco = prod.Preco,
                        Descricao = prod.Descricao,
                        Categoria = prod.Categoria,
                        ImagemUrl = prod.ImagemUrl,
                        Estoque = prod.Estoque
                    });
                }
            }

            return Ok(new { mensagem = "Estoques restaurados" });
        }
    }
}

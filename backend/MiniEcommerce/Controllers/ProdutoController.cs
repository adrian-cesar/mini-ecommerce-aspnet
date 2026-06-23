using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MiniEcommerce.Services;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("produto")]
    [Authorize]
    public class ProdutoController : ControllerBase
    {
        private readonly IProdutoService _service;

        public ProdutoController(IProdutoService service)
        {
            _service = service;
        }

        // Retorna todos os produtos.
            [HttpGet]
            [AllowAnonymous]
            public IActionResult Get() => Ok(_service.GetAll());

        // Retorna um produto pelo ID.
        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var produto = _service.GetById(id);
            if (produto == null) return NotFound();
            return Ok(produto);
        }

        // Cria um novo produto.
        [HttpPost]
        public IActionResult Post([FromBody] CreateProdutoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var produto = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = produto.Id }, produto);
        }

        // Atualiza um produto existente.
        [HttpPut("{id}")]
            [AllowAnonymous]
        public IActionResult Put(int id, [FromBody] UpdateProdutoDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = _service.Update(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // Remove um produto pelo ID.
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        // TEMP: Restaura estoques para valores seed (apenas para correção rápida em dev)
        [HttpPost("reset-seeds")]
        public IActionResult ResetSeeds()
        {
            // Valores definidos conforme SeedData
            var updates = new[]
            {
                new { Id = 1, Estoque = 5 },
                new { Id = 2, Estoque = 20 },
                new { Id = 3, Estoque = 3 },
                new { Id = 4, Estoque = 1 },
            };

            foreach (var u in updates)
            {
                var prod = _service.GetById(u.Id);
                if (prod != null)
                {
                    prod.Estoque = u.Estoque;
                    _service.Update(u.Id, new MiniEcommerce.Dtos.UpdateProdutoDto
                    {
                        Nome = prod.Nome,
                        Preco = prod.Preco,
                        Descricao = prod.Descricao,
                        Categoria = prod.Categoria,
                        CategoriaId = prod.CategoriaId,
                        ImagemUrl = prod.ImagemUrl,
                        Estoque = prod.Estoque
                    });
                }
            }

            return Ok(new { mensagem = "Estoques restaurados" });
        }
    }
}
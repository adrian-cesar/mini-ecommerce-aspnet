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
        public IActionResult Get() => Ok(_service.GetAll());

        // Retorna um produto pelo ID.
        [HttpGet("{id}")]
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
    }
}
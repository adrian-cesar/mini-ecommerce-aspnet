using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MiniEcommerce.Services;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("categoria")]
    [Authorize]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaService _service;

        public CategoriaController(ICategoriaService service)
        {
            _service = service;
        }

        // Retorna todas as categorias.
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get() => Ok(_service.GetAll());

        // Retorna uma categoria pelo ID.
        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var categoria = _service.GetById(id);
            if (categoria == null) return NotFound();
            return Ok(categoria);
        }

        // Cria uma nova categoria.
        [HttpPost]
        public IActionResult Post([FromBody] CreateCategoriaDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var categoria = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
        }

        // Atualiza uma categoria existente.
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] UpdateCategoriaDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = _service.Update(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // Remove uma categoria pelo ID.
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }
    }
}

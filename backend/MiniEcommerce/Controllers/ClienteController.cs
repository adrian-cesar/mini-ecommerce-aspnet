using Microsoft.AspNetCore.Mvc;
using MiniEcommerce.Services;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("cliente")]
    public class ClienteController : ControllerBase
    {
        private readonly IClienteService _service;

        public ClienteController(IClienteService service)
        {
            _service = service;
        }

        // GET: Retorna todos os clientes
        [HttpGet]
        public IActionResult Get() => Ok(_service.GetAll());

        // GET: Retorna um cliente específico pelo ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var cliente = _service.GetById(id);
            if (cliente == null) return NotFound();
            return Ok(cliente);
        }

        // POST: Cria um novo cliente
        [HttpPost]
        public IActionResult Post([FromBody] CreateClienteDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var cliente = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
        }

        // PUT: Atualiza um cliente existente
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] UpdateClienteDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = _service.Update(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: Remove um cliente
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }
    }
}

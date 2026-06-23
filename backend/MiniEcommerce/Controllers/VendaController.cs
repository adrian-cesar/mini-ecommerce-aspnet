using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MiniEcommerce.Services;
using MiniEcommerce.Dtos;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("venda")]
    [Authorize]
    public class VendaController : ControllerBase
    {
        private readonly IVendaService _service;

        public VendaController(IVendaService service)
        {
            _service = service;
        }

        // GET: Lista todas as vendas realizadas
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get() => Ok(_service.GetAll());

        // GET: Retorna detalhes de uma venda espec�fica
        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var venda = _service.GetById(id);
            if (venda == null) return NotFound();
            return Ok(venda);
        }

        // GET: Retorna todas as vendas de um cliente espec�fico (usado na loja, sem login de admin)
        [HttpGet("cliente/{clienteId}")]
        [AllowAnonymous]
        public IActionResult GetByClienteId(int clienteId) => Ok(_service.GetByClienteId(clienteId));

        // POST: Cria uma nova venda
        [AllowAnonymous]
        // Valida estoque e atualiza quantidade de produtos automaticamente
        [HttpPost]
        public IActionResult Post([FromBody] CreateVendaDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            try
            {
                var venda = _service.Create(dto);
                return CreatedAtAction(nameof(GetById), new { id = venda.Id }, venda);
            }
            catch (Exception ex)
            {
                // Se algo der errado (estoque insuficiente, etc), retorna erro 400
                return BadRequest(new { mensagem = ex.Message });
            }
        }

    }
}

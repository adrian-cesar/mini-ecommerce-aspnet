using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using MiniEcommerce.Data;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        /// <summary>
        /// Realiza login do usuário e retorna JWT token
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Validação básica
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email e senha são obrigatórios" });
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.SenhaHash))
            {
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            var token = GenerateToken(usuario);
            var user = new
            {
                id = usuario.Id.ToString(),
                email = usuario.Email,
                name = usuario.Nome,
                role = usuario.Role
            };

            return Ok(new { token, user });
        }

        /// <summary>
        /// Registra um novo cliente da loja, criando Usuario e Cliente vinculados
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existente = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existente != null)
            {
                return Conflict(new { message = "Email já cadastrado" });
            }

            var usuario = new Usuario
            {
                Nome = request.Nome,
                Email = request.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha),
                Role = "cliente"
            };
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var cliente = new Cliente
            {
                Nome = request.Nome,
                Email = request.Email,
                UsuarioId = usuario.Id
            };
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            var token = GenerateToken(usuario);
            var user = new
            {
                id = usuario.Id.ToString(),
                email = usuario.Email,
                name = usuario.Nome,
                role = usuario.Role
            };

            return StatusCode(201, new { token, user });
        }

        /// <summary>
        /// Gera JWT token com claims de email e user ID
        /// </summary>
        private string GenerateToken(Usuario usuario)
        {
            var jwtKey = _config.GetValue<string>("Jwt:Key")
                ?? "sua-chave-secreta-super-segura-123456-mini-ecommerce";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Role, usuario.Role),
                new Claim("user", usuario.Email)
            };

            var token = new JwtSecurityToken(
                issuer: "MiniEcommerce",
                audience: "MiniEcommerceUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    /// <summary>
    /// Modelo para requisição de login
    /// </summary>
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

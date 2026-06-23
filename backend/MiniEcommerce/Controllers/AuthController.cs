using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;
using MiniEcommerce.Services;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration config, IAuthService authService)
        {
            _config = config;
            _authService = authService;
        }

        /// <summary>
        /// Realiza login do usuário e retorna JWT token
        /// </summary>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Validação básica
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email e senha são obrigatórios" });
            }

            try
            {
                var usuario = _authService.Login(request.Email, request.Password);
                var token = GenerateToken(usuario);
                return Ok(new { token, user = ToUserResponse(usuario) });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Registra um novo cliente da loja, criando Usuario e Cliente vinculados
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var usuario = _authService.Register(request.Nome, request.Email, request.Senha);
                var token = GenerateToken(usuario);
                return StatusCode(201, new { token, user = ToUserResponse(usuario) });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        private static object ToUserResponse(Usuario usuario) => new
        {
            id = usuario.Id.ToString(),
            email = usuario.Email,
            name = usuario.Nome,
            role = usuario.Role
        };

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

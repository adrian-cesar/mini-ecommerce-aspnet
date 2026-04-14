using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace MiniEcommerce.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
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

            // Para fins de demo, aceita qualquer email/senha não vazia
            var token = GenerateToken(request.Email);
            var user = new 
            { 
                id = Guid.NewGuid().ToString(), 
                email = request.Email, 
                name = request.Email.Split("@")[0] 
            };

            return Ok(new { token, user });
        }

        /// <summary>
        /// Gera JWT token com claims de email e user ID
        /// </summary>
        private string GenerateToken(string email)
        {
            var jwtKey = _config.GetValue<string>("Jwt:Key") 
                ?? "sua-chave-secreta-super-segura-123456-mini-ecommerce";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim("user", email)
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

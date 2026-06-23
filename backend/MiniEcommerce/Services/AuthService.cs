using System;
using System.Linq;
using MiniEcommerce.Data;
using MiniEcommerce.Models;

namespace MiniEcommerce.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        // Valida as credenciais e retorna o usuário autenticado.
        public Usuario Login(string email, string senha)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash))
                throw new UnauthorizedAccessException("Email ou senha inválidos");

            return usuario;
        }

        // Cria um novo Usuario e o Cliente vinculado a ele.
        public Usuario Register(string nome, string email, string senha)
        {
            var existente = _context.Usuarios.FirstOrDefault(u => u.Email == email);
            if (existente != null)
                throw new InvalidOperationException("Email já cadastrado");

            var usuario = new Usuario
            {
                Nome = nome,
                Email = email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha),
                Role = "cliente"
            };
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            var cliente = new Cliente
            {
                Nome = nome,
                Email = email,
                UsuarioId = usuario.Id
            };
            _context.Clientes.Add(cliente);
            _context.SaveChanges();

            return usuario;
        }
    }
}

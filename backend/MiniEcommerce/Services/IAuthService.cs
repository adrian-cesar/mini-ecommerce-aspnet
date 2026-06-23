using MiniEcommerce.Models;

namespace MiniEcommerce.Services
{
    public interface IAuthService
    {
        Usuario Login(string email, string senha);
        Usuario Register(string nome, string email, string senha);
    }
}

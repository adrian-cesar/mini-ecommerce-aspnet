using System.ComponentModel.DataAnnotations;

namespace MiniEcommerce.Dtos
{
    public class CreateClienteDto
    {
        [Required(ErrorMessage = "O nome do cliente � obrigat�rio.")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O email � obrigat�rio.")]
        [EmailAddress(ErrorMessage = "Email inv�lido.")]
        public string Email { get; set; }

        public string? Telefone { get; set; }
    }
}

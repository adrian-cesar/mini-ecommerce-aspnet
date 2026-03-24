using System.ComponentModel.DataAnnotations;

namespace MiniEcommerce.Dtos
{
    public class UpdateClienteDto
    {
        [Required(ErrorMessage = "O nome do cliente é obrigatório.")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Email inválido.")]
        public string Email { get; set; }
    }
}

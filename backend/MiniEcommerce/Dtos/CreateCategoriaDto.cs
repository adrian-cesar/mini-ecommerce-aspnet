using System.ComponentModel.DataAnnotations;

namespace MiniEcommerce.Dtos
{
    public class CreateCategoriaDto
    {
        [Required]
        public string Nome { get; set; }
        public string? ImagemUrl { get; set; }
    }
}

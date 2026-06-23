using System.ComponentModel.DataAnnotations;

namespace MiniEcommerce.Dtos
{
    public class UpdateCategoriaDto
    {
        [Required]
        public string Nome { get; set; }
        public string? ImagemUrl { get; set; }
    }
}

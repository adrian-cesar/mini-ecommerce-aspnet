using System.ComponentModel.DataAnnotations;

namespace MiniEcommerce.Dtos
{
    public class CreateProdutoDto
    {
        [Required]
        public string Nome { get; set; }
        [Range(0, double.MaxValue)]
        public decimal Preco { get; set; }
        [Range(0, int.MaxValue)]
        public int Estoque { get; set; }
    }
}

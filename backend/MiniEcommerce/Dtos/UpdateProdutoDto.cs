using System.ComponentModel.DataAnnotations;

namespace MiniEcommerce.Dtos
{
    public class UpdateProdutoDto
    {
        [Required]
        public string Nome { get; set; }
        [Range(0, double.MaxValue)]
        public decimal Preco { get; set; }
        [Range(0, int.MaxValue)]
        public int Estoque { get; set; }
        public string Descricao { get; set; } = "";
        public string Categoria { get; set; } = "";
        public int? CategoriaId { get; set; }
        public string ImagemUrl { get; set; } = "";
    }
}

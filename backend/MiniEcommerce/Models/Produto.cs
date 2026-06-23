using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MiniEcommerce.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public int Estoque { get; set; }
        public string Descricao { get; set; } = "";
        public string Categoria { get; set; } = "";
        public string ImagemUrl { get; set; } = "";

        // FK para a entidade Categoria (não confundir com o campo de texto livre "Categoria" acima)
        public int? CategoriaId { get; set; }

        // Um produto pode estar em vários itens de venda
        [JsonIgnore]
        public ICollection<ItemVenda> ItensVenda { get; set; } = new List<ItemVenda>();
    }
}
using System.Collections.Generic;

namespace MiniEcommerce.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public int Estoque { get; set; }
        
        // Um produto pode estar em vários itens de venda
        public ICollection<ItemVenda> ItensVenda { get; set; } = new List<ItemVenda>();
    }
}
using System.Collections.Generic;

namespace MiniEcommerce.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        
        // Um cliente pode ter várias vendas
        public ICollection<Venda> Vendas { get; set; } = new List<Venda>();
    }
}
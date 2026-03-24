using System;
using System.Collections.Generic;

namespace MiniEcommerce.Models
{
    public class Venda
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        
        // Referência do cliente que fez a venda
        public Cliente Cliente { get; set; }
        
        public DateTime Data { get; set; }
        public decimal Total { get; set; }
        
        // Lista de itens que fazem parte dessa venda
        public ICollection<ItemVenda> ItensVenda { get; set; } = new List<ItemVenda>();
    }
}
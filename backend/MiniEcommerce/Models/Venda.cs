using System;

namespace MiniEcommerce.Models
{
    public class Venda
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public DateTime Data { get; set; }
        public decimal Total { get; set; }
    }
}
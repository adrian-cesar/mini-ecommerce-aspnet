namespace MiniEcommerce.Models
{
    public class ItemVenda
    {
        public int Id { get; set; }
        public int VendaId { get; set; }
        
        // Referência da venda a que pertence este item
        public Venda Venda { get; set; }
        
        public int ProdutoId { get; set; }
        
        // Referência ao produto vendido
        public Produto Produto { get; set; }
        
        public int Quantidade { get; set; }
    }
}

using System.Collections.Generic;

namespace MiniEcommerce.Dtos
{
    // DTO para representar cada item que entra na venda
    public class CriarItemVendaDto
    {
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }

    // DTO para criar uma venda completa (com cliente e itens)
    public class CreateVendaDto
    {
        public int ClienteId { get; set; }
        public List<CriarItemVendaDto> Itens { get; set; } = new List<CriarItemVendaDto>();
    }
}

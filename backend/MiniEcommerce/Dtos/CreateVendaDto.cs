using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MiniEcommerce.Dtos
{
    // DTO para representar cada item que entra na venda
    public class CriarItemVendaDto
    {
        [JsonPropertyName("produtoId")]
        public int ProdutoId { get; set; }
        
        [JsonPropertyName("quantidade")]
        public int Quantidade { get; set; }
    }

    // DTO para criar uma venda completa (com cliente e itens)
    public class CreateVendaDto
    {
        [JsonPropertyName("clienteId")]
        public int ClienteId { get; set; }
        
        [JsonPropertyName("itens")]
        public List<CriarItemVendaDto> Itens { get; set; } = new List<CriarItemVendaDto>();
    }
}

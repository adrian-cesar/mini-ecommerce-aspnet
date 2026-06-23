using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MiniEcommerce.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string? Telefone { get; set; }

        // Nulo para clientes guest, que não têm conta de usuário
        public int? UsuarioId { get; set; }

        [JsonIgnore]
        public Usuario? Usuario { get; set; }

        // Um cliente pode ter várias vendas
        [JsonIgnore]
        public ICollection<Venda> Vendas { get; set; } = new List<Venda>();
    }
}
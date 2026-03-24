using System;
using System.Collections.Generic;
using System.Linq;
using MiniEcommerce.Dtos;
using MiniEcommerce.Models;
using MiniEcommerce.Repositories;
using MiniEcommerce.Data;

namespace MiniEcommerce.Services
{
    public class VendaService : IVendaService
    {
        private readonly IVendaRepository _vendaRepository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IClienteRepository _clienteRepository;
        private readonly AppDbContext _context;

        public VendaService(IVendaRepository vendaRepository, IProdutoRepository produtoRepository, 
                            IClienteRepository clienteRepository, AppDbContext context)
        {
            _vendaRepository = vendaRepository;
            _produtoRepository = produtoRepository;
            _clienteRepository = clienteRepository;
            _context = context;
        }

        // Retorna todas as vendas.
        public IEnumerable<Venda> GetAll()
        {
            return _vendaRepository.GetAll();
        }

        // Busca uma venda específica pelo ID.
        public Venda GetById(int id)
        {
            return _vendaRepository.GetById(id);
        }

        // Cria uma venda validando o estoque antes de salvar.
        public Venda Create(CreateVendaDto dto)
        {
            // Verifica se o cliente existe.
            var cliente = _clienteRepository.GetById(dto.ClienteId);
            if (cliente == null)
                throw new Exception("Cliente não encontrado");

            // Verifica se há itens na venda.
            if (dto.Itens == null || dto.Itens.Count == 0)
                throw new Exception("Venda deve ter pelo menos um item");

            // Soma o total e prepara os itens da venda.
            decimal total = 0;
            var itensDaVenda = new List<ItemVenda>();

            foreach (var item in dto.Itens)
            {
                var produto = _produtoRepository.GetById(item.ProdutoId);

                if (produto == null)
                    throw new Exception($"Produto com ID {item.ProdutoId} não encontrado");

                // Confere estoque disponível.
                if (produto.Estoque < item.Quantidade)
                    throw new Exception($"Estoque insuficiente para {produto.Nome}. Disponível: {produto.Estoque}");

                // Cria o item da venda.
                var itemVenda = new ItemVenda
                {
                    ProdutoId = item.ProdutoId,
                    Quantidade = item.Quantidade
                };
                itensDaVenda.Add(itemVenda);

                total += produto.Preco * item.Quantidade;
            }

            // Se tudo ok, grava a venda e atualiza o estoque dentro de uma transação.
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var venda = new Venda
                    {
                        ClienteId = dto.ClienteId,
                        Data = DateTime.Now,
                        Total = total,
                        ItensVenda = itensDaVenda
                    };

                    _vendaRepository.Add(venda);

                    // Atualiza o estoque dos produtos vendidos.
                    foreach (var item in dto.Itens)
                    {
                        var produto = _produtoRepository.GetById(item.ProdutoId);
                        produto.Estoque -= item.Quantidade;
                        _produtoRepository.Update(produto);
                    }

                    transaction.Commit();
                    return venda;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}

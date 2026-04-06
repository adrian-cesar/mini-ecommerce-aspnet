import { apiFetch } from "@/lib/api";
import type { Sale, CreateSaleRequest } from "@/types";

interface SaleApiResponse {
  id: number;
  clienteId: number;
  dataVenda: string;
  total: number;
  itensVenda: Array<{
    id?: number;
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
  }>;
}

const SALES_ENDPOINT = "/venda";

function mapToSale(sale: SaleApiResponse): Sale {
  return {
    id: sale.id,
    clienteId: sale.clienteId,
    dataVenda: sale.dataVenda,
    total: sale.total,
    itensVenda: sale.itensVenda,
  };
}

export const saleService = {
  async getAll(): Promise<Sale[]> {
    const data = await apiFetch<SaleApiResponse[]>(SALES_ENDPOINT);
    return data.map(mapToSale);
  },

  async getById(id: number): Promise<Sale> {
    const data = await apiFetch<SaleApiResponse>(`${SALES_ENDPOINT}/${id}`);
    return mapToSale(data);
  },

  async create(request: CreateSaleRequest): Promise<Sale> {
    const data = await apiFetch<SaleApiResponse>(SALES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return mapToSale(data);
  },
};

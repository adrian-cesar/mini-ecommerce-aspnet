import { apiFetch } from "@/lib/api";
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/types";

interface ProductApiResponse {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  descricao?: string;
}

const PRODUCTS_ENDPOINT = "/produto";

function mapToProduct(product: ProductApiResponse): Product {
  return {
    id: product.id,
    nome: product.nome,
    preco: Number(product.preco),
    estoque: product.estoque,
    descricao: product.descricao,
  };
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const data = await apiFetch<ProductApiResponse[]>(PRODUCTS_ENDPOINT);
    return data.map(mapToProduct);
  },

  async getById(id: number): Promise<Product> {
    const data = await apiFetch<ProductApiResponse>(
      `${PRODUCTS_ENDPOINT}/${id}`,
    );
    return mapToProduct(data);
  },

  async create(request: CreateProductRequest): Promise<Product> {
    const data = await apiFetch<ProductApiResponse>(PRODUCTS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return mapToProduct(data);
  },

  async update(id: number, request: UpdateProductRequest): Promise<Product> {
    const data = await apiFetch<ProductApiResponse>(
      `${PRODUCTS_ENDPOINT}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      },
    );
    return mapToProduct(data);
  },

  async delete(id: number): Promise<void> {
    await apiFetch<void>(`${PRODUCTS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  },
};

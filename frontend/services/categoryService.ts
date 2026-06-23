import { apiFetch } from "@/lib/api";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types";

interface CategoryApiResponse {
  id: number;
  nome: string;
  imagemUrl?: string;
}

const CATEGORIES_ENDPOINT = "/categoria";

function mapToCategory(category: CategoryApiResponse): Category {
  return {
    id: category.id,
    nome: category.nome,
    imagemUrl: category.imagemUrl,
  };
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const data = await apiFetch<CategoryApiResponse[]>(CATEGORIES_ENDPOINT);
    return data.map(mapToCategory);
  },

  async getById(id: number): Promise<Category> {
    const data = await apiFetch<CategoryApiResponse>(
      `${CATEGORIES_ENDPOINT}/${id}`,
    );
    return mapToCategory(data);
  },

  async create(request: CreateCategoryRequest): Promise<Category> {
    const data = await apiFetch<CategoryApiResponse>(CATEGORIES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return mapToCategory(data);
  },

  async update(id: number, request: UpdateCategoryRequest): Promise<Category> {
    const data = await apiFetch<CategoryApiResponse>(
      `${CATEGORIES_ENDPOINT}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      },
    );
    return mapToCategory(data);
  },

  async delete(id: number): Promise<void> {
    await apiFetch<void>(`${CATEGORIES_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  },
};

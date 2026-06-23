"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types";

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<Category>;
  updateCategory: (id: number, data: UpdateCategoryRequest) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await categoryService.getAll();
      setCategories(response);
    } catch (err) {
      console.warn(
        "Error loading categories:",
        err instanceof Error ? err.message : err,
      );
      setError("Nao foi possivel carregar as categorias. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(
    async (data: CreateCategoryRequest) => {
      try {
        const newCategory = await categoryService.create(data);
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
      } catch (err) {
        console.error("Error creating category:", err);
        throw err;
      }
    },
    [],
  );

  const updateCategory = useCallback(
    async (id: number, data: UpdateCategoryRequest) => {
      try {
        const updated = await categoryService.update(id, data);
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? updated : c)),
        );
        return updated;
      } catch (err) {
        console.error("Error updating category:", err);
        throw err;
      }
    },
    [],
  );

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/types";

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<Product>;
  updateProduct: (id: number, data: UpdateProductRequest) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getAll();
      setProducts(response);
    } catch (err) {
      console.warn(
        "Error loading products:",
        err instanceof Error ? err.message : err,
      );
      setError("Nao foi possivel carregar os produtos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(
    async (data: CreateProductRequest) => {
      try {
        const newProduct = await productService.create(data);
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      } catch (err) {
        console.error("Error creating product:", err);
        throw err;
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (id: number, data: UpdateProductRequest) => {
      try {
        const updated = await productService.update(id, data);
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updated : p)),
        );
        return updated;
      } catch (err) {
        console.error("Error updating product:", err);
        throw err;
      }
    },
    [],
  );

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

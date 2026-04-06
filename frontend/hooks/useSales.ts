"use client";

import { useCallback, useEffect, useState } from "react";
import { saleService } from "@/services/saleService";
import type { Sale, CreateSaleRequest } from "@/types";

interface UseSalesResult {
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createSale: (data: CreateSaleRequest) => Promise<Sale>;
}

export function useSales(): UseSalesResult {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await saleService.getAll();
      setSales(response);
    } catch (err) {
      console.warn(
        "Error loading sales:",
        err instanceof Error ? err.message : err,
      );
      setError("Nao foi possivel carregar as vendas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSales();
  }, [fetchSales]);

  const createSale = useCallback(
    async (data: CreateSaleRequest) => {
      try {
        const newSale = await saleService.create(data);
        setSales((prev) => [...prev, newSale]);
        return newSale;
      } catch (err) {
        console.error("Error creating sale:", err);
        throw err;
      }
    },
    [],
  );

  return {
    sales,
    isLoading,
    error,
    refetch: fetchSales,
    createSale,
  };
}

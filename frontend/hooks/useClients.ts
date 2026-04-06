"use client";

import { useCallback, useEffect, useState } from "react";
import { clientService } from "@/services/clientService";
import type { Client, CreateClientRequest, UpdateClientRequest } from "@/types";

interface UseClientsResult {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createClient: (data: CreateClientRequest) => Promise<Client>;
  updateClient: (id: number, data: UpdateClientRequest) => Promise<Client>;
  deleteClient: (id: number) => Promise<void>;
}

export function useClients(): UseClientsResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await clientService.getAll();
      setClients(response);
    } catch (err) {
      console.warn(
        "Error loading clients:",
        err instanceof Error ? err.message : err,
      );
      setError("Nao foi possivel carregar os clientes. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  const createClient = useCallback(
    async (data: CreateClientRequest) => {
      try {
        const newClient = await clientService.create(data);
        setClients((prev) => [...prev, newClient]);
        return newClient;
      } catch (err) {
        console.error("Error creating client:", err);
        throw err;
      }
    },
    [],
  );

  const updateClient = useCallback(
    async (id: number, data: UpdateClientRequest) => {
      try {
        const updated = await clientService.update(id, data);
        setClients((prev) =>
          prev.map((c) => (c.id === id ? updated : c)),
        );
        return updated;
      } catch (err) {
        console.error("Error updating client:", err);
        throw err;
      }
    },
    [],
  );

  const deleteClient = useCallback(async (id: number) => {
    try {
      await clientService.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
      throw err;
    }
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}

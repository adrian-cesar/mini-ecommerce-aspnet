import { apiFetch } from "@/lib/api";
import type { Client, CreateClientRequest, UpdateClientRequest } from "@/types";

interface ClientApiResponse {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
}

const CLIENTS_ENDPOINT = "/cliente";

function mapToClient(client: ClientApiResponse): Client {
  return {
    id: client.id,
    nome: client.nome,
    email: client.email,
    cpf: client.cpf,
    telefone: client.telefone,
    endereco: client.endereco,
  };
}

export const clientService = {
  async getAll(): Promise<Client[]> {
    const data = await apiFetch<ClientApiResponse[]>(CLIENTS_ENDPOINT);
    return data.map(mapToClient);
  },

  async getById(id: number): Promise<Client> {
    const data = await apiFetch<ClientApiResponse>(
      `${CLIENTS_ENDPOINT}/${id}`,
    );
    return mapToClient(data);
  },

  async create(request: CreateClientRequest): Promise<Client> {
    const data = await apiFetch<ClientApiResponse>(CLIENTS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return mapToClient(data);
  },

  async update(id: number, request: UpdateClientRequest): Promise<Client> {
    const data = await apiFetch<ClientApiResponse>(
      `${CLIENTS_ENDPOINT}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      },
    );
    return mapToClient(data);
  },

  async delete(id: number): Promise<void> {
    await apiFetch<void>(`${CLIENTS_ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  },
};

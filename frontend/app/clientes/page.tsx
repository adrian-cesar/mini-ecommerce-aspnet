"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useClients } from "@/hooks/useClients";
import type { CreateClientRequest } from "@/types";

const inputStyle = {
  border: "2px solid #e8e2f4",
  color: "#1a1220",
  borderRadius: "8px",
  padding: "8px 12px",
  width: "100%",
  outline: "none",
};

export default function ClientsPage() {
  const { clients, isLoading, error, createClient, updateClient, deleteClient } =
    useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateClientRequest>({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateClient(editingId, formData);
        showFeedback("success", "Cliente atualizado com sucesso.");
      } else {
        await createClient(formData);
        showFeedback("success", "Cliente criado com sucesso.");
      }

      setFormData({ nome: "", email: "", cpf: "", telefone: "", endereco: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client: typeof clients[0]) => {
    setFormData({
      nome: client.nome,
      email: client.email,
      cpf: client.cpf || "",
      telefone: client.telefone || "",
      endereco: client.endereco || "",
    });
    setEditingId(client.id);
    setFormError(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;

    try {
      await deleteClient(id);
      showFeedback("success", "Cliente excluído com sucesso.");
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Erro ao deletar cliente");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: "", email: "", cpf: "", telefone: "", endereco: "" });
    setFormError(null);
  };

  const fields = [
    { label: "Nome", key: "nome", type: "text", required: true },
    { label: "Email", key: "email", type: "email", required: true },
    { label: "CPF", key: "cpf", type: "text" },
    { label: "Telefone", key: "telefone", type: "tel" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
              Clientes
            </h1>
            <p className="mt-1" style={{ color: "#6e52a8" }}>
              Gerencie a carteira de clientes
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ background: showForm ? "#4a3570" : "#E24B4A" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = showForm ? "#2d1f3d" : "#A32D2D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = showForm ? "#4a3570" : "#E24B4A")}
          >
            {showForm ? "Cancelar" : "+ Novo Cliente"}
          </button>
        </div>

        {feedback && (
          <div
            className="p-4 rounded-lg border text-sm font-medium"
            style={
              feedback.type === "success"
                ? { background: "#f0fff4", borderColor: "#2d8a4e", color: "#1f6b3a" }
                : { background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }
            }
          >
            {feedback.message}
          </div>
        )}

        {error && (
          <div
            className="p-4 rounded-lg border text-sm"
            style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
          >
            {error}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 space-y-4"
            style={{ border: "1px solid #e8e2f4" }}
          >
            <h2 className="text-lg font-semibold" style={{ color: "#1a1220" }}>
              {editingId ? "Editar Cliente" : "Novo Cliente"}
            </h2>

            {formError && (
              <div
                className="p-3 rounded-lg border text-sm"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#4a3570" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(formData as any)[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    disabled={isSubmitting}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                    required={field.required}
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "#4a3570" }}>
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.endereco || ""}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  disabled={isSubmitting}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 transition-colors"
                style={{ background: "#E24B4A" }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#A32D2D"; }}
                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#E24B4A"; }}
              >
                {isSubmitting ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ border: "2px solid #e8e2f4", color: "#4a3570" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6e52a8";
                  e.currentTarget.style.background = "#f0ecfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e8e2f4";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: "#E24B4A" }} />
            <p className="mt-4" style={{ color: "#6e52a8" }}>Carregando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div
            className="text-center py-12 rounded-xl border-2 border-dashed"
            style={{ borderColor: "#e8e2f4", color: "#9b7fd4" }}
          >
            Nenhum cliente encontrado
          </div>
        ) : (
          <div
            className="bg-white rounded-xl shadow overflow-hidden"
            style={{ border: "1px solid #e8e2f4" }}
          >
            <table className="w-full">
              <thead style={{ background: "#f5f3fa", borderBottom: "2px solid #e8e2f4" }}>
                <tr>
                  {["Nome", "Email", "CPF", "Telefone", "Ações"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-sm font-semibold ${i === 4 ? "text-right" : "text-left"}`}
                      style={{ color: "#2d1f3d" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    style={{ borderBottom: "1px solid #f0ecfa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fdfcff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1a1220" }}>
                      {client.nome}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6e52a8" }}>
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#9b7fd4" }}>
                      {client.cpf || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#9b7fd4" }}>
                      {client.telefone || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(client)}
                        className="font-medium text-sm transition-colors"
                        style={{ color: "#4a3570" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#2d1f3d")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#4a3570")}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="font-medium text-sm transition-colors"
                        style={{ color: "#E24B4A" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#A32D2D")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#E24B4A")}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

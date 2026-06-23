"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCategories } from "@/hooks/useCategories";
import type { CreateCategoryRequest } from "@/types";

const inputStyle = {
  border: "2px solid #e8e2f4",
  color: "#1a1220",
  borderRadius: "8px",
  padding: "8px 12px",
  width: "100%",
  outline: "none",
};

export default function CategoriesPage() {
  const { categories, isLoading, error, createCategory, updateCategory, deleteCategory } =
    useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    nome: "",
    imagemUrl: "",
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
        await updateCategory(editingId, formData);
        showFeedback("success", "Categoria atualizada com sucesso.");
      } else {
        await createCategory(formData);
        showFeedback("success", "Categoria criada com sucesso.");
      }

      setFormData({ nome: "", imagemUrl: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar categoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: typeof categories[0]) => {
    setFormData({
      nome: category.nome,
      imagemUrl: category.imagemUrl || "",
    });
    setEditingId(category.id);
    setFormError(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return;

    try {
      await deleteCategory(id);
      showFeedback("success", "Categoria excluída com sucesso.");
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Erro ao deletar categoria");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: "", imagemUrl: "" });
    setFormError(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
              Categorias
            </h1>
            <p className="mt-1" style={{ color: "#6e52a8" }}>
              Gerencie as categorias de produtos
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ background: showForm ? "#4a3570" : "#E24B4A" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = showForm ? "#2d1f3d" : "#A32D2D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = showForm ? "#4a3570" : "#E24B4A")}
          >
            {showForm ? "Cancelar" : "+ Nova Categoria"}
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
              {editingId ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            {formError && (
              <div
                className="p-3 rounded-lg border text-sm"
                style={{ background: "#fff0f0", borderColor: "#E24B4A", color: "#A32D2D" }}
              >
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4a3570" }}>
                Nome
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                disabled={isSubmitting}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#4a3570" }}>
                URL da Imagem
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="url"
                  value={formData.imagemUrl || ""}
                  onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
                  disabled={isSubmitting}
                  placeholder="https://exemplo.com/imagem.jpg"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                />

                {formData.imagemUrl && (
                  <div
                    className="w-16 h-16 shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ background: "#f0ecfa", border: "1px solid #e8e2f4" }}
                  >
                    <img
                      src={formData.imagemUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
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
            <p className="mt-4" style={{ color: "#6e52a8" }}>Carregando categorias...</p>
          </div>
        ) : categories.length === 0 ? (
          <div
            className="text-center py-12 rounded-xl border-2 border-dashed"
            style={{ borderColor: "#e8e2f4", color: "#9b7fd4" }}
          >
            Nenhuma categoria encontrada
          </div>
        ) : (
          <div
            className="bg-white rounded-xl shadow overflow-hidden"
            style={{ border: "1px solid #e8e2f4" }}
          >
            <table className="w-full">
              <thead style={{ background: "#f5f3fa", borderBottom: "2px solid #e8e2f4" }}>
                <tr>
                  {["Imagem", "Nome", "Ações"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-sm font-semibold ${i === 2 ? "text-right" : "text-left"}`}
                      style={{ color: "#2d1f3d" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    style={{ borderBottom: "1px solid #f0ecfa" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fdfcff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4">
                      <div
                        className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
                        style={{ background: "#f0ecfa", border: "1px solid #e8e2f4" }}
                      >
                        {category.imagemUrl ? (
                          <img
                            src={category.imagemUrl}
                            alt={category.nome}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-xl">🏷️</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1a1220" }}>
                      {category.nome}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="font-medium text-sm transition-colors"
                        style={{ color: "#4a3570" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#2d1f3d")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#4a3570")}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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

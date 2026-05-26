"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProducts } from "@/hooks/useProducts";
import type { CreateProductRequest } from "@/types";

const inputStyle = {
  border: "2px solid #e8e2f4",
  color: "#1a1220",
  borderRadius: "8px",
  padding: "8px 12px",
  width: "100%",
  outline: "none",
};

export default function ProductsPage() {
  const { products, isLoading, error, createProduct, updateProduct, deleteProduct } =
    useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    nome: "",
    preco: 0,
    estoque: 0,
    descricao: "",
    categoria: "",
    imagemUrl: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }

      setFormData({ nome: "", preco: 0, estoque: 0, descricao: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: typeof products[0]) => {
    setFormData({
      nome: product.nome,
      preco: product.preco,
      estoque: product.estoque,
      descricao: product.descricao || "",
      categoria: product.categoria || "",
      imagemUrl: product.imagemUrl || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await deleteProduct(id);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao deletar produto");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: "", preco: 0, estoque: 0, descricao: "", categoria: "", imagemUrl: "" });
    setFormError(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1a1220" }}>
              Produtos
            </h1>
            <p className="mt-1" style={{ color: "#6e52a8" }}>
              Gerencie o catálogo de produtos
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ background: showForm ? "#4a3570" : "#E24B4A" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = showForm ? "#2d1f3d" : "#A32D2D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = showForm ? "#4a3570" : "#E24B4A")}
          >
            {showForm ? "Cancelar" : "+ Novo Produto"}
          </button>
        </div>

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
              {editingId ? "Editar Produto" : "Novo Produto"}
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
              {[
                { label: "Nome", key: "nome", type: "text", required: true },
                { label: "Preço", key: "preco", type: "number", step: "0.01", required: true },
                { label: "Estoque", key: "estoque", type: "number", required: true },
                { label: "Categoria", key: "categoria", type: "text", placeholder: "Ex: Eletrônicos..." },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#4a3570" }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    step={field.step}
                    value={(formData as any)[field.key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                    placeholder={field.placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                    required={field.required}
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "#4a3570" }}>
                  Descrição
                </label>
                <textarea
                  value={formData.descricao || ""}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  disabled={isSubmitting}
                  rows={3}
                  style={{ ...inputStyle }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6e52a8")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e2f4")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "#4a3570" }}>
                  URL da Imagem
                </label>
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
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: "#E24B4A" }}
            />
            <p className="mt-4" style={{ color: "#6e52a8" }}>
              Carregando produtos...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            className="text-center py-12 rounded-xl border-2 border-dashed"
            style={{ borderColor: "#e8e2f4", color: "#9b7fd4" }}
          >
            Nenhum produto encontrado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow overflow-hidden"
                style={{ border: "1px solid #e8e2f4" }}
              >
                <div
                  className="w-full h-40 flex items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f0ecfa 0%, #e8e2f4 100%)" }}
                >
                  {product.imagemUrl ? (
                    <img
                      src={product.imagemUrl}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {product.categoria && (
                    <span
                      className="inline-block px-2 py-1 text-xs font-semibold rounded"
                      style={{ background: "#f0ecfa", color: "#6e52a8" }}
                    >
                      {product.categoria}
                    </span>
                  )}

                  <h3 className="text-lg font-semibold" style={{ color: "#1a1220" }}>
                    {product.nome}
                  </h3>

                  {product.descricao && (
                    <p className="text-sm line-clamp-2" style={{ color: "#6e52a8" }}>
                      {product.descricao}
                    </p>
                  )}

                  <div className="space-y-1 pt-2" style={{ borderTop: "1px solid #f0ecfa" }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#9b7fd4" }}>Preço:</span>
                      <span className="font-semibold" style={{ color: "#E24B4A" }}>
                        R$ {product.preco.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#9b7fd4" }}>Estoque:</span>
                      <span
                        className="font-semibold"
                        style={{ color: product.estoque > 0 ? "#2d8a4e" : "#E24B4A" }}
                      >
                        {product.estoque}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                      style={{ background: "#f0ecfa", color: "#4a3570" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#4a3570";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f0ecfa";
                        e.currentTarget.style.color = "#4a3570";
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors"
                      style={{ background: "#fff0f0", color: "#E24B4A" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#E24B4A";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff0f0";
                        e.currentTarget.style.color = "#E24B4A";
                      }}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

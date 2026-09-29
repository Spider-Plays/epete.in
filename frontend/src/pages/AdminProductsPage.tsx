import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "../components/Icon";
import { useAuth } from "../hooks";
import api from "../services/api";
import { Product } from "../types";
import { formatPrice } from "../utils";

type Category = { id: string; name: string; slug: string };

type FormState = {
  name: string;
  description: string;
  basePrice: string;
  categoryId: string;
  imageUrl: string;
  primaryColor: string;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  basePrice: "699",
  categoryId: "",
  imageUrl: "/images/designs/baarisu-red.jpg",
  primaryColor: "Red",
};

export function AdminProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.get("/products").then((r) => r.data.data as Product[]),
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // derive from products if no categories endpoint
      const list = await api.get("/products").then((r) => r.data.data as Product[]);
      const map = new Map<string, Category>();
      list.forEach((p) => {
        if (p.category) map.set(p.category.id, p.category as Category);
      });
      return Array.from(map.values());
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  useEffect(() => {
    if (!form.categoryId && categories[0]) {
      setForm((f) => ({ ...f, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        basePrice: Number(form.basePrice),
        categoryId: form.categoryId,
        imageUrl: form.imageUrl.trim(),
        primaryColor: form.primaryColor,
        colorImages: {
          Red: form.imageUrl.trim(),
          Olive: form.imageUrl.trim(),
          Black: form.imageUrl.trim(),
          Navy: form.imageUrl.trim(),
        },
      };
      if (editingId) {
        return api.put(`/products/${editingId}`, {
          name: payload.name,
          description: payload.description,
          basePrice: payload.basePrice,
          imageUrl: payload.imageUrl,
          colorImages: payload.colorImages,
        });
      }
      return api.post("/products", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setMessage(editingId ? "Product updated" : "Product created (all sizes & 4 colours)");
      setError("");
      setEditingId(null);
      setForm((f) => ({ ...EMPTY, categoryId: f.categoryId || categories[0]?.id || "" }));
    },
    onError: (err: unknown) => {
      setMessage("");
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Save failed"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setMessage("Product deleted");
    },
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-headline text-headline-lg">Admin only</h1>
        <p className="mt-2 text-on-surface-variant">Sign in with an admin account to manage products.</p>
        <Link to="/login" className="inline-block mt-4 text-primary font-bold">
          Go to login
        </Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      basePrice: String(p.basePrice),
      categoryId: p.categoryId,
      imageUrl: p.images.find((i) => i.isPrimary)?.url || p.images[0]?.url || "",
      primaryColor: p.images.find((i) => i.isPrimary)?.altText || "Red",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop pb-space-3xl">
      <div className="flex flex-wrap items-end justify-between gap-space-md py-space-lg">
        <div>
          <p className="font-label text-label-sm text-primary font-bold uppercase tracking-wider">Admin</p>
          <h1 className="font-headline text-headline-lg">Products</h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Add or edit products. New items get S–XXL and Red / Olive / Black / Navy automatically.
          </p>
        </div>
        <Link to="/admin" className="font-label text-label-md text-on-surface-variant hover:text-primary">
          ← Dashboard
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-surface-container-lowest rounded-xl shadow-card p-space-lg mb-space-xl grid gap-space-md md:grid-cols-2"
      >
        <h2 className="md:col-span-2 font-headline text-headline-sm">
          {editingId ? "Edit product" : "Add new product"}
        </h2>
        {message && (
          <p className="md:col-span-2 rounded-lg bg-tertiary/10 text-tertiary px-space-md py-space-sm text-body-sm">
            {message}
          </p>
        )}
        {error && (
          <p className="md:col-span-2 rounded-lg bg-error/10 text-error px-space-md py-space-sm text-body-sm">
            {error}
          </p>
        )}
        <div className="md:col-span-2">
          <label className="font-label text-label-md block mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md outline-none focus:shadow-[0_0_0_2px_#e11f26]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="font-label text-label-md block mb-1">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-outline-variant/50 px-space-md py-space-sm outline-none focus:shadow-[0_0_0_2px_#e11f26]"
          />
        </div>
        <div>
          <label className="font-label text-label-md block mb-1">Price (₹)</label>
          <input
            required
            type="number"
            min={1}
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md outline-none focus:shadow-[0_0_0_2px_#e11f26]"
          />
        </div>
        <div>
          <label className="font-label text-label-md block mb-1">Category</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="font-label text-label-md block mb-1">Image URL</label>
          <input
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full h-11 rounded-lg border border-outline-variant/50 px-space-md outline-none focus:shadow-[0_0_0_2px_#e11f26]"
            placeholder="/images/designs/…"
          />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-space-sm">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="h-11 px-space-xl rounded-lg bg-primary text-on-primary font-label text-label-md font-bold disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving…" : editingId ? "Update product" : "Create product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm((f) => ({ ...EMPTY, categoryId: f.categoryId }));
              }}
              className="h-11 px-space-lg rounded-lg border border-outline-variant/50 font-label text-label-md"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
        <div className="px-space-lg py-space-md border-b border-surface-container flex items-center justify-between">
          <h2 className="font-headline text-headline-sm">Catalog ({products.length})</h2>
        </div>
        {isLoading ? (
          <p className="p-space-lg text-on-surface-variant">Loading…</p>
        ) : (
          <div className="divide-y divide-surface-container">
            {products.map((p) => {
              const img = p.images.find((i) => i.isPrimary) || p.images[0];
              return (
                <div key={p.id} className="flex gap-space-md p-space-md items-center">
                  <img
                    src={img?.url || "/images/brand/logo.jpg"}
                    alt=""
                    className="w-16 h-20 object-cover rounded-lg bg-surface-container-low"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-headline text-headline-sm truncate">{p.name}</p>
                    <p className="font-body text-body-sm text-on-surface-variant">
                      {formatPrice(p.basePrice)} · {p.variants?.length || 0} variants ·{" "}
                      {p.category?.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="h-10 px-space-md rounded-lg border border-outline-variant/50 font-label text-label-md hover:border-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete “${p.name}”?`)) deleteMutation.mutate(p.id);
                    }}
                    className="h-10 w-10 rounded-lg text-error hover:bg-error/10 flex items-center justify-center"
                    aria-label="Delete"
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";
import Image from "next/image";

type Category = { _id: string; name: string; image?: string };

const CSS = `
  .card { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 12px; }
  .card:hover { border-color: #d0d0d0; }
  .btn-primary { background: #2196F3; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-primary:hover:not(:disabled) { background: #1976D2; }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: #666666; border: 1px solid #e0e0e0; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
  .btn-ghost:hover { color: #FF5252; border-color: #FF525240; }
  .btn-edit { background: transparent; color: #2196F3; border: 1px solid #2196F340; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; }
  .btn-edit:hover { background: #2196F320; }
  .input { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; color: #333333; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; box-sizing: border-box; }
  .input:focus { border-color: #2196F3; box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1); }
  .overlay { position: fixed; inset: 0; background: #00000060; display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
  .upload-area { border: 2px dashed #2196F3; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; background: #e3f2fd; }
  .upload-area:hover { border-color: #1976D2; }
`;

const toBase64 = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  const token = () => localStorage.getItem("token") || "";

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${api}/category`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  }, [api]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => {
    setEditId(null);
    setName("");
    setImagePreview(null);
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditId(c._id);
    setName(c.name);
    setImagePreview(c.image || null);
    setShowModal(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setImagePreview(b64);
  };

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        const updatePayload: Record<string, unknown> = { name, description: "Updated from Admin" };
        if (imagePreview && imagePreview.startsWith("data:image")) {
          updatePayload.image = imagePreview;
        }
        const authToken = token();
        const res = await fetch(`${api}/category/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: authToken },
          body: JSON.stringify({ category: updatePayload }),
        });
        const data = await res.json();
        if (data.success) {
          setCategories(prev => prev.map(c =>
            c._id === editId
              ? { ...c, name, image: imagePreview && !imagePreview.startsWith("data:") ? imagePreview : c.image }
              : c
          ));
          // refetch to get the new cloudinary URL
          fetchCategories();
          setShowModal(false);
        } else {
          alert((data.error || "Failed to save.") + (data.message ? "\n\n" + data.message : ""));
        }
      } else {
        const authToken = token();
        const res = await fetch(`${api}/category/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: authToken },
          body: JSON.stringify({
            name,
            description: "Added from Admin",
            isActive: true,
            image: imagePreview || undefined,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setCategories(prev => [...prev, data.category]);
          setShowModal(false);
        } else {
          alert((data.error || "Failed to save.") + (data.message ? "\n\n" + data.message : ""));
        }
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const authToken = token();
      const res = await fetch(`${api}/category/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: authToken },
      });
      const data = await res.json();
      if (data.success) setCategories(prev => prev.filter(c => c._id !== id));
      else alert(data.error || "Failed to delete.");
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{CSS}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(20px,5vw,26px)", fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
            Categories
          </h1>
          <p style={{ fontSize: 13, color: "#888888", margin: "4px 0 0 0" }}>{categories.length} total</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add New</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {categories.length === 0 && (
          <p style={{ color: "#888888", fontSize: 13 }}>No categories yet.</p>
        )}
        {categories.map(cat => (
          <div key={cat._id} className="card" style={{ padding: 20 }}>
            {cat.image && (
              <div style={{ marginBottom: 12, borderRadius: 8, overflow: "hidden", height: 100, position: "relative", background: "#2196F3" }}>
                <Image src={cat.image} alt={cat.name} fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#333333", wordBreak: "break-word" }}>{cat.name}</div>
              <button className="btn-ghost" onClick={() => remove(cat._id)}>x</button>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e0e0e0" }}>
              <button className="btn-edit" onClick={() => openEdit(cat)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="card" style={{ width: "clamp(300px,90vw,440px)", padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 20 }}>
              {editId ? "Edit Category" : "New Category"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FieldLabel label="Category Name">
                <input
                  className="input"
                  value={name}
                  placeholder="e.g. Clothing"
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && save()}
                  autoFocus
                />
              </FieldLabel>

              <FieldLabel label="Category Image">
                <label className="upload-area" style={{ display: "block" }}>
                  {imagePreview ? (
                    <div style={{ position: "relative", height: 120, borderRadius: 6, overflow: "hidden", background: "#2196F3" }}>
                      <Image src={imagePreview} alt="preview" fill style={{ objectFit: "cover" }} unoptimized />
                      <div style={{ position: "absolute", inset: 0, background: "#00000060", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: 12 }}>Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: "#666666", fontSize: 13 }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>📷</div>
                      Click to upload image
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                </label>
                {imagePreview && (
                  <button
                    onClick={() => setImagePreview(null)}
                    style={{ marginTop: 6, background: "transparent", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer" }}
                  >
                    Remove image
                  </button>
                )}
              </FieldLabel>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save} disabled={saving}>
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#2196F3", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Trash2, 
  Search, 
  Loader2, 
  FolderHeart, 
  Sparkles, 
  CheckCircle2, 
  UploadCloud, 
  Upload, 
  X, 
  Link2, 
  Pencil, 
  Image as ImageIcon 
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit category modal state
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; image: string } | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editShowUrlInput, setEditShowUrlInput] = useState(false);
  const [editUrlInput, setEditUrlInput] = useState("");
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Failed to load categories:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = async (file: File, isEdit: boolean = false) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const msg = "Please select a valid image file (PNG, JPG, WEBP, or SVG).";
      if (isEdit) setEditError(msg);
      else setError(msg);
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      const msg = "Image exceeds the maximum allowed size of 8MB.";
      if (isEdit) setEditError(msg);
      else setError(msg);
      return;
    }

    if (isEdit) {
      setEditUploading(true);
      setEditError("");
    } else {
      setUploadingImage(true);
      setError("");
    }

    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", "categories");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      if (data.urls && data.urls.length > 0) {
        const uploadedUrl = data.urls[0];
        if (isEdit) {
          setEditingCategory((prev) => (prev ? { ...prev, image: uploadedUrl } : null));
        } else {
          setCategoryImage(uploadedUrl);
        }
      }
    } catch (err: any) {
      const msg = err.message || "Failed to upload image from computer";
      if (isEdit) setEditError(msg);
      else setError(msg);
    } finally {
      if (isEdit) {
        setEditUploading(false);
        if (editFileInputRef.current) editFileInputRef.current.value = "";
      } else {
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          image: categoryImage.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      setSuccessMsg(`Category "${data.name}" added successfully!`);
      setNewCategoryName("");
      setCategoryImage("");
      setShowUrlInput(false);
      setUrlInputValue("");
      fetchCategories();

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    setEditSaving(true);
    setEditError("");

    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingCategory.name.trim(),
          image: editingCategory.image.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update category");

      setSuccessMsg(`Category "${data.name}" updated successfully!`);
      setCategories((prev) =>
        prev.map((c) => ((c._id === data._id || c.id === data.id) ? { ...c, ...data } : c))
      );
      setEditingCategory(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setEditError(err.message || "Failed to update category");
    } finally {
      setEditSaving(false);
    }
  };

  const handleRequestDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg(`Category "${deleteTarget.name}" deleted successfully.`);
        fetchCategories();
        setTimeout(() => setSuccessMsg(""), 3000);
        setDeleteTarget(null);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete category");
      }
    } catch {
      setError("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Title block */}
      <div style={styles.titleRow}>
        <div>
          <h2 style={styles.title}>Categories Management</h2>
          <p style={styles.subtitle}>Organize and catalog your products under main department categories.</p>
        </div>
        <div style={styles.badge}>
          <Sparkles size={14} style={{ marginRight: 6 }} />
          {categories.length} Total Departments
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Add Category Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Create Category</h3>
          <p style={styles.cardSub}>Generate a new product department in your storefront directory.</p>

          <form onSubmit={handleAddCategory} style={styles.form}>
            {error && <div style={styles.errorAlert}>{error}</div>}
            {successMsg && (
              <div style={styles.successAlert}>
                <CheckCircle2 size={16} style={{ marginRight: 8, flexShrink: 0 }} />
                {successMsg}
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Category Name</label>
              <input
                type="text"
                placeholder="e.g. Shoes, Accessories, Outerwear"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                style={styles.textInput}
              />
            </div>

            {/* Category Image: Upload from Computer + URL option */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Category Image</label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0], false);
                  }
                }}
                disabled={uploadingImage}
              />

              {categoryImage ? (
                <div style={styles.previewCard}>
                  <div style={styles.previewImageFrame}>
                    <img
                      src={categoryImage}
                      alt="Category Preview"
                      style={styles.previewImg}
                    />
                  </div>
                  <div style={styles.previewDetails}>
                    <span style={styles.previewTitle}>Image Selected</span>
                    <span style={styles.previewUrl} title={categoryImage}>
                      {categoryImage.length > 38 ? categoryImage.substring(0, 35) + "..." : categoryImage}
                    </span>
                  </div>
                  <div style={styles.previewActions}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={styles.changeBtn}
                      title="Upload a different image from computer"
                    >
                      <Upload size={13} style={{ marginRight: 4 }} />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryImage("")}
                      style={styles.removeBtn}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    ...styles.dropZone,
                    ...(isDragging ? styles.dropZoneActive : {}),
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0], false);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingImage ? (
                    <div style={styles.dropZoneContent}>
                      <Loader2 size={24} className="animate-spin" style={{ color: "#6366f1", marginBottom: 8, animation: "spin 1s linear infinite" }} />
                      <span style={styles.dropZoneMainText}>Uploading image from computer...</span>
                      <span style={styles.dropZoneSubText}>Please wait</span>
                    </div>
                  ) : (
                    <div style={styles.dropZoneContent}>
                      <div style={styles.dropZoneIconWrap}>
                        <UploadCloud size={24} color="#6366f1" />
                      </div>
                      <span style={styles.dropZoneMainText}>
                        <strong>Click to upload from computer</strong> or drag & drop
                      </span>
                      <span style={styles.dropZoneSubText}>PNG, JPG, WEBP, or SVG (max 8MB)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Optional URL input toggle */}
              {!categoryImage && !uploadingImage && (
                <div style={{ marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    style={styles.urlToggleBtn}
                  >
                    <Link2 size={13} style={{ marginRight: 5 }} />
                    {showUrlInput ? "Hide image URL input" : "Or paste an image web link instead"}
                  </button>

                  {showUrlInput && (
                    <div style={{ marginTop: 8, display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={urlInputValue}
                        onChange={(e) => setUrlInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (urlInputValue.trim()) {
                              setCategoryImage(urlInputValue.trim());
                              setUrlInputValue("");
                            }
                          }
                        }}
                        style={{ ...styles.textInput, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (urlInputValue.trim()) {
                            setCategoryImage(urlInputValue.trim());
                            setUrlInputValue("");
                          }
                        }}
                        disabled={!urlInputValue.trim()}
                        style={{
                          ...styles.btn,
                          padding: "8px 14px",
                          fontSize: "12px",
                          opacity: urlInputValue.trim() ? 1 : 0.6,
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting || uploadingImage} style={styles.btn}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ marginRight: 8, animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={16} style={{ marginRight: 8 }} />
                  Add Category
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Categories List */}
        <div style={styles.card}>
          <div style={styles.listHeader}>
            <h3 style={styles.cardTitle}>Store Categories</h3>
            <div style={styles.searchWrapper}>
              <Search size={16} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Filter categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          {loading ? (
            <div style={styles.loaderContainer}>
              <Loader2 size={24} className="animate-spin" style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} />
              <span style={{ marginLeft: 12, color: "#64748b" }}>Loading department list...</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div style={styles.emptyState}>
              <FolderHeart size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
              <p style={{ color: "#64748b", margin: 0 }}>No categories found matching your query.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {filteredCategories.map((cat) => (
                <div key={cat._id || cat.id} style={styles.row}>
                  <div style={styles.rowInfo}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid #e2e8f0",
                          marginRight: "12px",
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={styles.folderIcon}>📁</div>
                    )}
                    <div>
                      <div style={styles.catName}>{cat.name}</div>
                      <div style={styles.catSlug}>slug: /{cat.slug}</div>
                    </div>
                  </div>
                  <div style={styles.actionBtnsGroup}>
                    <button
                      onClick={() => setEditingCategory({
                        id: cat._id || cat.id,
                        name: cat.name,
                        image: cat.image || "",
                      })}
                      style={styles.editBtn}
                      title="Edit Category"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleRequestDelete(cat._id || cat.id, cat.name)}
                      style={styles.deleteBtn}
                      title="Delete Category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div style={styles.modalOverlay} onClick={() => !editSaving && setEditingCategory(null)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={styles.editIconBadge}>
                  <Pencil size={18} color="#6366f1" />
                </div>
                <div>
                  <h3 style={styles.modalTitle}>Edit Category</h3>
                  <p style={styles.modalSubtitle}>Update department name and cover image.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !editSaving && setEditingCategory(null)}
                style={styles.closeBtn}
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {editError && <div style={styles.errorAlert}>{editError}</div>}

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  style={styles.textInput}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Category Image</label>

                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], true);
                    }
                  }}
                  disabled={editUploading}
                />

                {editingCategory.image ? (
                  <div style={styles.previewCard}>
                    <div style={styles.previewImageFrame}>
                      <img
                        src={editingCategory.image}
                        alt="Preview"
                        style={styles.previewImg}
                      />
                    </div>
                    <div style={styles.previewDetails}>
                      <span style={styles.previewTitle}>Current Image</span>
                      <span style={styles.previewUrl} title={editingCategory.image}>
                        {editingCategory.image.length > 34 ? editingCategory.image.substring(0, 31) + "..." : editingCategory.image}
                      </span>
                    </div>
                    <div style={styles.previewActions}>
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        style={styles.changeBtn}
                        title="Upload new image from computer"
                      >
                        <Upload size={13} style={{ marginRight: 4 }} />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, image: "" })}
                        style={styles.removeBtn}
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={styles.dropZone}
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    {editUploading ? (
                      <div style={styles.dropZoneContent}>
                        <Loader2 size={22} className="animate-spin" style={{ color: "#6366f1", marginBottom: 6, animation: "spin 1s linear infinite" }} />
                        <span style={styles.dropZoneMainText}>Uploading image from computer...</span>
                      </div>
                    ) : (
                      <div style={styles.dropZoneContent}>
                        <div style={styles.dropZoneIconWrap}>
                          <UploadCloud size={22} color="#6366f1" />
                        </div>
                        <span style={styles.dropZoneMainText}>
                          <strong>Click to upload from computer</strong>
                        </span>
                        <span style={styles.dropZoneSubText}>PNG, JPG, WEBP, or SVG</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit modal optional URL input */}
                {!editingCategory.image && !editUploading && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => setEditShowUrlInput(!editShowUrlInput)}
                      style={styles.urlToggleBtn}
                    >
                      <Link2 size={13} style={{ marginRight: 5 }} />
                      {editShowUrlInput ? "Hide image URL input" : "Or paste an image web link instead"}
                    </button>

                    {editShowUrlInput && (
                      <div style={{ marginTop: 8, display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={editUrlInput}
                          onChange={(e) => setEditUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (editUrlInput.trim()) {
                                setEditingCategory({ ...editingCategory, image: editUrlInput.trim() });
                                setEditUrlInput("");
                              }
                            }
                          }}
                          style={{ ...styles.textInput, flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editUrlInput.trim()) {
                              setEditingCategory({ ...editingCategory, image: editUrlInput.trim() });
                              setEditUrlInput("");
                            }
                          }}
                          disabled={!editUrlInput.trim()}
                          style={{
                            ...styles.btn,
                            padding: "8px 14px",
                            fontSize: "12px",
                            opacity: editUrlInput.trim() ? 1 : 0.6,
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  disabled={editSaving}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving || editUploading}
                  style={{ ...styles.btn, margin: 0 }}
                >
                  {editSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" style={{ marginRight: 8, animation: "spin 1s linear infinite" }} />
                      Saving changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={
          <span>
            Are you sure you want to delete category <strong>&quot;{deleteTarget?.name}&quot;</strong>? This action cannot be undone and any products currently assigned to this department may need to be re-categorized.
          </span>
        }
        confirmText="Delete Category"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "32px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0 0",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.08)",
    color: "#6366f1",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  cardSub: {
    fontSize: "13px",
    color: "#64748b",
    margin: "4px 0 20px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
    color: "#ef4444",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: "500",
  },
  successAlert: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    color: "#10b981",
    border: "1px solid #a7f3d0",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: "500",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  inputLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },
  textInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },
  dropZone: {
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "20px 16px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropZoneActive: {
    borderColor: "#6366f1",
    backgroundColor: "rgba(99, 102, 241, 0.04)",
  },
  dropZoneContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  dropZoneIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  dropZoneMainText: {
    fontSize: "13px",
    color: "#334155",
    marginBottom: "2px",
  },
  dropZoneSubText: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  previewCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },
  previewImageFrame: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid #e2e8f0",
    flexShrink: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  previewDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  previewTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0f172a",
  },
  previewUrl: {
    fontSize: "11px",
    color: "#64748b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  previewActions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexShrink: 0,
  },
  changeBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#475569",
    backgroundColor: "white",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  removeBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  urlToggleBtn: {
    background: "none",
    border: "none",
    color: "#6366f1",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 0",
  },
  btn: {
    backgroundColor: "#0f172a",
    color: "white",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  searchWrapper: {
    position: "relative",
    width: "200px",
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px 10px 8px 32px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
    border: "2px dashed #e2e8f0",
    borderRadius: "12px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "440px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: "10px",
    transition: "all 0.15s ease",
  },
  rowInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  folderIcon: {
    fontSize: "18px",
  },
  catName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  },
  catSlug: {
    fontSize: "11px",
    color: "#94a3b8",
    fontFamily: "monospace",
  },
  actionBtnsGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  editBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#cbd5e1",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    padding: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  editIconBadge: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  modalSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: "2px 0 0 0",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    marginTop: "8px",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
  },
  cancelBtn: {
    backgroundColor: "white",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "9px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

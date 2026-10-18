"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Shield, 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Megaphone, 
  FileText, 
  FileCode, 
  Truck, 
  Mail, 
  Settings as SettingsIcon,
  Lock,
  Mail as MailIcon,
  User as UserIcon,
  AlertTriangle,
  Key
} from "lucide-react";

export interface AdminRecord {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  role: "super_admin" | "admin";
  permissions: string[];
  avatar?: string;
  createdAt?: string;
}

const AVAILABLE_PERMISSIONS = [
  {
    id: "products",
    label: "Products & Catalog",
    description: "Manage products, bundles, categories, collections, brands, sizes, colors, and templates.",
    icon: ShoppingBag,
    color: "#2563eb",
    bgColor: "#eff6ff",
  },
  {
    id: "inventory",
    label: "Inventory Management",
    description: "Monitor stock levels, set low-stock thresholds, and track product quantities.",
    icon: Package,
    color: "#059669",
    bgColor: "#ecfdf5",
  },
  {
    id: "sales",
    label: "Sales & Orders",
    description: "View orders, update order status, issue refunds, returns, and view sales reports.",
    icon: ShoppingCart,
    color: "#7c3aed",
    bgColor: "#f5f3ff",
  },
  {
    id: "customers",
    label: "Customer Management",
    description: "Access customer profiles, order history, contact details, and account data.",
    icon: Users,
    color: "#d97706",
    bgColor: "#fffbeb",
  },
  {
    id: "marketing",
    label: "Marketing & Coupons",
    description: "Create and manage promotional discount coupons and campaign banners.",
    icon: Megaphone,
    color: "#db2777",
    bgColor: "#fdf2f8",
  },
  {
    id: "blogs",
    label: "Blogs & Content",
    description: "Publish, edit, and organize blog posts and articles for the storefront.",
    icon: FileText,
    color: "#0891b2",
    bgColor: "#ecfeff",
  },
  {
    id: "pages",
    label: "Page Management",
    description: "Edit terms & conditions, policy pages, about us, and custom storefront pages.",
    icon: FileCode,
    color: "#4f46e5",
    bgColor: "#eef2ff",
  },
  {
    id: "shipping",
    label: "Shipping & Logistics",
    description: "Configure shipping zones, courier rates, delivery methods, and countries.",
    icon: Truck,
    color: "#0d9488",
    bgColor: "#f0fdfa",
  },
  {
    id: "mailbox",
    label: "Mailbox & Inquiries",
    description: "Read incoming customer contact messages, support tickets, and inquiries.",
    icon: Mail,
    color: "#475569",
    bgColor: "#f8fafc",
  },
  {
    id: "settings",
    label: "Store Settings",
    description: "Configure store currencies, theme, payment gateways, cloud storage, email, and API keys.",
    icon: SettingsIcon,
    color: "#ea580c",
    bgColor: "#fff7ed",
  },
  {
    id: "admins",
    label: "Staff & Admins Management",
    description: "Create and manage other administrator accounts and grant role permissions.",
    icon: ShieldCheck,
    color: "#6366f1",
    bgColor: "#eef2ff",
  },
];

const PRESETS = [
  {
    name: "Store Manager",
    permissions: ["products", "inventory", "sales", "customers", "shipping"],
  },
  {
    name: "Customer Support",
    permissions: ["sales", "customers", "mailbox"],
  },
  {
    name: "Content & Marketing",
    permissions: ["blogs", "pages", "marketing"],
  },
  {
    name: "Catalog Only",
    permissions: ["products", "inventory"],
  },
];

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "super_admin",
    permissions: ["products", "sales"] as string[],
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch administrators");
      }
      setAdmins(data.admins || []);
    } catch (err: any) {
      setError(err.message || "Failed to load administrators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedAdminId(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "admin",
      permissions: ["products", "sales"],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (admin: AdminRecord) => {
    if (admin.role === "super_admin") {
      return;
    }
    setIsEditing(true);
    setSelectedAdminId(admin.id || admin._id || "");
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "", // empty means leave unchanged
      role: "admin",
      permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleTogglePermission = (id: string) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(id);
      return {
        ...prev,
        permissions: exists 
          ? prev.permissions.filter(p => p !== id) 
          : [...prev.permissions, id]
      };
    });
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: AVAILABLE_PERMISSIONS.map(p => p.id)
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  const handleApplyPreset = (presetPerms: string[]) => {
    setFormData(prev => ({
      ...prev,
      permissions: [...presetPerms]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      if (!formData.username.trim() || !formData.email.trim()) {
        throw new Error("Username and email are required.");
      }

      if (!isEditing && (!formData.password || formData.password.length < 6)) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (isEditing && formData.password && formData.password.length < 6) {
        throw new Error("New password must be at least 6 characters.");
      }

      const url = isEditing && selectedAdminId 
        ? `/api/admin/admins/${selectedAdminId}` 
        : "/api/admin/admins";
      const method = isEditing ? "PUT" : "POST";

      const payload: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: isEditing && formData.role === "super_admin" ? "super_admin" : "admin",
        permissions: formData.role === "super_admin" ? [] : formData.permissions,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to save administrator.");
      }

      setIsModalOpen(false);
      setSuccessMsg(isEditing ? "Administrator updated successfully!" : "New staff administrator created successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchAdmins();
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id || deleteTarget._id;
    if (!targetId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/admins/${targetId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete administrator");
      }

      setDeleteTarget(null);
      setSuccessMsg("Administrator deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchAdmins();
    } catch (err: any) {
      alert(err.message || "Failed to delete administrator");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.username?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const superAdminCount = admins.filter(a => a.role === "super_admin").length;
  const standardAdminCount = admins.filter(a => a.role === "admin").length;

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#eef2ff",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShieldCheck size={22} />
            </div>
            <h2 style={styles.title}>Administrators & Permissions</h2>
          </div>
          <p style={styles.subtitle}>
            Control who has access to your dashboard and customize granular permissions for each admin.
          </p>
        </div>

        <button onClick={openAddModal} style={styles.addBtn}>
          <UserPlus size={18} />
          <span>Add Staff Administrator</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div style={styles.successBanner}>
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div style={styles.errorBanner}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Row */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: "4px solid #6366f1" }}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Total Staff & Admins</span>
            <div style={{ ...styles.statIconBg, backgroundColor: "#eef2ff", color: "#6366f1" }}>
              <Users size={18} />
            </div>
          </div>
          <h3 style={styles.statValue}>{admins.length}</h3>
          <p style={styles.statSub}>Active admin accounts</p>
        </div>

        <div style={{ ...styles.statCard, borderLeft: "4px solid #4f46e5" }}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Super Administrators</span>
            <div style={{ ...styles.statIconBg, backgroundColor: "#f5f3ff", color: "#4f46e5" }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <h3 style={styles.statValue}>{superAdminCount}</h3>
          <p style={styles.statSub}>Full unrestricted system access</p>
        </div>

        <div style={{ ...styles.statCard, borderLeft: "4px solid #0ea5e9" }}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Standard Admins</span>
            <div style={{ ...styles.statIconBg, backgroundColor: "#f0f9ff", color: "#0ea5e9" }}>
              <Shield size={18} />
            </div>
          </div>
          <h3 style={styles.statValue}>{standardAdminCount}</h3>
          <p style={styles.statSub}>Restricted with custom permissions</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.searchWrapper}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by username or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
            Showing {filteredAdmins.length} of {admins.length} administrators
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ marginTop: "12px", color: "#64748b", fontSize: "14px" }}>Loading administrators...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div style={styles.emptyState}>
            <ShieldCheck size={48} color="#cbd5e1" />
            <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginTop: "16px" }}>No Administrators Found</h4>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              {search ? "No administrators match your search query." : "Click 'Add New Admin' to invite your first team member."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={styles.th}>Administrator</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Allowed Access & Permissions</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin, idx) => {
                  const isSuper = admin.role === "super_admin";
                  const adminPerms = Array.isArray(admin.permissions) ? admin.permissions : [];

                  return (
                    <tr key={admin.id || admin._id || idx} style={styles.trBody}>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: isSuper ? "#6366f1" : "#0284c7",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "14px"
                          }}>
                            {admin.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                              @{admin.username}
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                              <MailIcon size={12} />
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {isSuper ? (
                          <span style={styles.superBadge}>
                            <ShieldCheck size={13} />
                            Super Admin
                          </span>
                        ) : (
                          <span style={styles.adminBadge}>
                            <Shield size={13} />
                            Administrator
                          </span>
                        )}
                      </td>

                      <td style={styles.td}>
                        {isSuper ? (
                          <span style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Check size={14} /> Full Unrestricted Access (All Modules)
                          </span>
                        ) : adminPerms.length === 0 ? (
                          <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "500" }}>
                            No permissions granted
                          </span>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxWidth: "480px" }}>
                            {adminPerms.map(pKey => {
                              const pInfo = AVAILABLE_PERMISSIONS.find(ap => ap.id === pKey);
                              return (
                                <span 
                                  key={pKey}
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    backgroundColor: pInfo?.bgColor || "#f1f5f9",
                                    color: pInfo?.color || "#475569",
                                    border: `1px solid ${pInfo?.bgColor ? pInfo.bgColor : "#e2e8f0"}`,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  {pInfo?.label || pKey}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          {isSuper ? (
                            <span 
                              title="Primary Super Administrator account cannot be edited or deleted"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "#f8fafc",
                                color: "#64748b",
                                border: "1px solid #e2e8f0",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "not-allowed",
                                userSelect: "none"
                              }}
                            >
                              <Lock size={13} color="#94a3b8" />
                              <span>Locked</span>
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => openEditModal(admin)}
                                title="Edit Permissions & Account"
                                style={styles.actionBtnEdit}
                              >
                                <Edit3 size={15} />
                                <span>Edit</span>
                              </button>

                              <button 
                                onClick={() => setDeleteTarget(admin)}
                                title="Delete Admin"
                                style={styles.actionBtnDelete}
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Admin Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>
                  {isEditing ? "Edit Administrator & Permissions" : "Add Staff Administrator"}
                </h3>
                <p style={styles.modalSubtitle}>
                  {isEditing 
                    ? "Update account credentials and granted dashboard permissions." 
                    : "Create a staff administrator login and assign what dashboard modules they can access."}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={styles.formErrorBox}>
                <AlertTriangle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              {/* Basic Fields */}
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Username <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <UserIcon size={16} style={styles.inputIcon} />
                    <input 
                      type="text"
                      required
                      placeholder="e.g. staff_john"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      style={styles.formInput}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Email Address <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <MailIcon size={16} style={styles.inputIcon} />
                    <input 
                      type="email"
                      required
                      placeholder="e.g. staff@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={styles.formInput}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {isEditing ? "New Password (leave blank to keep current)" : "Password *"}
                  </label>
                  <div style={styles.inputWrapper}>
                    <Lock size={16} style={styles.inputIcon} />
                    <input 
                      type="password"
                      placeholder={isEditing ? "••••••••" : "Minimum 6 characters"}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      style={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              {/* Notice if editing root super admin */}
              {formData.role === "super_admin" ? (
                <div style={{ ...styles.superAdminNotice, marginTop: "20px" }}>
                  <ShieldCheck size={22} color="#4f46e5" />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#312e81" }}>
                      Primary Installation Super Administrator
                    </div>
                    <div style={{ fontSize: "12px", color: "#4338ca", marginTop: "2px" }}>
                      Created during installation. This root account has full unrestricted access across all current and future dashboard sections, store settings, and staff account management.
                    </div>
                  </div>
                </div>
              ) : (
                /* Granular Permissions Section */
                <div style={{ marginTop: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                    <div>
                      <label style={styles.sectionLabel}>
                        Allowed Modules & Sections ({formData.permissions.length} selected)
                      </label>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>
                        Only the checked modules will be visible in this administrator&apos;s sidebar and accessible to them.
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button 
                        type="button" 
                        onClick={handleSelectAll}
                        style={styles.pillActionBtn}
                      >
                        Select All
                      </button>
                      <button 
                        type="button" 
                        onClick={handleClearAll}
                        style={styles.pillActionBtn}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Presets */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>
                      Quick Presets:
                    </span>
                    {PRESETS.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPreset(preset.permissions)}
                        style={styles.presetBtn}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>

                  {/* Permissions Grid */}
                  <div style={styles.permissionsGrid}>
                    {AVAILABLE_PERMISSIONS.map(p => {
                      const isChecked = formData.permissions.includes(p.id);
                      const IconComponent = p.icon;

                      return (
                        <div 
                          key={p.id}
                          onClick={() => handleTogglePermission(p.id)}
                          style={{
                            ...styles.permissionCard,
                            borderColor: isChecked ? p.color : "#e2e8f0",
                            backgroundColor: isChecked ? p.bgColor : "#ffffff",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            {/* Checkbox */}
                            <div style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "6px",
                              border: `2px solid ${isChecked ? p.color : "#cbd5e1"}`,
                              backgroundColor: isChecked ? p.color : "#ffffff",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "2px",
                              flexShrink: 0
                            }}>
                              {isChecked && <Check size={14} strokeWidth={3} />}
                            </div>

                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <IconComponent size={16} color={isChecked ? p.color : "#64748b"} />
                                <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                                  {p.label}
                                </span>
                              </div>
                              <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", lineHeight: "1.4" }}>
                                {p.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={styles.submitBtn}
                >
                  {submitting ? "Saving..." : (isEditing ? "Save Changes" : "Create Staff Administrator")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContainer, maxWidth: "460px" }}>
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#fef2f2",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <Trash2 size={28} />
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                Delete Administrator Account?
              </h3>

              <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "20px" }}>
                Are you sure you want to delete administrator <strong>@{deleteTarget.username}</strong> ({deleteTarget.email})? 
                This action is irreversible and they will immediately lose all access.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <button 
                  onClick={() => setDeleteTarget(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "28px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "2px",
  },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
    transition: "all 0.2s ease",
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    color: "#065f46",
    border: "1px solid #a7f3d0",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statIconBg: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
  },
  statSub: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    flexWrap: "wrap",
    gap: "12px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px 12px",
    width: "320px",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "13px",
    color: "#1e293b",
    width: "100%",
  },
  loadingContainer: {
    padding: "60px 20px",
    textAlign: "center",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  trHead: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  th: {
    padding: "12px 20px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  trBody: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.15s ease",
  },
  td: {
    padding: "16px 20px",
    verticalAlign: "middle",
  },
  superBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#4f46e5",
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "3px 8px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  adminBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#0369a1",
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    padding: "3px 8px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  actionBtnEdit: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#f8fafc",
    color: "#334155",
    border: "1px solid #e2e8f0",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  actionBtnDelete: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    color: "#ef4444",
    border: "1px solid #fecaca",
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    cursor: "pointer",
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
    zIndex: 9999,
    padding: "20px",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "19px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.3px",
    margin: 0,
  },
  modalSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "4px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
  },
  formErrorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#334155",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "0 12px",
    backgroundColor: "#ffffff",
  },
  inputIcon: {
    color: "#94a3b8",
    marginRight: "8px",
    flexShrink: 0,
  },
  formInput: {
    border: "none",
    outline: "none",
    width: "100%",
    padding: "10px 0",
    fontSize: "13px",
    color: "#1e293b",
  },
  sectionLabel: {
    fontSize: "13px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
    display: "block",
  },
  roleSelectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
  },
  roleCard: {
    border: "2px solid",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  pillActionBtn: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
  },
  presetBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#334155",
    cursor: "pointer",
  },
  permissionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "10px",
    maxHeight: "340px",
    overflowY: "auto",
    padding: "4px",
  },
  permissionCard: {
    border: "1px solid",
    borderRadius: "10px",
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  superAdminNotice: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "20px",
  },
  modalFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "28px",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
  },
  cancelBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
  },
  submitBtn: {
    backgroundColor: "#0f172a",
    border: "none",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.2)",
  },
};

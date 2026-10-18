"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  Settings,
  UserPlus,
  CheckCircle,
  Loader2,
  ArrowRight,
  Lock,
  ShoppingBag,
  AlertCircle
} from "lucide-react";

export default function InstallWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [websiteInfo, setWebsiteInfo] = useState({ storeName: "SnapShop", websiteLink: "" });
  const [adminInfo, setAdminInfo] = useState({ username: "super-admin", email: "", password: "" });

  // 1. Test DB Connection
  const testDbConnection = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/install/test-db");
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.error || data.message || "Failed to connect to the database.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  // 2. Setup Database Tables
  const setupDatabase = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/install/setup-db", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        setError(data.error || data.message || "Failed to initialize tables.");
      }
    } catch (err) {
      setError("Network error during database setup.");
    }
    setLoading(false);
  };

  // 3. Finalize Installation
  const finalizeInstallation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/install/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...websiteInfo,
          ...adminInfo,
          username: "super-admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(4);
      } else {
        setError(data.error || data.message || "Failed to finalize installation.");
      }
    } catch (err) {
      setError("Network error during finalization.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
        <div style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", padding: "10px", borderRadius: "12px", color: "white" }}>
          <ShoppingBag size={28} />
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, letterSpacing: "-0.5px" }}>SnapShop Setup</h1>
      </div>

      <div style={{ width: "100%", maxWidth: "600px", backgroundColor: "#1e293b", borderRadius: "16px", padding: "40px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", border: "1px solid #334155" }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "0", right: "0", height: "2px", backgroundColor: "#334155", zIndex: 0, transform: "translateY(-50%)" }}></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ position: "relative", zIndex: 1, width: "32px", height: "32px", borderRadius: "50%", backgroundColor: step >= i ? "#ef4444" : "#0f172a", border: `2px solid ${step >= i ? "#ef4444" : "#334155"}`, color: step >= i ? "white" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px", transition: "all 0.3s" }}>
              {step > i ? <CheckCircle size={16} /> : i}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Step 1: Database Connection Test */}
        {step === 1 && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Database size={32} />
            </div>

            <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Database Connection</h2>
            <p style={{ color: "#94a3b8", marginBottom: "32px", lineHeight: "1.6" }}>We'll verify your PostgreSQL connection. Ensure your <code style={{ backgroundColor: "#0f172a", padding: "2px 6px", borderRadius: "4px" }}>DATABASE_URL</code> is set correctly in your environment file before proceeding.</p>
            <button
              onClick={testDbConnection}
              disabled={loading}
              style={{ width: "100%", backgroundColor: "#ef4444", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "opacity 0.2s", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              {loading ? "Testing Connection..." : "Test PostgreSQL Connection"}
            </button>
          </div>
        )}

        {/* Step 2: Install Tables */}
        {step === 2 && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Settings size={32} />
            </div>
            <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Initialize Database</h2>
            <p style={{ color: "#94a3b8", marginBottom: "32px", lineHeight: "1.6" }}>Connection successful! Now we will generate the required tables, configuration schemas, and default English translations.</p>
            <button
              onClick={setupDatabase}
              disabled={loading}
              style={{ width: "100%", backgroundColor: "#ef4444", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "opacity 0.2s", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
              {loading ? "Installing Tables & Seeds..." : "Install Database Tables"}
            </button>
          </div>
        )}

        {/* Step 3: Website & Admin Account */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.5s" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <UserPlus size={32} />
              </div>
              <h2 style={{ fontSize: "24px", margin: "0 0 8px 0" }}>Store & Admin Account</h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Configure your store details and root administrative credentials.</p>
            </div>

            <form onSubmit={finalizeInstallation}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>Store Name</label>
                  <input
                    type="text"
                    required
                    value={websiteInfo.storeName}
                    onChange={(e) => setWebsiteInfo({ ...websiteInfo, storeName: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", color: "white", padding: "12px 14px", borderRadius: "8px", outline: "none", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>Website URL / Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. snapshop.com"
                    value={websiteInfo.websiteLink}
                    onChange={(e) => setWebsiteInfo({ ...websiteInfo, websiteLink: e.target.value })}
                    style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", color: "white", padding: "12px 14px", borderRadius: "8px", outline: "none", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>
                    Super Admin Username
                  </label>
                  <span style={{ 
                    fontSize: "11px", 
                    fontWeight: "700", 
                    color: "#818cf8", 
                    backgroundColor: "rgba(99, 102, 241, 0.15)", 
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    padding: "2px 8px", 
                    borderRadius: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <Lock size={11} />
                    Super Admin (Fixed)
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    disabled
                    readOnly
                    value="super-admin"
                    style={{ 
                      width: "100%", 
                      backgroundColor: "#0b0f19", 
                      border: "1px solid #334155", 
                      color: "#94a3b8", 
                      padding: "12px 14px", 
                      borderRadius: "8px", 
                      outline: "none", 
                      fontSize: "14px",
                      cursor: "not-allowed",
                      fontWeight: "600",
                      opacity: 0.9
                    }}
                  />
                </div>
                <p style={{ color: "#64748b", fontSize: "12px", margin: "6px 0 0 0" }}>
                  The root administrative account is permanently set to <strong>super-admin</strong> with full system access.
                </p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminInfo.email}
                  onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", color: "white", padding: "12px 14px", borderRadius: "8px", outline: "none", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#cbd5e1" }}>Admin Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminInfo.password}
                  onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #334155", color: "white", padding: "12px 14px", borderRadius: "8px", outline: "none", fontSize: "14px" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", backgroundColor: "#ef4444", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "opacity 0.2s", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                {loading ? "Finalizing Setup..." : "Complete Installation"}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.5s" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Installation Complete!</h2>
            <p style={{ color: "#94a3b8", marginBottom: "32px", lineHeight: "1.6" }}>
              Congratulations! Your SnapShop store has been configured successfully. You can now log into your dashboard and start selling.
            </p>
            <button
              onClick={() => router.push("/login")}
              style={{ width: "100%", backgroundColor: "#ef4444", color: "white", border: "none", padding: "14px", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              Go to Login <ArrowRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

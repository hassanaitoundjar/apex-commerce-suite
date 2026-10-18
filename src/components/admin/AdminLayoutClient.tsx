"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ShieldAlert, ArrowLeft, PanelLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const ROUTE_PERMISSIONS = [
  { prefix: "/admin/products", permission: "products", label: "Products & Catalog" },
  { prefix: "/admin/inventory", permission: "inventory", label: "Inventory" },
  { prefix: "/admin/orders", permission: "sales", label: "Sales & Orders" },
  { prefix: "/admin/sales", permission: "sales", label: "Sales & Orders" },
  { prefix: "/admin/customers", permission: "customers", label: "Customers" },
  { prefix: "/admin/marketing", permission: "marketing", label: "Marketing" },
  { prefix: "/admin/blogs", permission: "blogs", label: "Blogs" },
  { prefix: "/admin/pages", permission: "pages", label: "Pages" },
  { prefix: "/admin/shipping", permission: "shipping", label: "Shipping" },
  { prefix: "/admin/geography", permission: "shipping", label: "Geography" },
  { prefix: "/admin/mailbox", permission: "mailbox", label: "Mailbox" },
  { prefix: "/admin/settings", permission: "settings", label: "Settings" },
  { prefix: "/admin/admins", permission: "admins", label: "Administrator Management" },
];

export default function AdminLayoutClient({ 
  children, 
  sidebar, 
  headerRight,
  isDemoMode,
  user,
  storeName,
}: { 
  children: React.ReactNode;
  sidebar: React.ReactNode;
  headerRight?: React.ReactNode;
  isDemoMode?: boolean;
  user?: any;
  storeName?: string;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Route permission check
  const isSuperAdmin = user?.role === "super_admin";
  const userPermissions: string[] = Array.isArray(user?.permissions) ? user.permissions : [];

  let isDenied = false;
  let deniedLabel = "";

  if (user && !isSuperAdmin) {
    const matched = ROUTE_PERMISSIONS.find(r => pathname === r.prefix || pathname.startsWith(r.prefix + "/"));
    if (matched && !userPermissions.includes(matched.permission)) {
      isDenied = true;
      deniedLabel = matched.label;
    }
  }

  // Close sidebar on route change in mobile & reset window scroll position
  useEffect(() => {
    setIsSidebarOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="admin-layout-wrapper">
      <style>{`
        html, body {
          height: 100%;
          overflow: hidden;
        }

        .admin-layout-wrapper {
          display: flex;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          background-color: #f8fafc;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        
        .admin-sidebar-container {
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          flex-shrink: 0;
          transition: all 0.3s ease;
          z-index: 50;
          box-sizing: border-box;
        }
        
        .admin-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .admin-top-header {
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .admin-content-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .admin-content-body::-webkit-scrollbar {
          width: 6px;
        }
        .admin-content-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-content-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .admin-content-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .desktop-sidebar-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          color: #475569;
          padding: 6px;
          transition: all 0.2s ease;
        }
        .desktop-sidebar-toggle:hover {
          background-color: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #334155;
          padding: 8px;
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 40;
        }

        @media (max-width: 992px) {
          .desktop-sidebar-toggle {
            display: none !important;
          }
          .admin-sidebar-container {
            position: fixed;
            left: -300px;
            top: 0;
            bottom: 0;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
          }
          .admin-sidebar-container.open {
            left: 0;
          }
          .mobile-toggle {
            display: block;
          }
          .mobile-overlay.open {
            display: block;
          }
          .admin-top-header {
            padding: 0 16px !important;
          }
          .admin-content-body {
            padding: 16px !important;
          }
          .table-responsive-wrapper {
            overflow-x: auto;
            width: 100%;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`admin-sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        {sidebar}
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <header className="admin-top-header" style={{
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)} title="Open navigation">
              <Menu size={24} />
            </button>
            <button 
              className="desktop-sidebar-toggle" 
              onClick={() => window.dispatchEvent(new CustomEvent("toggle-admin-sidebar"))}
              title="Toggle sidebar"
            >
              <PanelLeft size={19} />
            </button>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#334155" }}>
              {storeName && storeName.trim() ? `${storeName} Dashboard` : "Dashboard"}
            </span>
          </div>
          
          <div id="admin-header-right-portal" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
             {headerRight}
          </div>
        </header>

        {isDemoMode && (
          <div style={{
            backgroundColor: "#fef2f2",
            borderBottom: "1px solid #fecaca",
            color: "#991b1b",
            padding: "10px 24px",
            fontSize: "13px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            textAlign: "center"
          }}>
            <span style={{ fontSize: "16px" }}>🔒</span>
            <span><strong>DEMO MODE ACTIVE:</strong> Changes, editing, and saving are disabled in this live preview. Set <code>DEMO_MODE=false</code> in your <code>.env</code> file to enable modifications.</span>
          </div>
        )}

        <div className="admin-content-body" style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
          <div className="table-responsive-wrapper">
             {isDenied ? (
               <div style={{
                 backgroundColor: "#ffffff",
                 borderRadius: "16px",
                 padding: "48px 32px",
                 textAlign: "center",
                 maxWidth: "600px",
                 margin: "40px auto",
                 boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
                 border: "1px solid #fee2e2"
               }}>
                 <div style={{
                   width: "64px",
                   height: "64px",
                   borderRadius: "50%",
                   backgroundColor: "#fef2f2",
                   color: "#ef4444",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   margin: "0 auto 20px"
                 }}>
                   <ShieldAlert size={36} />
                 </div>
                 <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                   Access Restricted
                 </h2>
                 <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "24px" }}>
                   You do not have permission to access the <strong>{deniedLabel || "this"}</strong> section. 
                   Your administrator account permissions are managed by the Super Administrator.
                 </p>
                 <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                   <Link 
                     href="/admin" 
                     style={{
                       display: "inline-flex",
                       alignItems: "center",
                       gap: "8px",
                       backgroundColor: "#0f172a",
                       color: "#ffffff",
                       padding: "10px 20px",
                       borderRadius: "8px",
                       fontSize: "14px",
                       fontWeight: "600",
                       textDecoration: "none"
                     }}
                   >
                     <ArrowLeft size={16} />
                     Back to Dashboard
                   </Link>
                 </div>
               </div>
             ) : (
               children
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

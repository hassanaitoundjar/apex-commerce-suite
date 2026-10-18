"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Users, 
  Megaphone, 
  FileText, 
  FileCode, 
  Truck, 
  Globe, 
  Settings as SettingsIcon,
  ChevronDown, 
  LogOut,
  Search,
  Mail,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  X
} from "lucide-react";

interface AdminUser {
  username?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
}

interface SubMenuItem {
  key?: string;
  label: string;
  href?: string;
}

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  subItems?: SubMenuItem[];
}

export default function Sidebar({ 
  user,
  storeName,
  logoUrl
}: { 
  user?: AdminUser;
  storeName?: string;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Collapsed sidebar state with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Floating flyout menu state for collapsed mode
  const [hoveredFlyout, setHoveredFlyout] = useState<MenuItem | null>(null);
  const [flyoutTop, setFlyoutTop] = useState<number>(0);
  const flyoutCloseTimer = useRef<NodeJS.Timeout | null>(null);

  // Active settings tab
  let activeTab = "general";
  if (pathname?.startsWith("/admin/settings/")) {
    activeTab = pathname.split("/").pop() || "general";
  }
  const isSettingsActive = pathname?.startsWith("/admin/settings");

  // Accordion state
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: pathname?.startsWith("/admin/products"),
    sales: pathname?.startsWith("/admin/orders"),
    settings: isSettingsActive,
  });

  // Load collapsed preference from localStorage and listen to external toggle event
  useEffect(() => {
    try {
      const saved = localStorage.getItem("snapshop_admin_sidebar_collapsed");
      if (saved !== null) {
        const isTrue = saved === "true";
        setTimeout(() => setIsCollapsed(isTrue), 0);
      }
    } catch {
      // LocalStorage access safe catch
    }

    const handleExternalToggle = () => {
      setIsCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem("snapshop_admin_sidebar_collapsed", String(next));
        } catch {
          // ignore
        }
        return next;
      });
    };

    window.addEventListener("toggle-admin-sidebar", handleExternalToggle);
    return () => window.removeEventListener("toggle-admin-sidebar", handleExternalToggle);
  }, []);

  // Close flyout when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setHoveredFlyout(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("snapshop_admin_sidebar_collapsed", String(next));
      } catch {
        // ignore localStorage access issues
      }
      return next;
    });
  };

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Flyout hover handlers for collapsed mode
  const handleItemMouseEnter = (item: MenuItem, e: React.MouseEvent<HTMLElement>) => {
    if (!isCollapsed) return;
    if (flyoutCloseTimer.current) {
      clearTimeout(flyoutCloseTimer.current);
      flyoutCloseTimer.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyoutTop(rect.top);
    setHoveredFlyout(item);
  };

  const handleItemMouseLeave = () => {
    if (!isCollapsed) return;
    flyoutCloseTimer.current = setTimeout(() => {
      setHoveredFlyout(null);
    }, 120);
  };

  const handleFlyoutMouseEnter = () => {
    if (flyoutCloseTimer.current) {
      clearTimeout(flyoutCloseTimer.current);
      flyoutCloseTimer.current = null;
    }
  };

  const handleFlyoutMouseLeave = () => {
    setHoveredFlyout(null);
  };

  // Define Menu Groups
  const menuGroups = [
    {
      title: "Core",
      items: [
        { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { key: "mailbox", label: "Mailbox", href: "/admin/mailbox", icon: Mail },
        { key: "docs", label: "Tutorial & Docs", href: "/admin/docs", icon: BookOpen }
      ]
    },
    {
      title: "Catalog & Operations",
      items: [
        {
          key: "products",
          label: "Products",
          icon: ShoppingBag,
          subItems: [
            { key: "all", label: "All Products", href: "/admin/products" },
            { key: "bundles", label: "Product Bundles", href: "/admin/products/bundles" },
            { key: "categories", label: "Categories", href: "/admin/products/categories" },
            { key: "collections", label: "Collections", href: "/admin/products/collections" },
            { key: "brands", label: "Brands", href: "/admin/products/brands" },
            { key: "sizes", label: "Sizes", href: "/admin/products/sizes" },
            { key: "colors", label: "Colors", href: "/admin/products/colors" },
            { key: "templates", label: "Product Templates", href: "/admin/products/templates" }
          ]
        },
        { key: "inventory", label: "Inventory", href: "/admin/inventory", icon: Package },
        {
          key: "sales",
          label: "Sales",
          icon: ShoppingCart,
          subItems: [
            { key: "orders", label: "Orders", href: "/admin/orders" },
            { key: "reports", label: "Reports", href: "/admin/sales/reports" },
            { key: "refunds", label: "Refunds", href: "/admin/sales/refunds" },
            { key: "returns", label: "Returns", href: "/admin/sales/returns" },
            { key: "batch", label: "Batch Processing", href: "/admin/sales/batch-processing" }
          ]
        },
        { key: "customers", label: "Customers", href: "/admin/customers", icon: Users }
      ]
    },
    {
      title: "Marketing & Content",
      items: [
        { key: "marketing", label: "Marketing", href: "/admin/marketing", icon: Megaphone },
        { key: "blogs", label: "Blogs", href: "/admin/blogs", icon: FileText },
        { key: "pages", label: "Page Management", href: "/admin/pages", icon: FileCode }
      ]
    },
    {
      title: "Logistics",
      items: [
        { key: "shipping", label: "Shipping", href: "/admin/shipping", icon: Truck },
        { key: "geography", label: "Geography", href: "/admin/geography", icon: Globe }
      ]
    },
    {
      title: "System Settings",
      items: [
        {
          key: "admins",
          label: "Admins & Staff",
          href: "/admin/admins",
          icon: ShieldCheck,
        },
        {
          key: "settings",
          label: "Settings",
          icon: SettingsIcon,
          subItems: [
            { key: "general", label: "General Settings", href: "/admin/settings/general" },
            { key: "theme", label: "Theme Customization", href: "/admin/settings/theme" },
            { key: "languages", label: "Languages & Flags", href: "/admin/settings/languages" },
            { key: "gateways", label: "Payment Gateways", href: "/admin/settings/gateways" },
            { key: "storage", label: "Cloud Storage", href: "/admin/settings/storage" },
            { key: "backup", label: "Backup & Restore", href: "/admin/settings/backup" },
            { key: "mobile", label: "Mobile App Config", href: "/admin/settings/mobile" },
            { key: "auth", label: "Authentication Settings", href: "/admin/settings/auth" },
            { key: "email", label: "Email Configuration", href: "/admin/settings/email" },
            { key: "ai", label: "AI API Settings", href: "/admin/settings/ai" }
          ]
        }
      ]
    }
  ];

  // Role-based authorization filtering
  const isSuperAdmin = user?.role === "super_admin";
  const userPermissions: string[] = Array.isArray(user?.permissions) ? user.permissions : [];

  const isItemAllowed = (itemKey: string) => {
    if (isSuperAdmin) return true;
    if (itemKey === "dashboard" || itemKey === "docs") return true;
    if (user) {
      return userPermissions.includes(itemKey);
    }
    return true;
  };

  const authorizedGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => isItemAllowed(item.key))
  })).filter(group => group.items.length > 0);

  // Auto-expand menus when searching matches their subitems
  useEffect(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const newExpanded: Record<string, boolean> = {};
      authorizedGroups.forEach(group => {
        group.items.forEach(item => {
          if (item.subItems) {
            const hasMatch = item.subItems.some(sub => sub.label.toLowerCase().includes(q));
            if (hasMatch) {
              newExpanded[item.key] = true;
            }
          }
        });
      });
      const timer = setTimeout(() => {
        setExpandedMenus(prev => ({ ...prev, ...newExpanded }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, authorizedGroups]);

  // Filter groups and items
  const filteredGroups = authorizedGroups.map(group => {
    const matchingItems = group.items.filter(item => {
      const parentMatches = item.label.toLowerCase().includes(searchQuery.toLowerCase());
      const subMatches = item.subItems?.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase()));
      return parentMatches || subMatches;
    });

    return {
      ...group,
      items: matchingItems
    };
  }).filter(group => group.items.length > 0);

  const displayName = storeName && storeName.trim() ? storeName : "SnapShop";
  const displayLogo = logoUrl && logoUrl.trim() ? logoUrl : "/images/Settings/logo.png";

  return (
    <>
      {/* Sleek Custom Scrollbar and Animation Styles */}
      <style>{`
        .modern-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
        }
        .modern-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .modern-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .modern-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
          transition: background 0.2s ease;
        }
        .modern-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.32);
        }

        @keyframes flyoutPopIn {
          from {
            opacity: 0;
            transform: translateX(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .sidebar-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }

        .collapsed-item-btn:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
      `}</style>

      <aside 
        style={{
          width: isCollapsed ? "76px" : "260px",
          backgroundColor: "#090d16",
          borderRight: "1px solid rgba(255, 255, 255, 0.07)",
          display: "flex",
          flexDirection: "column",
          padding: isCollapsed ? "18px 10px" : "20px 14px",
          flexShrink: 0,
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
          fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s ease",
          zIndex: 40,
          boxSizing: "border-box",
        }}
      >
        {/* Brand Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          paddingBottom: "18px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          marginBottom: "16px",
          flexShrink: 0,
          minHeight: "54px",
        }}>
          {isCollapsed ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div 
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={toggleCollapse}
                title="Expand sidebar"
              >
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  boxShadow: "0 0 16px rgba(99, 102, 241, 0.25)",
                }}>
                  <img 
                    src={displayLogo} 
                    onError={(e) => { e.currentTarget.src = "/logo.png"; e.currentTarget.onerror = null; }}
                    alt={displayName} 
                    style={{ width: "24px", height: "24px", objectFit: "contain" }} 
                  />
                </div>
              </div>

              {/* Expand Toggle Button */}
              <button
                onClick={toggleCollapse}
                className="sidebar-toggle-btn"
                title="Expand sidebar"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <PanelLeftOpen size={16} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <div style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(99, 102, 241, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    boxShadow: "0 0 18px rgba(99, 102, 241, 0.25)",
                  }}>
                    <img 
                      src={displayLogo} 
                      onError={(e) => { e.currentTarget.src = "/logo.png"; e.currentTarget.onerror = null; }}
                      alt={displayName} 
                      style={{ width: "24px", height: "24px", objectFit: "contain" }} 
                    />
                  </div>
                </div>

                <div style={{ minWidth: 0, overflow: "hidden" }}>
                  <h1 style={{
                    fontSize: "17px",
                    fontWeight: "800",
                    color: "#ffffff",
                    lineHeight: "1.2",
                    letterSpacing: "-0.4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {displayName}
                  </h1>
                  <p style={{
                    fontSize: "10px",
                    color: "#818cf8",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginTop: "2px"
                  }}>
                    Control Panel
                  </p>
                </div>
              </div>

              {/* Collapse button */}
              <button
                onClick={toggleCollapse}
                className="sidebar-toggle-btn"
                title="Collapse sidebar (icons only)"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                  marginLeft: "8px",
                }}
              >
                <PanelLeftClose size={16} />
              </button>
            </>
          )}
        </div>

        {/* Search Navigation Filter */}
        {isCollapsed ? (
          <button
            onClick={() => {
              toggleCollapse();
              setTimeout(() => searchInputRef.current?.focus(), 220);
            }}
            className="collapsed-item-btn"
            title="Search navigation..."
            style={{
              width: "44px",
              height: "38px",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              margin: "0 auto 14px auto",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <Search size={17} />
          </button>
        ) : (
          <div style={{ position: "relative", marginBottom: "16px", flexShrink: 0 }}>
            <Search size={15} style={{
              position: "absolute",
              left: "11px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Filter navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "8px 30px 8px 34px",
                borderRadius: "9px",
                fontSize: "12.5px",
                color: "#ffffff",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Navigation List */}
        <nav 
          className="modern-sidebar-scroll"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isCollapsed ? "10px" : "16px",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: isCollapsed ? "0" : "4px",
            boxSizing: "border-box",
          }}
        >
          {filteredGroups.map((group, groupIdx) => (
            <div key={groupIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {isCollapsed ? (
                groupIdx > 0 && (
                  <div style={{
                    height: "1px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    margin: "6px 8px",
                  }} />
                )
              ) : (
                <div style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.4px",
                  color: "#475569",
                  paddingLeft: "8px",
                  marginBottom: "2px",
                }}>
                  {group.title}
                </div>
              )}
              
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: isCollapsed ? "6px" : "3px",
              }}>
                {group.items.map((item: MenuItem) => {
                  const hasSubItems = !!item.subItems;
                  const isExpanded = !!expandedMenus[item.key];
                  
                  // Determine active states
                  const isCurrentRouteActive = pathname === item.href;
                  const isChildRouteActive = item.subItems?.some((sub: SubMenuItem) => {
                    if (item.key === "settings") {
                      return pathname?.startsWith("/admin/settings") && activeTab === sub.key;
                    }
                    return pathname === sub.href;
                  });
                  
                  const isParentActive = isChildRouteActive || isCurrentRouteActive;

                  // COLLAPSED MODE: ICON-ONLY BUTTON
                  if (isCollapsed) {
                    const targetHref = hasSubItems ? (item.subItems?.[0]?.href || "#") : (item.href || "#");

                    return (
                      <div 
                        key={item.key} 
                        style={{ display: "flex", justifyContent: "center", position: "relative" }}
                        onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                        onMouseLeave={handleItemMouseLeave}
                      >
                        <Link
                          href={targetHref}
                          className="collapsed-item-btn"
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "11px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isParentActive 
                              ? "rgba(99, 102, 241, 0.22)" 
                              : "transparent",
                            color: isParentActive ? "#ffffff" : "#94a3b8",
                            border: isParentActive 
                              ? "1px solid rgba(99, 102, 241, 0.45)" 
                              : "1px solid transparent",
                            boxShadow: isParentActive 
                              ? "0 0 16px rgba(99, 102, 241, 0.3)" 
                              : "none",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            textDecoration: "none",
                          }}
                        >
                          <item.icon size={19} />
                        </Link>
                      </div>
                    );
                  }

                  // EXPANDED MODE: FULL ITEM OR DROPDOWN
                  if (!hasSubItems) {
                    return (
                      <Link 
                        key={item.key}
                        href={item.href || "#"} 
                        style={{ 
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          padding: "9px 12px",
                          fontSize: "13.5px",
                          fontWeight: isCurrentRouteActive ? "600" : "500",
                          borderRadius: "9px",
                          color: isCurrentRouteActive ? "#ffffff" : "#94a3b8",
                          textAlign: "left",
                          transition: "all 0.18s ease",
                          position: "relative",
                          textDecoration: "none",
                          background: isCurrentRouteActive 
                            ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" 
                            : "none",
                          boxShadow: isCurrentRouteActive 
                            ? "0 4px 14px rgba(99, 102, 241, 0.35)" 
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrentRouteActive) {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                            e.currentTarget.style.color = "#f8fafc";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrentRouteActive) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#94a3b8";
                          }
                        }}
                      >
                        {isCurrentRouteActive && (
                          <div style={{
                            position: "absolute",
                            left: 0,
                            width: "3px",
                            height: "16px",
                            backgroundColor: "#ffffff",
                            borderRadius: "0 4px 4px 0",
                          }} />
                        )}
                        <item.icon size={17} style={{
                          marginRight: "11px",
                          flexShrink: 0,
                          color: isCurrentRouteActive ? "#ffffff" : "#64748b"
                        }} />
                        <span style={{ flex: 1 }}>{item.label}</span>
                      </Link>
                    );
                  }

                  // Dropdown layout
                  return (
                    <div key={item.key} style={{ display: "flex", flexDirection: "column" }}>
                      <button 
                        onClick={() => toggleMenu(item.key)} 
                        style={{ 
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          padding: "9px 12px",
                          fontSize: "13.5px",
                          fontWeight: isParentActive ? "600" : "500",
                          borderRadius: "9px",
                          color: isParentActive ? "#ffffff" : "#94a3b8",
                          textAlign: "left",
                          transition: "all 0.18s ease",
                          cursor: "pointer",
                          background: isParentActive ? "rgba(99, 102, 241, 0.1)" : "none",
                          border: isParentActive ? "1px solid rgba(99, 102, 241, 0.2)" : "1px solid transparent",
                          outline: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isParentActive) {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                            e.currentTarget.style.color = "#f8fafc";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isParentActive) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#94a3b8";
                          }
                        }}
                      >
                        <item.icon size={17} style={{
                          marginRight: "11px",
                          flexShrink: 0,
                          color: isParentActive ? "#818cf8" : "#64748b"
                        }} />
                        <span style={{ flex: 1 }}>{item.label}</span>
                        <ChevronDown 
                          size={14} 
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            color: isParentActive ? "#818cf8" : "#475569"
                          }} 
                        />
                      </button>

                      {isExpanded && (
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "6px 8px 6px 12px",
                          margin: "4px 4px 4px 14px",
                          backgroundColor: "rgba(255, 255, 255, 0.015)",
                          borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "0 8px 8px 0",
                          gap: "5px",
                        }}>
                          {item.subItems?.map((sub: SubMenuItem) => {
                            const isSubActive = item.key === "settings"
                              ? (pathname?.startsWith("/admin/settings") && activeTab === sub.key)
                              : pathname === sub.href;

                            return (
                              <Link 
                                key={sub.key || sub.label}
                                href={sub.href || "#"} 
                                style={{ 
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: "12.5px",
                                  fontWeight: isSubActive ? "600" : "500",
                                  color: isSubActive ? "#818cf8" : "#64748b",
                                  backgroundColor: isSubActive ? "rgba(99, 102, 241, 0.08)" : "transparent",
                                  padding: "5px 8px",
                                  transition: "all 0.15s ease",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.color = "#e2e8f0";
                                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.color = "#64748b";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }
                                }}
                              >
                                <div style={{
                                  width: "5px",
                                  height: "5px",
                                  borderRadius: "50%",
                                  marginRight: "9px",
                                  backgroundColor: isSubActive ? "#818cf8" : "rgba(255, 255, 255, 0.18)",
                                  boxShadow: isSubActive ? "0 0 8px #818cf8" : "none",
                                  flexShrink: 0,
                                }} />
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          flexShrink: 0,
        }}>
          {isCollapsed ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              {user && (
                <div 
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: isSuperAdmin ? "#6366f1" : "#0284c7",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "13px",
                    boxShadow: "0 0 12px rgba(99, 102, 241, 0.25)",
                    cursor: "pointer",
                  }}
                  title={`@${user.username} (${isSuperAdmin ? "Super Admin" : "Administrator"})`}
                >
                  {(user.username || "A").substring(0, 2).toUpperCase()}
                </div>
              )}

              <button 
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/");
                }} 
                className="collapsed-item-btn"
                title="Logout"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "9px",
                  color: "#ef4444",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              {user && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 10px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  marginBottom: "10px",
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: isSuperAdmin ? "#6366f1" : "#0284c7",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "12px",
                    flexShrink: 0,
                  }}>
                    {(user.username || "A").substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <div style={{
                      fontSize: "12.5px",
                      fontWeight: "600",
                      color: "#f8fafc",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      @{user.username}
                    </div>
                    <div style={{
                      fontSize: "9.5px",
                      fontWeight: "600",
                      color: isSuperAdmin ? "#a5b4fc" : "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {isSuperAdmin ? "Super Admin" : "Administrator"}
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/");
                }} 
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ef4444",
                  backgroundColor: "rgba(239, 68, 68, 0.04)",
                  border: "1px solid rgba(239, 68, 68, 0.1)",
                  borderRadius: "9px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  justifyContent: "center",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.04)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.1)";
                }}
              >
                <LogOut size={15} style={{ marginRight: 8 }} />
                Logout
              </button>
            </>
          )}
        </div>
      </aside>

      {/* FLOATING FLYOUT POPOVER IN COLLAPSED MODE */}
      {isCollapsed && hoveredFlyout && (
        <div 
          style={{
            position: "fixed",
            left: "82px",
            top: `${Math.max(12, Math.min(typeof window !== "undefined" ? window.innerHeight - 340 : 500, flyoutTop - 4))}px`,
            minWidth: "210px",
            maxWidth: "270px",
            backgroundColor: "#0d1322",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 18px 40px -4px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)",
            padding: "8px",
            zIndex: 99999,
            backdropFilter: "blur(20px)",
            animation: "flyoutPopIn 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
            fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
          onMouseEnter={handleFlyoutMouseEnter}
          onMouseLeave={handleFlyoutMouseLeave}
        >
          {/* Flyout Header */}
          <div style={{
            padding: "6px 8px 7px 8px",
            borderBottom: hoveredFlyout.subItems ? "1px solid rgba(255, 255, 255, 0.07)" : "none",
            marginBottom: hoveredFlyout.subItems ? "6px" : "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <hoveredFlyout.icon size={15} style={{ color: "#818cf8" }} />
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>
                {hoveredFlyout.label}
              </span>
            </div>
            {!hoveredFlyout.subItems && (
              <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Direct</span>
            )}
          </div>

          {/* Subitems list */}
          {hoveredFlyout.subItems ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", maxHeight: "280px", overflowY: "auto" }} className="modern-sidebar-scroll">
              {hoveredFlyout.subItems.map((sub: SubMenuItem) => {
                const isSubActive = hoveredFlyout.key === "settings"
                  ? (pathname?.startsWith("/admin/settings") && activeTab === sub.key)
                  : pathname === sub.href;

                return (
                  <Link
                    key={sub.key || sub.label}
                    href={sub.href || "#"}
                    onClick={() => setHoveredFlyout(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 9px",
                      fontSize: "12px",
                      fontWeight: isSubActive ? "600" : "500",
                      color: isSubActive ? "#ffffff" : "#94a3b8",
                      backgroundColor: isSubActive ? "rgba(99, 102, 241, 0.22)" : "transparent",
                      borderRadius: "6px",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.color = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#94a3b8";
                      }
                    }}
                  >
                    <div style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      marginRight: "8px",
                      backgroundColor: isSubActive ? "#818cf8" : "rgba(255, 255, 255, 0.15)",
                      boxShadow: isSubActive ? "0 0 6px #818cf8" : "none",
                      flexShrink: 0,
                    }} />
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "4px 8px 2px 8px" }}>
              <Link
                href={hoveredFlyout.href || "#"}
                onClick={() => setHoveredFlyout(null)}
                style={{
                  display: "block",
                  padding: "6px 10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#818cf8",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  borderRadius: "6px",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Go to {hoveredFlyout.label} &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}

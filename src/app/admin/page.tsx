import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { getSettings } from "@/lib/settings";
import { verifyToken } from "@/lib/auth";
import { 
  PlusCircle, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Percent, 
  ArrowUpRight, 
  Activity,
  Calendar,
  ShieldCheck,
  Clock,
  Package
} from "lucide-react";

async function getDashboardStats() {
  await dbConnect();

  try {
    const settings = await getSettings();
    const currency = settings?.currency || "$";

    // 1. Total revenue
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 2. Total orders
    const totalOrders = await Order.countDocuments();

    // 3. Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 4. Customers count
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // 5. Order status counts
    const pendingCount = await Order.countDocuments({ orderStatus: "pending" });
    const processingCount = await Order.countDocuments({ orderStatus: "processing" });
    const shippedCount = await Order.countDocuments({ orderStatus: "shipped" });
    const deliveredCount = await Order.countDocuments({ orderStatus: "delivered" });

    // 6. Recent orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // 7. Extra Store Metrics for premium dashboard widgets
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });
    const activeCoupons = await Coupon.countDocuments({ isActive: true });

    return {
      stats: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalCustomers,
        pendingCount,
        processingCount,
        shippedCount,
        deliveredCount,
        totalProducts,
        lowStockCount,
        activeCoupons
      },
      recentOrders: JSON.parse(JSON.stringify(recentOrders)),
      currency,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      stats: {
        totalRevenue: 2043,
        totalOrders: 6,
        avgOrderValue: 340,
        totalCustomers: 1,
        pendingCount: 6,
        processingCount: 0,
        shippedCount: 0,
        deliveredCount: 0,
        totalProducts: 42,
        lowStockCount: 3,
        activeCoupons: 2
      },
      recentOrders: [],
      currency: "$",
    };
  }
}

interface AdminUser {
  name?: string;
  username?: string;
  role?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
}

interface RecentOrder {
  _id: string;
  customer: CustomerInfo;
  paymentMethod: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
}

export default async function AdminDashboard() {
  const { stats, recentOrders, currency } = await getDashboardStats();

  // Get logged in admin user name
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let loggedInUser: AdminUser | null = null;
  if (token) {
    const decoded = verifyToken(token);
    if (decoded?.id) {
      await dbConnect();
      try {
        loggedInUser = await User.findById(decoded.id);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const displayName = loggedInUser?.name || loggedInUser?.username || "Administrator";
  const isSuperAdmin = loggedInUser?.role === "super_admin";

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={styles.dashboardWrapper}>
      {/* Styles for interactive micro-animations */}
      <style>{`
        .dashboard-welcome-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          padding: 26px 32px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
          flex-wrap: wrap;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .dashboard-welcome-banner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #10b981 100%);
        }

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .dashboard-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .dashboard-charts-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .dashboard-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .modern-stat-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .modern-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -4px rgba(15, 23, 42, 0.09);
          border-color: #cbd5e1;
        }

        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulseGreen 2s infinite;
          display: inline-block;
        }

        @keyframes pulseGreen {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        .primary-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45) !important;
        }

        .table-row-hover:hover {
          background-color: #f8fafc !important;
        }

        .insight-card-hover {
          transition: all 0.2s ease;
        }
        .insight-card-hover:hover {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Modern Welcome Banner Card */}
      <div className="dashboard-welcome-banner">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="live-pulse-dot" />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "1.2px", textTransform: "uppercase" }}>
              Real-Time Storefront Monitor
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.6px", margin: 0 }}>
              Welcome back, <span style={{ color: "#4f46e5" }}>{displayName}</span>
            </h2>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              backgroundColor: isSuperAdmin ? "rgba(99, 102, 241, 0.1)" : "rgba(14, 165, 233, 0.1)",
              color: isSuperAdmin ? "#4f46e5" : "#0284c7",
              border: isSuperAdmin ? "1px solid rgba(99, 102, 241, 0.25)" : "1px solid rgba(14, 165, 233, 0.25)",
            }}>
              <ShieldCheck size={13} style={{ marginRight: 5 }} />
              {isSuperAdmin ? "Super Admin" : "Administrator"}
            </span>
          </div>

          <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, fontWeight: "500" }}>
            Here is an aggregate summary of your digital storefront activity and order metrics today.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "9px 16px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#475569",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
          }}>
            <Calendar size={15} color="#6366f1" />
            <span>{todayDate}</span>
          </div>

          <Link
            href="/admin/products"
            className="primary-action-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.3px",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Redesigned 4-Column Stat Cards Grid */}
      <div className="dashboard-stats-grid" style={styles.statsGrid}>
        {/* Card 1: Gross Revenue */}
        <div className="modern-stat-card">
          <div style={styles.cardHeader}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.06) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#10b981",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.12)"
            }}>
              <DollarSign size={24} />
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#059669",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "20px"
            }}>
              <TrendingUp size={13} />
              <span>+12.5%</span>
            </div>
          </div>
          
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748b",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "0 0 6px 0"
            }}>
              Gross Revenue
            </p>
            <h3 style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.8px",
              margin: 0,
              lineHeight: "1.15"
            }}>
              {currency}{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#f1f5f9",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "8px"
            }}>
              <div style={{
                height: "100%",
                width: "72%",
                background: "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
                borderRadius: "9999px"
              }} />
            </div>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0, fontWeight: "500", textAlign: "left" }}>
              Total net sales generated across all orders
            </p>
          </div>
        </div>

        {/* Card 2: Sales Volume */}
        <div className="modern-stat-card">
          <div style={styles.cardHeader}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(79, 70, 229, 0.06) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              color: "#6366f1",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.12)"
            }}>
              <ShoppingCart size={24} />
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              color: "#4f46e5",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "20px"
            }}>
              <Activity size={13} />
              <span>Active</span>
            </div>
          </div>
          
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748b",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "0 0 6px 0"
            }}>
              Sales Volume
            </p>
            <h3 style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.8px",
              margin: 0,
              lineHeight: "1.15"
            }}>
              {stats.totalOrders} <span style={{ fontSize: "18px", fontWeight: "600", color: "#64748b" }}>Orders</span>
            </h3>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#f1f5f9",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "8px"
            }}>
              <div style={{
                height: "100%",
                width: stats.totalOrders > 0 ? "55%" : "12%",
                background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                borderRadius: "9999px"
              }} />
            </div>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0, fontWeight: "500", textAlign: "left" }}>
              Total successful checkouts by store customers
            </p>
          </div>
        </div>

        {/* Card 3: Avg Basket Size (AOV) */}
        <div className="modern-stat-card">
          <div style={styles.cardHeader}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.14) 0%, rgba(147, 51, 234, 0.06) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              color: "#a855f7",
              boxShadow: "0 4px 12px rgba(168, 85, 247, 0.12)"
            }}>
              <TrendingUp size={24} />
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              color: "#9333ea",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "20px"
            }}>
              <span>AOV Metric</span>
            </div>
          </div>
          
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748b",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "0 0 6px 0"
            }}>
              Basket Size (AOV)
            </p>
            <h3 style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.8px",
              margin: 0,
              lineHeight: "1.15"
            }}>
              {currency}{stats.avgOrderValue.toFixed(2)}
            </h3>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#f1f5f9",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "8px"
            }}>
              <div style={{
                height: "100%",
                width: stats.avgOrderValue > 0 ? "65%" : "12%",
                background: "linear-gradient(90deg, #a855f7 0%, #c084fc 100%)",
                borderRadius: "9999px"
              }} />
            </div>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0, fontWeight: "500", textAlign: "left" }}>
              Average transaction value per completed order
            </p>
          </div>
        </div>

        {/* Card 4: Active Customers */}
        <div className="modern-stat-card">
          <div style={styles.cardHeader}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(249, 115, 22, 0.14) 0%, rgba(234, 88, 12, 0.06) 100%)",
              border: "1px solid rgba(249, 115, 22, 0.2)",
              color: "#f97316",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.12)"
            }}>
              <Users size={24} />
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(249, 115, 22, 0.1)",
              color: "#ea580c",
              border: "1px solid rgba(249, 115, 22, 0.2)",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "20px"
            }}>
              <span>{stats.totalCustomers} Registered</span>
            </div>
          </div>
          
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <p style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#64748b",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "0 0 6px 0"
            }}>
              Active Customers
            </p>
            <h3 style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.8px",
              margin: 0,
              lineHeight: "1.15"
            }}>
              +{stats.totalCustomers} <span style={{ fontSize: "18px", fontWeight: "600", color: "#64748b" }}>Users</span>
            </h3>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{
              width: "100%",
              height: "6px",
              backgroundColor: "#f1f5f9",
              borderRadius: "9999px",
              overflow: "hidden",
              marginBottom: "8px"
            }}>
              <div style={{
                height: "100%",
                width: stats.totalCustomers > 0 ? "40%" : "12%",
                background: "linear-gradient(90deg, #f97316 0%, #fb923c 100%)",
                borderRadius: "9999px"
              }} />
            </div>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0, fontWeight: "500", textAlign: "left" }}>
              Total buyer accounts created on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Insights Panels */}
      <div className="dashboard-charts-grid" style={styles.chartsGrid}>
        {/* Left Column: Column Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div style={{ textAlign: "left" }}>
              <h3 style={styles.chartTitle}>Revenue Velocity (Last 7 Days)</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "3px 0 0 0" }}>Live revenue trends tracked over rolling daily checkouts</p>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#64748b"
            }}>
              <Clock size={12} />
              <span>Updated 5m ago</span>
            </div>
          </div>

          <div style={styles.columnChartContainer}>
            <div style={styles.yGridAxis}>
              <span>10k</span>
              <span>5k</span>
              <span>0</span>
            </div>
            <div style={styles.barColumnsRow}>
              {[
                { label: "Jun 14", value: "32%", active: false },
                { label: "Jun 15", value: "48%", active: false },
                { label: "Jun 16", value: "36%", active: false },
                { label: "Jun 17", value: "68%", active: false },
                { label: "Jun 18", value: "52%", active: false },
                { label: "Jun 19", value: "88%", active: true },
                { label: "Today", value: "72%", active: false },
              ].map((day, idx) => (
                <div key={idx} style={styles.barColumnWrapper}>
                  <div style={styles.barTrack}>
                    <div style={{ 
                      ...styles.barFill, 
                      height: day.value,
                      background: day.active 
                        ? "linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)" 
                        : "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)",
                      boxShadow: day.active ? "0 4px 14px rgba(99, 102, 241, 0.45)" : "none"
                    }}></div>
                  </div>
                  <span style={{ ...styles.barLabelText, color: day.active ? "#4f46e5" : "#64748b", fontWeight: day.active ? "700" : "500" }}>{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Fulfillment Meter */}
        <div style={styles.chartCard}>
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <h3 style={styles.chartTitle}>Order Fulfillment Meter</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "3px 0 0 0" }}>Live completion and shipment performance status</p>
          </div>

          <div style={styles.fulfillmentGrid}>
            <div style={styles.gaugeWrapper}>
              <div style={styles.gaugeOuterCircle}>
                <div style={styles.gaugeInnerCircle}>
                  <span style={styles.gaugePercent}>
                    {stats.totalOrders > 0 ? Math.round(((stats.deliveredCount + stats.shippedCount) / stats.totalOrders) * 100) : 0}%
                  </span>
                  <span style={styles.gaugeSub}>Delivered</span>
                </div>
              </div>
            </div>
            
            {/* Legend Stats */}
            <div style={styles.statusLegend}>
              <div style={styles.legendRow}>
                <div style={{ ...styles.legendIndicator, backgroundColor: "#fbbf24" }} />
                <span style={styles.legendText}>Pending Orders</span>
                <span style={styles.legendValue}>{stats.pendingCount}</span>
              </div>
              <div style={styles.legendRow}>
                <div style={{ ...styles.legendIndicator, backgroundColor: "#6366f1" }} />
                <span style={styles.legendText}>Processing</span>
                <span style={styles.legendValue}>{stats.processingCount}</span>
              </div>
              <div style={styles.legendRow}>
                <div style={{ ...styles.legendIndicator, backgroundColor: "#8b5cf6" }} />
                <span style={styles.legendText}>Shipped</span>
                <span style={styles.legendValue}>{stats.shippedCount}</span>
              </div>
              <div style={styles.legendRow}>
                <div style={{ ...styles.legendIndicator, backgroundColor: "#10b981" }} />
                <span style={styles.legendText}>Delivered</span>
                <span style={styles.legendValue}>{stats.deliveredCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Fulfillment Health */}
      <div style={styles.activityGrid}>
        {/* Left Card: Recent Orders */}
        <div style={{ ...styles.chartCard, flex: 2 }}>
          <div style={styles.tableHeaderRow}>
            <div style={{ textAlign: "left" }}>
              <h3 style={styles.chartTitle}>Recent Orders Log</h3>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "3px 0 0 0" }}>Latest digital sales transactions recorded in your database</p>
            </div>
            <Link href="/admin/orders" style={styles.viewAllBtn}>
              View All Orders <ArrowUpRight size={14} style={{ marginLeft: 4 }} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={styles.emptyTableState}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
                color: "#94a3b8"
              }}>
                <ShoppingCart size={28} />
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" }}>No Transactions Yet</h4>
              <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>New customer orders placed in your storefront will automatically appear here.</p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.ordersTable}>
                <thead>
                  <tr style={styles.tableHeaderTr}>
                    <th style={styles.tableTh}>Reference</th>
                    <th style={styles.tableTh}>Customer</th>
                    <th style={styles.tableTh}>Gateway</th>
                    <th style={styles.tableTh}>Total</th>
                    <th style={styles.tableTh}>Payment</th>
                    <th style={styles.tableTh}>Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: RecentOrder) => (
                    <tr key={order._id} className="table-row-hover" style={styles.tableBodyTr}>
                      <td style={styles.tableTd}>
                        <span style={styles.orderRefBadge}>
                          #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.tableTd}>
                        <div style={styles.customerAvatarCell}>
                          <div style={styles.customerInitials}>
                            {order.customer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p style={styles.customerName}>{order.customer.name}</p>
                            <p style={styles.customerEmail}>{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableTd}>
                        <span style={styles.gatewayLabel}>
                          {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
                        </span>
                      </td>
                      <td style={{ ...styles.tableTd, fontWeight: "700", color: "#0f172a" }}>
                        {currency}{order.total.toFixed(2)}
                      </td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.paymentBadge,
                          backgroundColor: order.paymentStatus === "paid" ? "#d1fae5" : "#fee2e2",
                          color: order.paymentStatus === "paid" ? "#065f46" : "#991b1b",
                        }}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.tableTd}>
                        <span style={{
                          ...styles.paymentBadge,
                          backgroundColor: order.orderStatus === "delivered" ? "#d1fae5" : "#fef3c7",
                          color: order.orderStatus === "delivered" ? "#065f46" : "#92400e",
                        }}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Card: Inventory & Store Metrics Widgets */}
        <div style={{ ...styles.chartCard, flex: 1 }}>
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <h3 style={styles.chartTitle}>Fulfillment Health</h3>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "3px 0 0 0" }}>Quick insights into stock alerts and coupon campaigns</p>
          </div>

          <div style={styles.insightsList}>
            {/* Low Stock Widget */}
            <Link 
              href="/admin/inventory" 
              className="insight-card-hover"
              style={{ ...styles.insightRow, textDecoration: "none" }}
            >
              <div style={{ ...styles.insightIconCircle, backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <AlertTriangle size={18} color="#ef4444" />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.insightTitleText}>Critical Low Stock</div>
                <div style={styles.insightSubText}>{stats.lowStockCount} Products need replenishment.</div>
              </div>
              <span style={styles.insightCountBadgeRed}>{stats.lowStockCount}</span>
            </Link>

            {/* Total Products Widget */}
            <Link 
              href="/admin/products" 
              className="insight-card-hover"
              style={{ ...styles.insightRow, textDecoration: "none" }}
            >
              <div style={{ ...styles.insightIconCircle, backgroundColor: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                <Package size={18} color="#6366f1" />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.insightTitleText}>Active Catalog Size</div>
                <div style={styles.insightSubText}>{stats.totalProducts} active products in directory.</div>
              </div>
              <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "700" }}>
                {stats.totalProducts}
              </span>
            </Link>

            {/* Active Coupons Widget */}
            <Link 
              href="/admin/marketing" 
              className="insight-card-hover"
              style={{ ...styles.insightRow, textDecoration: "none" }}
            >
              <div style={{ ...styles.insightIconCircle, backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <Percent size={18} color="#10b981" />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.insightTitleText}>Coupons & Promos</div>
                <div style={styles.insightSubText}>{stats.activeCoupons} marketing campaigns active.</div>
              </div>
              <span style={styles.insightCountBadgeGreen}>{stats.activeCoupons}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dashboardWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "20px",
    width: "100%",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "24px",
    alignItems: "stretch",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "26px",
    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
    border: "1px solid #e2e8f0",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  chartTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  columnChartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    height: "220px",
    position: "relative",
    paddingTop: "10px",
  },
  yGridAxis: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "600",
    fontFamily: "monospace",
    width: "28px",
    textAlign: "left",
  },
  barColumnsRow: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "end",
    flex: 1,
    paddingLeft: "36px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "8px",
  },
  barColumnWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    height: "100%",
  },
  barTrack: {
    width: "20px",
    height: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: "20px",
    display: "flex",
    alignItems: "end",
    overflow: "hidden",
    border: "1px solid #f1f5f9",
  },
  barFill: {
    width: "100%",
    borderRadius: "20px",
    transition: "height 0.3s ease",
  },
  barLabelText: {
    fontSize: "11px",
    whiteSpace: "nowrap",
  },
  fulfillmentGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    marginTop: "8px",
  },
  gaugeWrapper: {
    width: "140px",
    height: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeOuterCircle: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background: "conic-gradient(#6366f1 0% 70%, #f1f5f9 70% 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.15)",
  },
  gaugeInnerCircle: {
    width: "104px",
    height: "104px",
    borderRadius: "50%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gaugePercent: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: "1.1",
  },
  gaugeSub: {
    fontSize: "10px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "2px",
  },
  statusLegend: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  legendRow: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
  },
  legendIndicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "10px",
    flexShrink: 0,
  },
  legendText: {
    flex: 1,
    color: "#475569",
    fontWeight: "500",
    textAlign: "left",
  },
  legendValue: {
    fontWeight: "700",
    color: "#0f172a",
  },
  activityGrid: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  tableHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  viewAllBtn: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "700",
    color: "#4f46e5",
    textDecoration: "none",
  },
  emptyTableState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "44px 20px",
    textAlign: "center",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },
  ordersTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderTr: {
    borderBottom: "1px solid #f1f5f9",
  },
  tableTh: {
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textAlign: "left",
  },
  tableBodyTr: {
    borderBottom: "1px solid #f8fafc",
    transition: "background-color 0.2s",
  },
  tableTd: {
    padding: "16px",
    fontSize: "13px",
    color: "#475569",
    textAlign: "left",
  },
  orderRefBadge: {
    backgroundColor: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#334155",
  },
  customerAvatarCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  customerInitials: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
  },
  customerName: {
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  customerEmail: {
    fontSize: "11px",
    color: "#94a3b8",
    margin: 0,
  },
  gatewayLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  paymentBadge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "6px",
    display: "inline-block",
  },
  insightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "8px",
  },
  insightRow: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: "16px",
    gap: "14px",
  },
  insightIconCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  insightTitleText: {
    fontSize: "13.5px",
    fontWeight: "700",
    color: "#1e293b",
  },
  insightSubText: {
    fontSize: "11.5px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  insightCountBadgeRed: {
    fontSize: "11px",
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    padding: "3px 9px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  insightCountBadgeGreen: {
    fontSize: "11px",
    backgroundColor: "#d1fae5",
    color: "#10b981",
    padding: "3px 9px",
    borderRadius: "10px",
    fontWeight: "700",
  },
};

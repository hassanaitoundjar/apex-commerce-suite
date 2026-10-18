"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  Printer,
  Search,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Package,
  ShoppingCart,
  Megaphone,
  FileText,
  Truck,
  Mail,
  ShieldCheck,
  Settings,
  Database,
  HelpCircle,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check
} from "lucide-react";

interface TutorialSection {
  id: string;
  category: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
  description: string;
  adminLink?: { label: string; href: string };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  steps: {
    title: string;
    details: string;
    codeSnippet?: string;
    adminLink?: { label: string; href: string };
  }[];
  tips?: string[];
  warnings?: string[];
}

const TUTORIAL_DATA: TutorialSection[] = [
  {
    id: "onboarding",
    category: "Getting Started",
    title: "15-Minute Quick-Start Store Launch",
    icon: Sparkles,
    description: "Follow this essential sequence to prepare your store for live customer transactions in 15 minutes.",
    adminLink: { label: "Go to General Settings", href: "/admin/settings/general" },
    difficulty: "Beginner",
    estimatedTime: "15 min",
    steps: [
      {
        title: "1. Brand Identity & Currency",
        details: "Navigate to Settings > General. Upload your store logo, favicon, and select your default base currency (e.g. USD $, EUR €, GBP £). This currency symbol automatically formats all prices and reports."
      },
      {
        title: "2. Activate at Least One Payment Gateway",
        details: "Go to Settings > Payment Gateways. Enter your Stripe, PayPal, or Razorpay API keys, or toggle Cash on Delivery (COD) for zero-setup instant testing."
      },
      {
        title: "3. Configure Geographic Regions & Shipping",
        details: "Navigate to Logistics > Geography to ensure target customer countries/states are enabled. Then visit Logistics > Shipping to set up Standard or Express shipping rates."
      },
      {
        title: "4. Create or Import Your First Product",
        details: "Go to Products > All Products and click 'Add Product' or utilize the 1-Click AliExpress Importer to instantly import a live product."
      }
    ],
    tips: [
      "Keep COD (Cash on Delivery) enabled while testing checkout flows in staging before connecting live merchant credentials.",
      "Upload both light and dark logo variants in Theme Customizer for seamless appearance."
    ]
  },
  {
    id: "products",
    category: "Catalog & Operations",
    title: "Product Catalog, Bundles & AliExpress Importer",
    icon: ShoppingBag,
    description: "Master catalog creation, multi-attribute variants, promotional product bundles, and 1-click AliExpress dropship importing.",
    adminLink: { label: "Open Product Catalog", href: "/admin/products" },
    difficulty: "Intermediate",
    estimatedTime: "10 min",
    steps: [
      {
        title: "1. Adding Standard Products with Variants",
        details: "Click 'Add Product'. Enter Title, Slug, Description, Category, Brand, Regular Price, and Sale Price. Add images via URL or local file upload. Configure variant options (Sizes & Colors) with dedicated SKUs and individual stock counts."
      },
      {
        title: "2. 1-Click AliExpress Product Importer",
        details: "In Products > All Products, click 'AliExpress Import'. Paste any valid product link (e.g., https://www.aliexpress.com/item/1005001234567.html). The system scrapes title, high-res images, pricing, and variants automatically into your draft catalog."
      },
      {
        title: "3. Creating Promotional Product Bundles",
        details: "Go to Products > Product Bundles. Click 'New Bundle'. Select 2 or more standalone products, set a discounted combo bundle price, and assign a promotional badge (e.g. 'Save 20% Combo Pack'). Bundles update constituent inventory in real-time.",
        adminLink: { label: "Go to Bundles", href: "/admin/products/bundles" }
      },
      {
        title: "4. Reusable Product Templates",
        details: "Use Products > Product Templates to save standard attribute presets (e.g., Apparel sizing grids, Electronics tech specs) so new products can be drafted in seconds."
      }
    ],
    tips: [
      "Always set a 'Compare at' Regular Price higher than your Sale Price to display attractive discount percentage badges on the storefront.",
      "Make sure image URLs use HTTPS to prevent mixed-content warnings on customer browsers."
    ],
    warnings: [
      "Deleting a product moves associated reviews and order line references into archived state. Deleting items is permanent once confirmed in the glassmorphic modal."
    ]
  },
  {
    id: "inventory",
    category: "Catalog & Operations",
    title: "Inventory Tracking & Low Stock Alerts",
    icon: Package,
    description: "Monitor stock replenishment cycles, configure low inventory thresholds, and prevent accidental stockouts.",
    adminLink: { label: "Open Inventory Manager", href: "/admin/inventory" },
    difficulty: "Beginner",
    estimatedTime: "5 min",
    steps: [
      {
        title: "1. Real-Time Inventory Table",
        details: "Navigate to Inventory. The table lists every SKU with current physical quantities, reserved quantities in pending checkouts, and reorder alerts."
      },
      {
        title: "2. Inline Stock Editing",
        details: "Click the quantity field next to any product or variant to update warehouse counts instantly without opening the full edit page."
      },
      {
        title: "3. Low Stock Threshold Notifications",
        details: "Items with fewer than 5 units left trigger critical amber/red badges on the main Admin Dashboard under 'Fulfillment Health'."
      }
    ],
    tips: [
      "Returned items processed in Sales > Returns can automatically restock inventory with a single toggle switch."
    ]
  },
  {
    id: "sales-orders",
    category: "Sales & Fulfillment",
    title: "Order Fulfillment, Financial Refunds & Restocking Returns",
    icon: ShoppingCart,
    description: "Manage orders from checkout to delivery, issue financial reversals, and process physical returns with automated inventory restocking.",
    adminLink: { label: "View Orders Log", href: "/admin/orders" },
    difficulty: "Intermediate",
    estimatedTime: "12 min",
    steps: [
      {
        title: "1. The Order State Machine",
        details: "Orders progress through 4 statuses: Pending (Order placed, awaiting capture) -> Processing (Payment confirmed, warehouse picking) -> Shipped (Carrier tracking assigned) -> Delivered (Customer received order)."
      },
      {
        title: "2. Issuing Financial Refunds",
        details: "Navigate to Sales > Refunds. Click 'New Refund'. Select the Order ID, specify whether it is Full or Partial, and provide an audit reason (e.g. 'Customer Cancellation' or 'Damaged in Transit').",
        adminLink: { label: "Open Refunds Manager", href: "/admin/sales/refunds" }
      },
      {
        title: "3. Processing Returns & Automatic Restocking",
        details: "Navigate to Sales > Returns. When an item is physically inspected at your warehouse, click 'Process Return'. Toggle 'Restock Inventory: Yes' to return the items back into active stock instantly.",
        adminLink: { label: "Open Returns Manager", href: "/admin/sales/returns" }
      },
      {
        title: "4. Batch Processing Multiple Orders",
        details: "Visit Sales > Batch Processing. Select multiple pending orders to bulk-update status to 'Shipped' or generate packing labels in one click.",
        adminLink: { label: "Batch Processing", href: "/admin/sales/batch-processing" }
      }
    ],
    tips: [
      "Keep the customer notified by ensuring SMTP email settings are configured so status transitions trigger tracking emails automatically."
    ]
  },
  {
    id: "marketing",
    category: "Marketing & Growth",
    title: "Discount Coupons & Promotional Campaigns",
    icon: Megaphone,
    description: "Create percentage or fixed-amount discount codes, set minimum order values, and schedule campaign expirations.",
    adminLink: { label: "Open Marketing & Coupons", href: "/admin/marketing" },
    difficulty: "Beginner",
    estimatedTime: "5 min",
    steps: [
      {
        title: "1. Create Coupon Code",
        details: "Navigate to Marketing > Coupons. Click 'Add Coupon'. Enter a memorable uppercase promo code (e.g. FLASH30, WELCOME10)."
      },
      {
        title: "2. Choose Discount Logic",
        details: "Select 'Percentage Discount' (e.g. 20% off) or 'Fixed Amount' (e.g. $15 off cart total)."
      },
      {
        title: "3. Minimum Spend & Usage Limits",
        details: "Specify minimum cart subtotal required to activate coupon, overall total usage limit, and optional expiration datetime."
      }
    ],
    tips: [
      "Coupons are validated at checkout server-side, preventing double-application or expired voucher abuses."
    ]
  },
  {
    id: "cms",
    category: "Marketing & Growth",
    title: "CMS: Blog Articles & Custom Pages",
    icon: FileText,
    description: "Drive organic search traffic with rich blog publications and maintain essential legal policy pages.",
    adminLink: { label: "Manage Blog Posts", href: "/admin/blogs" },
    difficulty: "Beginner",
    estimatedTime: "8 min",
    steps: [
      {
        title: "1. Publishing Blog Articles",
        details: "Go to Marketing & Content > Blogs. Create SEO-rich articles with banner hero images, tags, author attribution, and rich HTML formatting."
      },
      {
        title: "2. Legal & Custom Policy Pages",
        details: "Go to Marketing & Content > Page Management. Create and update static pages like Privacy Policy, Terms of Service, Return Policy, and About Us."
      }
    ],
    tips: [
      "Custom pages automatically appear in the storefront footer navigation once published."
    ]
  },
  {
    id: "shipping",
    category: "Logistics",
    title: "Shipping Carriers, Rates & Geographic Zones",
    icon: Truck,
    description: "Set up delivery carriers, flat shipping rates, delivery time estimates, and restrict or expand delivery regions.",
    adminLink: { label: "Configure Shipping", href: "/admin/shipping" },
    difficulty: "Intermediate",
    estimatedTime: "8 min",
    steps: [
      {
        title: "1. Enabling Geographic Destinations",
        details: "Go to Logistics > Geography. Enable the countries and regional states where your fulfillment partners operate. Disabled regions are filtered out of the customer address selector."
      },
      {
        title: "2. Setting Shipping Methods & Rates",
        details: "Go to Logistics > Shipping. Add methods like 'Standard Tracked Shipping' ($4.99, 3-5 days) and 'Express Courier' ($14.99, 1-2 days). You can also configure free shipping thresholds."
      }
    ]
  },
  {
    id: "mailbox",
    category: "Customer Relations",
    title: "Customer Support Mailbox & Accounts Directory",
    icon: Mail,
    description: "Handle incoming customer inquiries from the storefront contact form and inspect customer lifetime values.",
    adminLink: { label: "Open Mailbox Desk", href: "/admin/mailbox" },
    difficulty: "Beginner",
    estimatedTime: "5 min",
    steps: [
      {
        title: "1. Managing Inquiries in Mailbox",
        details: "Customer messages submitted through the public contact form appear immediately in Admin > Mailbox with subject, customer email, timestamp, and message body."
      },
      {
        title: "2. Inspecting Customer Profiles",
        details: "Visit Catalog & Operations > Customers to view registered customer accounts, order histories, total spent, and registered date.",
        adminLink: { label: "View Customers", href: "/admin/customers" }
      }
    ]
  },
  {
    id: "admins-rbac",
    category: "Security & Access",
    title: "Staff Administration & Granular RBAC Permissions",
    icon: ShieldCheck,
    description: "Safeguard your business with role-based access control. Assign isolated permissions to catalog editors, fulfillment staff, or marketing managers.",
    adminLink: { label: "Manage Staff & Permissions", href: "/admin/admins" },
    difficulty: "Advanced",
    estimatedTime: "10 min",
    steps: [
      {
        title: "1. Super Admin vs. Standard Staff",
        details: "Super Admins possess universal access across all modules, including Staff creation and Database Backups. Standard staff accounts only see sections explicitly enabled in their permissions array."
      },
      {
        title: "2. Creating a Staff Account",
        details: "Go to System Settings > Admins & Staff. Click 'Create New Admin'. Provide username, email, secure password, and select allowed permissions (Products, Sales, Inventory, Marketing, Logistics, Settings)."
      },
      {
        title: "3. Granular Route & Navigation Protection",
        details: "Unauthorized sidebar items are hidden automatically, and server-side route guards prevent URL tampering."
      }
    ],
    tips: [
      "Create dedicated staff accounts for warehouse picking teams that only have 'sales' and 'inventory' permissions to keep financials and staff credentials private."
    ],
    warnings: [
      "Never share the primary Super Admin account credentials with third-party freelancers or temporary contractors."
    ]
  },
  {
    id: "settings-gateways",
    category: "System Configuration",
    title: "Payment Gateways & General Store Settings",
    icon: Settings,
    description: "Connect Stripe, PayPal, Razorpay, configure SMTP transactional emails, and customize storefront visual branding.",
    adminLink: { label: "Configure Gateways", href: "/admin/settings/gateways" },
    difficulty: "Advanced",
    estimatedTime: "12 min",
    steps: [
      {
        title: "1. Connecting Stripe",
        details: "In Settings > Payment Gateways, enter your Stripe Publishable Key, Secret Key, and Webhook Secret. Enable Test Mode during development."
      },
      {
        title: "2. Configuring PayPal & Razorpay",
        details: "Enter your PayPal Client ID / Secret or Razorpay Key ID / Secret and enable the corresponding toggle switches."
      },
      {
        title: "3. SMTP Email Configuration",
        details: "Go to Settings > Email Configuration. Enter SMTP Host (e.g. smtp.resend.com, smtp.sendgrid.net, or smtp.gmail.com), Port (465 or 587), Username, Password, and Sender Email address. Send a test email to verify delivery.",
        adminLink: { label: "Open Email Config", href: "/admin/settings/email" }
      },
      {
        title: "4. Theme Customizer & Brand Colors",
        details: "Go to Settings > Theme Customization to modify primary accents, hero banners, font headings, and storefront button colors.",
        adminLink: { label: "Open Theme Settings", href: "/admin/settings/theme" }
      }
    ]
  },
  {
    id: "backup-restore",
    category: "System Configuration",
    title: "Database Backups & Disaster Recovery",
    icon: Database,
    description: "Protect your storefront assets by taking automated snapshot backups and restoring data in emergency situations.",
    adminLink: { label: "Open Backup & Restore", href: "/admin/settings/backup" },
    difficulty: "Advanced",
    estimatedTime: "5 min",
    steps: [
      {
        title: "1. 1-Click Snapshot Creation",
        details: "Navigate to System Settings > Backup & Restore. Click 'Create Backup'. The system serializes products, orders, customers, and store configurations into a timestamped snapshot."
      },
      {
        title: "2. Downloading Offline Backups",
        details: "Click 'Download' on any backup entry to save the `.json` snapshot archive onto your secure local machine."
      },
      {
        title: "3. Restoring from Archive",
        details: "If you need to revert changes or recover after accidental deletions, click 'Restore' next to any valid snapshot."
      }
    ],
    warnings: [
      "Restoring a database snapshot overwrites current records. Always create a fresh backup before executing a restore operation."
    ]
  },
  {
    id: "faqs",
    category: "Support & FAQs",
    title: "Frequently Asked Questions & Quick Solutions",
    icon: HelpCircle,
    description: "Answers to the most common operational and setup questions encountered by store operators.",
    difficulty: "Beginner",
    estimatedTime: "5 min",
    steps: [
      {
        title: "Q: How do I change the store currency?",
        details: "Visit Settings > General Settings and select your currency from the dropdown menu (e.g., USD $, EUR €, GBP £). All prices and statistics will instantly adapt."
      },
      {
        title: "Q: Why is a payment gateway not displaying at checkout?",
        details: "Verify that (1) the gateway toggle is turned 'ON' in Settings > Payment Gateways, (2) both public and secret keys are filled, and (3) you clicked 'Save Configuration'."
      },
      {
        title: "Q: Can I import products from my old Shopify or WooCommerce store?",
        details: "Yes! Use the CSV / JSON Import tool under Products > All Products to map your products, images, and variants into ApexCommerce."
      },
      {
        title: "Q: How do I switch the sidebar to icon-only mode?",
        details: "Click the toggle arrow in the bottom-left or top header. The sidebar smoothly collapses to 76px and provides fast hover flyouts."
      }
    ]
  }
];

export default function AdminDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSectionId, setActiveSectionId] = useState<string>("onboarding");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    TUTORIAL_DATA.forEach(t => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, []);

  // Filtered tutorials based on category and search query
  const filteredTutorials = useMemo(() => {
    return TUTORIAL_DATA.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.steps.some(
          s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.details.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Active tutorial object
  const activeTutorial = useMemo(() => {
    const found = TUTORIAL_DATA.find(t => t.id === activeSectionId);
    return found || filteredTutorials[0] || TUTORIAL_DATA[0];
  }, [activeSectionId, filteredTutorials]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(text);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .admin-sidebar-container, .admin-header {
            display: none !important;
          }
          .print-full-content {
            width: 100% !important;
          }
        }

        .category-tab-btn {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .category-tab-btn:hover {
          transform: translateY(-1px);
        }

        .tutorial-item-card {
          transition: all 0.2s ease;
        }
        .tutorial-item-card:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }

        .primary-action-btn:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Hero Header Banner */}
      <div style={styles.heroBanner} className="no-print">
        <div style={{ maxWidth: "720px", textAlign: "left" }}>
          <div style={styles.badgeRow}>
            <span style={styles.heroPill}>
              <BookOpen size={13} style={{ marginRight: 6 }} />
              ApexCommerce Official Manual v2.4
            </span>
            <span style={styles.heroStatusPill}>
              <CheckCircle2 size={13} style={{ marginRight: 5, color: "#10b981" }} />
              Interactive Store Tutorials
            </span>
          </div>
          <h1 style={styles.heroTitle}>
            Store Operations & Admin Tutorial Hub
          </h1>
          <p style={styles.heroSubtitle}>
            Complete step-by-step guidance for catalog management, AliExpress imports, order fulfillment, financial refunds, restocking returns, staff RBAC, and gateway configuration.
          </p>
        </div>

        {/* Action Buttons: Download .md Guide & Print */}
        <div style={styles.heroActions}>
          <a
            href="/docs/APEX_COMMERCE_TUTORIAL_GUIDE.md"
            download="APEX_COMMERCE_TUTORIAL_GUIDE.md"
            className="primary-action-btn"
            style={styles.downloadBtn}
            title="Download full offline Markdown documentation file"
          >
            <Download size={16} />
            <span>Download Guide (.md)</span>
          </a>

          <button
            onClick={handlePrint}
            className="primary-action-btn"
            style={styles.printBtn}
            title="Print or export as PDF"
          >
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={styles.filterBar} className="no-print">
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94a3b8" style={{ marginLeft: 14 }} />
          <input
            type="text"
            placeholder="Search tutorials, features, or keywords (e.g. AliExpress, Refunds, Stripe, Backups)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={styles.clearSearchBtn}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={styles.categoryPillsWrapper}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="category-tab-btn"
                style={{
                  ...styles.categoryPill,
                  backgroundColor: isSelected ? "#4f46e5" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#475569",
                  borderColor: isSelected ? "#4f46e5" : "#e2e8f0",
                  fontWeight: isSelected ? "700" : "500",
                  boxShadow: isSelected ? "0 4px 12px rgba(79, 70, 229, 0.25)" : "none"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Left Tutorials List & Right Detail View */}
      <div style={styles.contentGrid}>
        {/* Left Column: Topics Navigation */}
        <div style={styles.leftColumn} className="no-print">
          <div style={styles.columnHeader}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px" }}>
              Tutorial Modules ({filteredTutorials.length})
            </span>
          </div>

          <div style={styles.tutorialsList}>
            {filteredTutorials.map(item => {
              const isSelected = activeSectionId === item.id;
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveSectionId(item.id)}
                  className="tutorial-item-card"
                  style={{
                    ...styles.tutorialCard,
                    backgroundColor: isSelected ? "rgba(99, 102, 241, 0.05)" : "#ffffff",
                    borderColor: isSelected ? "#6366f1" : "#e2e8f0",
                    borderLeftWidth: isSelected ? "4px" : "1px",
                    borderLeftColor: isSelected ? "#4f46e5" : "#e2e8f0",
                  }}
                >
                  <div style={styles.cardHeaderRow}>
                    <div style={{
                      ...styles.iconCircle,
                      backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "#f8fafc",
                      color: isSelected ? "#4f46e5" : "#64748b",
                    }}>
                      <IconComponent size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <div style={styles.cardCategoryText}>{item.category}</div>
                      <div style={{
                        ...styles.cardTitleText,
                        color: isSelected ? "#4f46e5" : "#1e293b",
                        fontWeight: isSelected ? "700" : "600"
                      }}>
                        {item.title}
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardFooterRow}>
                    <span style={{
                      ...styles.difficultyBadge,
                      backgroundColor: item.difficulty === "Beginner" ? "rgba(16, 185, 129, 0.1)" : item.difficulty === "Intermediate" ? "rgba(99, 102, 241, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: item.difficulty === "Beginner" ? "#059669" : item.difficulty === "Intermediate" ? "#4f46e5" : "#d97706"
                    }}>
                      {item.difficulty}
                    </span>
                    <span style={styles.timeBadge}>{item.estimatedTime}</span>
                  </div>
                </div>
              );
            })}

            {filteredTutorials.length === 0 && (
              <div style={styles.emptySearchBox}>
                <HelpCircle size={32} color="#94a3b8" />
                <p style={{ margin: "8px 0 4px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                  No matching tutorials found
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                  Try a different search keyword or switch the category filter back to &quot;All&quot;.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Tutorial Step-by-Step Reader */}
        <div style={styles.rightColumn} className="print-full-content">
          {activeTutorial ? (
            <div style={styles.activeContentCard}>
              {/* Tutorial Title Header */}
              <div style={styles.readerHeader}>
                <div style={{ textAlign: "left" }}>
                  <div style={styles.readerMetaRow}>
                    <span style={styles.readerCategory}>{activeTutorial.category}</span>
                    <span style={styles.readerDot}>•</span>
                    <span style={styles.readerTime}>{activeTutorial.estimatedTime} read</span>
                    <span style={styles.readerDot}>•</span>
                    <span style={styles.readerDifficulty}>{activeTutorial.difficulty} Level</span>
                  </div>
                  <h2 style={styles.readerTitle}>{activeTutorial.title}</h2>
                  <p style={styles.readerDesc}>{activeTutorial.description}</p>
                </div>

                {/* Direct Action Link to the Admin Page */}
                {activeTutorial.adminLink && (
                  <Link
                    href={activeTutorial.adminLink.href}
                    style={styles.openPageLinkBtn}
                    className="no-print"
                  >
                    <span>{activeTutorial.adminLink.label}</span>
                    <ExternalLink size={14} style={{ marginLeft: 6 }} />
                  </Link>
                )}
              </div>

              <hr style={styles.divider} />

              {/* Step-by-step walkthrough list */}
              <div style={styles.stepsContainer}>
                <h3 style={styles.sectionSubtitle}>Step-by-Step Walkthrough</h3>

                <div style={styles.stepsList}>
                  {activeTutorial.steps.map((step, idx) => (
                    <div key={idx} style={styles.stepCard}>
                      <div style={styles.stepNumberBadge}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <h4 style={styles.stepTitle}>{step.title}</h4>
                        <p style={styles.stepDetails}>{step.details}</p>

                        {step.codeSnippet && (
                          <div style={styles.snippetBox}>
                            <pre style={styles.codeText}>{step.codeSnippet}</pre>
                            <button
                              onClick={() => handleCopy(step.codeSnippet!)}
                              style={styles.copyBtn}
                              title="Copy code"
                            >
                              {copiedSnippet === step.codeSnippet ? (
                                <>
                                  <Check size={13} color="#10b981" />
                                  <span style={{ color: "#10b981", fontSize: "11px", fontWeight: "600" }}>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} color="#64748b" />
                                  <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "600" }}>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {step.adminLink && (
                          <div style={{ marginTop: "12px" }}>
                            <Link
                              href={step.adminLink.href}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                fontWeight: "700",
                                color: "#4f46e5",
                                textDecoration: "none",
                                backgroundColor: "rgba(99, 102, 241, 0.08)",
                                border: "1px solid rgba(99, 102, 241, 0.2)",
                                padding: "4px 10px",
                                borderRadius: "8px"
                              }}
                              className="no-print"
                            >
                              <span>{step.adminLink.label}</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips Box */}
              {activeTutorial.tips && activeTutorial.tips.length > 0 && (
                <div style={styles.tipsBox}>
                  <div style={styles.calloutHeader}>
                    <Lightbulb size={18} color="#059669" />
                    <span style={styles.tipsTitle}>Pro Tips & Best Practices</span>
                  </div>
                  <ul style={styles.tipsList}>
                    {activeTutorial.tips.map((tip, idx) => (
                      <li key={idx} style={styles.tipItem}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings Box */}
              {activeTutorial.warnings && activeTutorial.warnings.length > 0 && (
                <div style={styles.warningBox}>
                  <div style={styles.calloutHeader}>
                    <AlertTriangle size={18} color="#d97706" />
                    <span style={styles.warningTitle}>Important Operational Safeguards</span>
                  </div>
                  <ul style={styles.tipsList}>
                    {activeTutorial.warnings.map((warn, idx) => (
                      <li key={idx} style={styles.warnItem}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Download / Next Tutorial Footer */}
              <div style={styles.readerFooter} className="no-print">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Info size={16} color="#6366f1" />
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                    Need the complete documentation offline? You can download the raw Markdown file anytime.
                  </span>
                </div>

                <a
                  href="/docs/APEX_COMMERCE_TUTORIAL_GUIDE.md"
                  download="APEX_COMMERCE_TUTORIAL_GUIDE.md"
                  style={styles.footerDownloadLink}
                >
                  <Download size={14} style={{ marginRight: 6 }} />
                  Save Offline .md File
                </a>
              </div>
            </div>
          ) : (
            <div style={styles.emptyDetailState}>
              <BookOpen size={48} color="#cbd5e1" />
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#475569", marginTop: 12 }}>
                Select a tutorial module from the left list to view step-by-step instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    paddingBottom: "40px"
  },
  heroBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    padding: "30px 34px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
    flexWrap: "wrap",
    gap: "24px",
    position: "relative",
    overflow: "hidden"
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    flexWrap: "wrap"
  },
  heroPill: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid rgba(99, 102, 241, 0.2)"
  },
  heroStatusPill: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#059669",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
    border: "1px solid rgba(16, 185, 129, 0.2)"
  },
  heroTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 8px 0",
    letterSpacing: "-0.6px",
    lineHeight: "1.2"
  },
  heroSubtitle: {
    fontSize: "13.5px",
    color: "#64748b",
    margin: 0,
    lineHeight: "1.55",
    maxWidth: "680px"
  },
  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  },
  downloadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "12px",
    fontSize: "13.5px",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
    cursor: "pointer",
    border: "none"
  },
  printBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    color: "#334155",
    padding: "11px 18px",
    borderRadius: "12px",
    fontSize: "13.5px",
    fontWeight: "600",
    border: "1px solid #cbd5e1",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    cursor: "pointer"
  },
  filterBar: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
    overflow: "hidden"
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "13px 14px",
    fontSize: "14px",
    color: "#1e293b",
    fontFamily: "inherit"
  },
  clearSearchBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
    padding: "0 16px",
    cursor: "pointer"
  },
  categoryPillsWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflowX: "auto",
    paddingBottom: "4px"
  },
  categoryPill: {
    borderWidth: "1px",
    borderStyle: "solid",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "24px",
    alignItems: "start"
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 4px"
  },
  tutorialsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "calc(100vh - 260px)",
    overflowY: "auto",
    paddingRight: "4px"
  },
  tutorialCard: {
    padding: "16px 18px",
    borderRadius: "16px",
    borderWidth: "1px",
    borderStyle: "solid",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  cardHeaderRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px"
  },
  iconCircle: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  cardCategoryText: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "2px"
  },
  cardTitleText: {
    fontSize: "13.5px",
    lineHeight: "1.3"
  },
  cardFooterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "6px",
    borderTop: "1px dashed #f1f5f9"
  },
  difficultyBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "6px"
  },
  timeBadge: {
    fontSize: "11.5px",
    color: "#94a3b8",
    fontWeight: "500"
  },
  emptySearchBox: {
    backgroundColor: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "36px 20px",
    textAlign: "center"
  },
  rightColumn: {
    minWidth: 0
  },
  activeContentCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    padding: "32px",
    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)"
  },
  readerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  readerMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "12px",
    fontWeight: "600"
  },
  readerCategory: {
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  readerDot: {
    color: "#cbd5e1"
  },
  readerTime: {
    color: "#64748b"
  },
  readerDifficulty: {
    color: "#059669"
  },
  readerTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px"
  },
  readerDesc: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    margin: 0,
    maxWidth: "760px"
  },
  openPageLinkBtn: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "9px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f1f5f9",
    margin: "20px 0 26px 0"
  },
  stepsContainer: {
    marginBottom: "32px"
  },
  sectionSubtitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
    textAlign: "left"
  },
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  stepCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "18px 20px"
  },
  stepNumberBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "800",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)"
  },
  stepTitle: {
    fontSize: "14.5px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 6px 0"
  },
  stepDetails: {
    fontSize: "13.5px",
    color: "#475569",
    lineHeight: "1.6",
    margin: 0
  },
  snippetBox: {
    position: "relative",
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    padding: "12px 16px",
    marginTop: "12px",
    overflowX: "auto"
  },
  codeText: {
    color: "#e2e8f0",
    fontSize: "12.5px",
    fontFamily: "'Fira Code', monospace",
    margin: 0,
    lineHeight: "1.5"
  },
  copyBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer"
  },
  tipsBox: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    borderRadius: "14px",
    padding: "18px 22px",
    marginBottom: "20px"
  },
  warningBox: {
    backgroundColor: "rgba(245, 158, 11, 0.05)",
    border: "1px solid rgba(245, 158, 11, 0.25)",
    borderRadius: "14px",
    padding: "18px 22px",
    marginBottom: "20px"
  },
  calloutHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px"
  },
  tipsTitle: {
    fontSize: "13.5px",
    fontWeight: "700",
    color: "#065f46"
  },
  warningTitle: {
    fontSize: "13.5px",
    fontWeight: "700",
    color: "#92400e"
  },
  tipsList: {
    margin: 0,
    paddingLeft: "20px",
    textAlign: "left"
  },
  tipItem: {
    fontSize: "13px",
    color: "#047857",
    lineHeight: "1.55",
    marginBottom: "6px"
  },
  warnItem: {
    fontSize: "13px",
    color: "#b45309",
    lineHeight: "1.55",
    marginBottom: "6px"
  },
  readerFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
    flexWrap: "wrap",
    gap: "14px"
  },
  footerDownloadLink: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    color: "#4f46e5",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "12.5px",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  emptyDetailState: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px dashed #cbd5e1",
    padding: "60px 30px",
    textAlign: "center"
  }
};

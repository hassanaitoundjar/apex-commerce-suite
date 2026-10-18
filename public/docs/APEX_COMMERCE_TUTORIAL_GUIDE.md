# 📘 ApexCommerce Suite — Comprehensive Administrator Manual & Tutorial Guide

Welcome to the **ApexCommerce Suite Administrator Manual & Tutorial Guide**. This document provides an exhaustive, step-by-step walkthrough of every tool, feature, and workflow available in your executive administration dashboard.

---

## 📑 Table of Contents

1. [System Architecture & Overview](#1-system-architecture--overview)
2. [Quick-Start Onboarding (First 15 Minutes)](#2-quick-start-onboarding-first-15-minutes)
3. [Products & Catalog Management](#3-products--catalog-management)
   - [Adding a Single Product](#31-adding-a-single-product)
   - [Managing Categories, Brands, Sizes & Colors](#32-managing-categories-brands-sizes--colors)
   - [Product Creation Templates](#33-product-creation-templates)
   - [Product Bundles & Promotional Kits](#34-product-bundles--promotional-kits)
   - [1-Click AliExpress Product Importer](#35-1-click-aliexpress-product-importer)
   - [Bulk CSV Import & Catalog JSON Export](#36-bulk-csv-import--catalog-json-export)
4. [Inventory Management & Stock Alerts](#4-inventory-management--stock-alerts)
5. [Sales, Orders & Reverse Logistics](#5-sales-orders--reverse-logistics)
   - [The Order Lifecycle (Statuses & State Machine)](#51-the-order-lifecycle-statuses--state-machine)
   - [Issuing Refunds (Financial Reversals)](#52-issuing-refunds-financial-reversals)
   - [Processing Returns & Automatic Item Restocking](#53-processing-returns--automatic-item-restocking)
   - [Batch Order Operations](#54-batch-order-operations)
   - [Sales Reports & Performance Analytics](#55-sales-reports--performance-analytics)
6. [Marketing & Growth Tools](#6-marketing--growth-tools)
   - [Creating Discount Coupons](#61-creating-discount-coupons)
   - [Managing Expiry Dates & Restrictions](#62-managing-expiry-dates--restrictions)
7. [Content Management System (CMS)](#7-content-management-system-cms)
   - [Publishing Blog Articles & News](#71-publishing-blog-articles--news)
   - [Managing Custom Web Pages (Terms, Privacy, FAQs)](#72-managing-custom-web-pages-terms-privacy-faqs)
8. [Logistics & Geographical Rules](#8-logistics--geographical-rules)
   - [Shipping Carriers, Flat Rates & Timing Windows](#81-shipping-carriers-flat-rates--timing-windows)
   - [Supported Countries & States (Checkout Deliveries)](#82-supported-countries--states-checkout-deliveries)
9. [Customer Inquiries (Mailbox Desk)](#9-customer-inquiries-mailbox-desk)
10. [Customer Accounts Directory](#10-customer-accounts-directory)
11. [Staff Administration & Granular RBAC Permissions](#11-staff-administration--granular-rbac-permissions)
    - [Super Admin vs. Standard Administrator](#111-super-admin-vs-standard-administrator)
    - [Creating Staff Members with Granular Access](#112-creating-staff-members-with-granular-access)
12. [System Settings & Third-Party Integrations](#12-system-settings--third-party-integrations)
    - [General Settings (Store Name, Logo, Favicon & Currency)](#121-general-settings-store-name-logo-favicon--currency)
    - [Theme Customizer & Brand Colors](#122-theme-customizer--brand-colors)
    - [Multi-Language Localization & AI Auto-Translate](#123-multi-language-localization--ai-auto-translate)
    - [Payment Gateways (Stripe, PayPal, Razorpay, Cash on Delivery)](#124-payment-gateways-stripe-paypal-razorpay-cash-on-delivery)
    - [Cloud Storage Integration (S3, DigitalOcean, Backblaze)](#125-cloud-storage-integration-s3-digitalocean-backblaze)
    - [Email SMTP Settings & Automated Customer Templates](#126-email-smtp-settings--automated-customer-templates)
    - [Database Backups & 1-Click Restoration](#127-database-backups--1-click-restoration)
13. [Troubleshooting & Support FAQs](#13-troubleshooting--support-faqs)

---

## 1. System Architecture & Overview

ApexCommerce Suite is engineered on **Next.js 16 (App Router)**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.
- **Admin Control Panel**: Fully responsive executive workspace accessible at `/admin`.
- **Collapsible Sidebar**: Click the sidebar collapse toggle in the top-left or header to switch into **Icon-Only Mode (76px width)**. Hovering over any icon reveals a floating flyout menu with immediate access to sub-items.
- **Glassmorphic Modals**: All deletion and sensitive actions prompt with animated `ConfirmModal` dialogs instead of raw browser popups.

---

## 2. Quick-Start Onboarding (First 15 Minutes)

To launch your online storefront quickly, follow these 5 onboarding steps:
1. **Set Store Identity**: Navigate to **Settings → General** (`/admin/settings/general`). Enter your Store Name, official Email, and upload your high-resolution Logo and Favicon.
2. **Select Currency**: In General Settings, choose your primary billing currency (e.g., `USD ($)`, `EUR (€)`, `GBP (£)`).
3. **Configure Payment Gateway**: Go to **Settings → Gateways** (`/admin/settings/gateways`). Enable at least one payment method (e.g., **Cash on Delivery (COD)** for immediate zero-config checkout, or **Stripe / PayPal** for card payments).
4. **Setup Delivery Method**: Visit **Logistics → Shipping** (`/admin/shipping`). Add at least one shipping carrier (e.g., *Standard Delivery, $5.00, 3-5 business days*).
5. **Create First Product**: Head to **Products → All Products** (`/admin/products`) or click **Add Product** from the main dashboard banner. Fill in Title, Price, Description, Category, and Upload image.

---

## 3. Products & Catalog Management

### 3.1 Adding a Single Product
1. Go to **Products → All Products** (`/admin/products`).
2. Click the **+ Add Product** button.
3. Fill in the product creation modal:
   - **Product Title**: Search-friendly name (e.g., *"Premium Wireless Noise-Cancelling Headphones"*).
   - **Price**: Regular selling price.
   - **Sale Price (Optional)**: If entered, the storefront will display a red discount badge with crossed-out original price.
   - **Category**: Select an existing category.
   - **Stock Count**: Inventory amount currently in stock.
   - **Sizes & Colors**: Comma-separated attributes (e.g., `Small, Medium, Large` and `Midnight Black, Glacier Silver`).
   - **Product Images**: Upload one or multiple images or enter image URLs.
   - **Featured / On Sale Toggles**: Promote items on the storefront homepage hero and carousel.
4. Click **Save Product**.

### 3.2 Managing Categories, Brands, Sizes & Colors
Standardize and categorize your catalog:
- **Categories** (`/admin/products/categories`): Create parent and sub-categories with automatic slug generation and item counts.
- **Brands** (`/admin/products/brands`): Track manufacturer brands (e.g., Apple, Nike, Sony).
- **Sizes** (`/admin/products/sizes`): Pre-define size variations (e.g., `XS`, `S`, `M`, `L`, `XL`, `EU 42`, `US 10`).
- **Colors** (`/admin/products/colors`): Set color names with visual HEX color badges for storefront swatch pickers.

### 3.3 Product Creation Templates
Templates (`/admin/products/templates`) let you pre-configure attribute schemes (e.g., *Footwear Template*, *Electronics Specs Template*) so creation forms automatically preload attributes without manual typing.

### 3.4 Product Bundles & Promotional Kits
Bundles (`/admin/products/bundles`) combine multiple items into a single discounted package (e.g., *"Gaming Essentials Kit: Keyboard + Mouse + Headset"*):
- Select primary items included in the bundle.
- Specify a custom discount percentage (e.g., `15% OFF`).
- Track how many active customers purchase the bundle.

### 3.5 1-Click AliExpress Product Importer
Located at the top-right of the **Products Management** page (`/admin/products`):
1. Click **Import from AliExpress**.
2. Paste any live AliExpress product URL.
3. The automated importer fetches title, high-res images, pricing, and description instantly into your catalog draft.

### 3.6 Bulk CSV Import & Catalog JSON Export
Go to **Products → Import / Export** (`/admin/products/import-export`):
- **Import CSV**: Drag and drop a standard `.csv` file containing `title, price, description, stock, image` columns to batch upload hundreds of items.
- **Export JSON**: Download a single complete JSON backup of your active catalog with full variations and linked assets.

---

## 4. Inventory Management & Stock Alerts

Navigate to **Inventory** (`/admin/inventory`):
- Review real-time stock balances across all product lines.
- Items falling below `5 units` trigger the **Critical Low Stock Alert** card on the main dashboard.
- Inline editing allows one-click inventory replenishment without opening full product forms.

---

## 5. Sales, Orders & Reverse Logistics

### 5.1 The Order Lifecycle (Statuses & State Machine)
Every storefront purchase follows this pipeline in **Sales → Orders** (`/admin/orders`):
- **Pending**: Buyer completed checkout; payment authorization in review.
- **Processing**: Payment verified; warehouse fulfillment and packaging in progress.
- **Shipped**: Package handed to carrier; tracking number assigned.
- **Delivered**: Customer confirmed receipt; transaction settled.
- **Cancelled**: Order aborted prior to dispatch.

### 5.2 Issuing Refunds (Financial Reversals)
Go to **Sales → Refunds** (`/admin/sales/refunds`):
1. Filter orders in **Settled (Paid)** status.
2. Click **Issue Refund**.
3. A confirmation modal will ask you to confirm the refund amount and order reference.
4. Confirming updates the payment status to `refunded` and updates store revenue analytics.

### 5.3 Processing Returns & Automatic Item Restocking
Go to **Sales → Returns** (`/admin/sales/returns`):
1. Delivers orders are eligible for return audit.
2. Click **Approve Return**.
3. The system changes the order status to `returned` and **automatically adds item quantities back to the product catalog database**.

### 5.4 Batch Order Operations
Visit **Sales → Batch Processing** (`/admin/sales/batch-processing`):
1. Select multiple orders via checkboxes or click **Select All**.
2. Use the top bulk bar to perform mass actions in 1 click:
   - *Mark Processing*, *Mark Shipped*, *Mark Delivered*, *Mark Returned*, or *Cancel Selected*.
   - *Mark Paid*, *Mark Unpaid*, or *Mark Refunded*.

### 5.5 Sales Reports & Performance Analytics
Visit **Sales → Reports** (`/admin/sales/reports`):
- Filter performance by date range (Today, Last 7 Days, Month, Year).
- View Net Revenue, Top-Selling SKUs, Gross Profit Margins, and Average Order Value (AOV).

---

## 6. Marketing & Growth Tools

### 6.1 Creating Discount Coupons
Navigate to **Marketing** (`/admin/marketing`):
1. In the **Create Coupon** form, specify:
   - **Coupon Code**: Unique alphanumeric code (e.g., `SUMMER25`, `VIP50`).
   - **Discount Type**: Percentage (`%`) or Fixed Dollar Amount (`$`).
   - **Discount Value**: e.g., `20` for 20% or `$15` for $15 flat discount.
   - **Expiry Date (Optional)**: Automatically deactivates the code after this calendar date.
2. Click **Generate Coupon**.

### 6.2 Managing Expiry Dates & Restrictions
- Active/Inactive toggle switches allow immediate pausing of promotional codes.
- Red warning badges highlight expired coupons in the list.

---

## 7. Content Management System (CMS)

### 7.1 Publishing Blog Articles & News
Go to **Blogs** (`/admin/blogs`):
- Click **+ New Article**.
- Add Title, URL Slug, Author Name, Featured Thumbnail Image URL, and Article Body.
- Toggle between **Draft** and **Published** states.

### 7.2 Managing Custom Web Pages (Terms, Privacy, FAQs)
Go to **Page Management** (`/admin/pages`):
- Create informational storefront pages (e.g., `/privacy-policy`, `/terms-of-service`, `/about-us`, `/faqs`).
- Supports formatted HTML/Markdown content and instant toggle publishing.

---

## 8. Logistics & Geographical Rules

### 8.1 Shipping Carriers & Rates
Go to **Logistics → Shipping** (`/admin/shipping`):
- Add carriers (e.g., *FedEx Overnight, $19.99, 1-2 days* or *Free Standard Shipping, $0.00, 4-7 days*).
- Toggle carriers active/inactive to control which options show during checkout.

### 8.2 Supported Countries & States
Go to **Logistics → Geography** (`/admin/geography`):
- Enable or disable specific shipping destination countries and regional provinces.

---

## 9. Customer Inquiries (Mailbox Desk)

Visit **Mailbox** (`/admin/mailbox`):
- Centralizes contact form messages submitted by storefront visitors.
- Preview message subject, sender name, email, and timestamp.
- **Copy Email**: 1-click clipboard copy to reply from your corporate mail client.
- **Delete**: Remove resolved messages with clean modal confirmation.

---

## 10. Customer Accounts Directory

Visit **Customers** (`/admin/customers`):
- Lists registered shoppers, their verified email addresses, registration dates, and total orders placed.

---

## 11. Staff Administration & Granular RBAC Permissions

### 11.1 Super Admin vs. Standard Administrator
Go to **System Settings → Admins & Staff** (`/admin/admins`):
- **Super Administrator**: The primary system master account created during installation. Holds root access to every panel, database backup tool, and security setting.
- **Standard Administrator**: Sub-account staff member restricted to specific designated modules.

### 11.2 Creating Staff Members with Granular Access
1. Click **+ Add Administrator**.
2. Enter Name, Text Username (e.g., `sarah_support`), Email, and Password.
3. Check the permission checkboxes matching their job role:
   - ✅ Products & Catalog
   - ✅ Inventory Management
   - ✅ Sales & Orders
   - ⬜ System Settings & Gateways
4. When this user logs in, the sidebar and route guards will hide and restrict access to unauthorized sections automatically.

---

## 12. System Settings & Third-Party Integrations

### 12.1 General Settings
Location: `/admin/settings/general`
- Store Name, Contact Email, Store Currency (`$`, `€`, `£`, etc.), and Global Promo Header.
- Upload Logo & Favicon.

### 12.2 Theme Customizer & Brand Colors
Location: `/admin/settings/theme`
- Choose between curated theme aesthetics (Modern Dark, Minimalist Light, Luxe Rose, Emerald, Indigo).
- Set primary HEX accent color (e.g., `#6366f1`).

### 12.3 Multi-Language Localization & AI Auto-Translate
Location: `/admin/settings/languages`
- Add international language locales (English, Spanish, French, German, Arabic, Japanese, etc.).
- **1-Click AI Translation**: Automatically translate all storefront keywords into the target language using your configured AI model.

### 12.4 Payment Gateways
Location: `/admin/settings/gateways`
- **Cash on Delivery (COD)**: Enable zero-fee cash on delivery.
- **Stripe**: Input Publishable Key and Secret Key for credit/debit card processing.
- **PayPal**: Input Client ID and Secret Key for PayPal checkout.
- **Razorpay**: Input Key ID and Key Secret for cards, netbanking, and UPI payments.

### 12.5 Cloud Storage Integration
Location: `/admin/settings/storage`
- Choose media storage engine: **Local Disk**, **AWS S3**, **DigitalOcean Spaces**, **Google Cloud Storage (GCS)**, or **Backblaze B2**.

### 12.6 Email SMTP Configuration
Location: `/admin/settings/email`
- Configure SMTP Host, Port, Username, Password, and From Address.
- Preview and customize automated email templates:
  - Welcome Customer Email
  - Order Receipt Confirmation
  - Shipping Confirmation with Carrier Details
  - Password Reset Email

### 12.7 Database Backups & 1-Click Restoration
Location: `/admin/settings/backup`
- **Export Backup**: Download a timestamped `.json` file containing all product listings, categories, and settings.
- **Restore Backup**: Upload a previously saved backup file to restore your entire database in seconds.

---

## 13. Troubleshooting & Support FAQs

- **Q: Where do I manage product categories?**
  - A: Navigate to **Products → Categories** in the sidebar.
- **Q: How do I change the default currency?**
  - A: Go to **Settings → General** and update the Currency symbol. All prices across storefront and orders will update immediately.
- **Q: How do I collapse the sidebar into icons?**
  - A: Click the collapse toggle button next to your store logo in the sidebar or in the top navigation bar.
- **Q: Are deleted items recoverable?**
  - A: No, deletion actions are irreversible and confirmed through the modern `ConfirmModal` dialog to protect against accidental clicks. We recommend exporting a weekly catalog backup from **Settings → Backup**.

---
*ApexCommerce Suite — Executive Administration Manual*

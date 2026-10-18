# ⚡ ApexCommerce Suite

> **ApexCommerce Suite** is a modern, enterprise-grade, full-stack eCommerce platform engineered with **Next.js 16 (App Router)**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. Designed with state-of-the-art UI/UX, responsive layouts, a collapsible icon-mode control panel, and a granular Role-Based Access Control (RBAC) security system.

---

## 📸 Key Highlights & Features

- **Modern Responsive Storefront**:
  - Full-featured shopping cart, wishlist, multi-language localization, and multi-currency formatting.
  - Interactive product catalog, bundles, collections, categories, color & size variants.
  - Modern checkout flows supporting Stripe, PayPal, Razorpay, and Cash on Delivery (COD).
- **Executive Admin Control Panel**:
  - **Modern Collapsible Sidebar**: Smooth transition between full navigation and a space-saving icon-only collapsed mode (`76px`) with floating flyout menus on hover.
  - **Sleek Custom Scrollbar**: Ultra-thin, translucent scrollbars eliminating thick default browser scrollbars.
  - **Dynamic Branding**: Store name and logo uploaded in General Settings automatically propagate to the sidebar, navigation, and page titles in real-time.
  - **Real-Time Analytics Dashboard**: Redesigned stat cards with micro-animations, revenue velocity charts, fulfillment meters, and low-stock alerts.
  - **Personalized Welcome Banner**: Greets the authenticated admin user by name with role badge indicators.
- **Enterprise Role-Based Access Control (RBAC)**:
  - **Primary Super Admin**: Created once during initial installation with permanent system-level lock protection.
  - **Standard Administrators**: Create team staff with custom text usernames and granular permissions (e.g., Products, Inventory, Sales, Marketing, Blogs, Logistics, System Settings).
  - Route-level permission guards that prevent unauthorized staff access with custom access denial views.
- **One-Click Installation Wizard (`/install`)**:
  - Guided database initialization, super administrator creation, and storefront configuration wizard with zero license roadblocks.
- **Multi-Gateway Payment Integration**:
  - Pre-integrated Stripe (credit/debit cards), PayPal, Razorpay (cards & UPI), and COD.
- **Cloud Storage & AI Localization**:
  - Integrated support for DigitalOcean Spaces, AWS S3, Google Cloud Storage, Backblaze B2, and AI translation APIs (OpenAI, Groq, Gemini).

---

## 🛠️ Tech Stack Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode, end-to-end typed) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | JWT (JSON Web Tokens) with HTTP-only cookies & bcrypt password hashing |
| **Icons & UI** | [Lucide React](https://lucide.dev/), Modern Glassmorphism, CSS Variables |
| **Styling** | Vanilla CSS & Tailored HSL theme design system |

---

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js**: `v18.x` or higher (recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or higher (or `pnpm` / `yarn`)
- **PostgreSQL**: `v14.x` or higher running locally or hosted on Supabase, Neon, AWS RDS, or Docker

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/hassanaitoundjar/apex-commerce-suite.git
cd apex-commerce-suite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the provided `.env.example` template to `.env`:

```bash
cp .env.example .env
```

Open `.env` and verify your settings:

```env
# Application Base URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Demo Mode (Set to false for active development and production)
DEMO_MODE="false"

# PostgreSQL Database Connection String
DATABASE_URL="postgresql://username:password@localhost:5432/snapshop?schema=public"

# Security (Generate a secure secret key for JWT session tokens)
JWT_SECRET="your_custom_secure_jwt_secret_key_here"
```

### 4. Push Database Schema

Synchronize your Prisma schema with your PostgreSQL database:

```bash
npx prisma db push
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧙‍♂️ Initial Installation & Setup

1. **Automatic Redirect**: If no administrator accounts exist, visiting `/admin` or `/` will automatically direct you to the installation wizard at `/install`.
2. **Setup Wizard Steps**:
   - **Database Check**: Confirms active connection to your PostgreSQL database.
   - **Super Admin Account**: Enter your email, username, and password. This account is assigned the permanent `super_admin` role.
   - **Store Profile**: Enter your initial Store Name (e.g., `alibaba`), currency symbol (`$`, `€`, `MAD`, etc.), and contact email.
3. **Login to Admin Panel**:
   - Go to [http://localhost:3000/login](http://localhost:3000/login)
   - Sign in with your newly created Super Admin credentials.
   - You will land on the executive dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🛡️ Admin Roles & Permissions

- **Super Administrator (`super_admin`)**:
  - Has unrestricted access across all system areas.
  - Can create, manage, and assign permissions to standard staff accounts at `/admin/admins`.
  - Is protected from accidental deletion or role tampering.
- **Standard Administrator (`admin`)**:
  - Staff created with a custom username and assigned granular checkboxes:
    - Products & Catalog
    - Inventory
    - Sales & Orders
    - Customers
    - Marketing & Campaigns
    - Blogs & Pages
    - Shipping & Logistics
    - General Settings
  - Restricted tabs are hidden from their sidebar and locked via route middleware.

---

## 🎨 Admin Sidebar Features

- **Collapse / Expand**: Click the toggle icon (<kbd>◨</kbd>) in the sidebar header or in the top navigation bar to toggle between the 260px expanded menu and the 76px icon-only mode.
- **Hover Flyouts**: When collapsed, hover over any category icon (such as Products or Settings) to reveal a floating flyout menu with direct links to all sub-pages.
- **Sleek Custom Scrollbar**: The navigation section features an ultra-thin 5px translucent scrollbar that brightens on hover and never causes layout shifts.
- **Memory Persistence**: Your sidebar mode preference is saved in `localStorage` across all pages and browser sessions.

---

## 📂 Project Structure

```
├── prisma/
│   └── schema.prisma           # Prisma database models & relations
├── public/
│   ├── images/                 # Logos, flags, banners, product assets
│   └── logo.png
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── [lang]/             # Dynamic multilingual storefront
│   │   ├── admin/              # Admin dashboard, products, orders, settings
│   │   ├── api/                # REST API endpoints (auth, products, orders, admin)
│   │   ├── install/            # One-click installation wizard
│   │   ├── login/              # Admin & customer authentication
│   │   └── layout.tsx
│   ├── components/
│   │   ├── admin/              # Sidebar, AdminLayoutClient, HeaderNotifications
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── context/                # AppProvider & global state context
│   ├── lib/                    # Auth tokens, db connector, Prisma model adapters
│   └── models/                 # Database models (User, Product, Order, Settings)
├── .env.example                # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 🚢 Production Deployment

### Build the Application

```bash
npm run build
```

### Run in Production

```bash
npm start
```

### Deployment Options:
- **Vercel / Railway / Render**: Connect your GitHub repository, configure environment variables, and deploy directly.
- **Ubuntu VPS / DigitalOcean / Linode**: Run using `PM2` with a PostgreSQL database and Nginx reverse proxy.

---

## 📄 License

This software is released under the **MIT License**. Feel free to use, customize, and deploy it for commercial or personal projects.

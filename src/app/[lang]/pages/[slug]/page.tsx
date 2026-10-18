import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import CustomPage from "@/models/CustomPage";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CustomPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: CustomPageProps) {
  const { slug } = await params;
  await dbConnect();
  const page = await CustomPage.findOne({ slug: slug.toLowerCase(), published: true });
  if (!page) return { title: "Page Not Found - SnapShop" };
  return {
    title: `${page.title} - SnapShop`,
    description: page.title,
  };
}

export default async function CustomPageRoute({ params }: CustomPageProps) {
  const { lang, slug } = await params;
  await dbConnect();

  const page = await CustomPage.findOne({ slug: slug.toLowerCase(), published: true });
  if (!page) {
    notFound();
  }

  return (
    <div style={{ minHeight: "80vh", backgroundColor: "#fafafa", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Breadcrumbs */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", marginBottom: "28px" }}>
          <Link href={`/${lang}`} style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#0f172a", fontWeight: "500" }}>{page.title}</span>
        </nav>

        {/* Page Card */}
        <article style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "48px 40px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "16px",
            letterSpacing: "-0.5px"
          }}>
            {page.title}
          </h1>

          <div style={{
            fontSize: "13px",
            color: "#94a3b8",
            marginBottom: "32px",
            paddingBottom: "20px",
            borderBottom: "1px solid #f1f5f9"
          }}>
            Last updated: {new Date(page.updatedAt || page.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>

          <div 
            style={{
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#334155",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}
          >
            {page.content}
          </div>
        </article>
      </div>
    </div>
  );
}

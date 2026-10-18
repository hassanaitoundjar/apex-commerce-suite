import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Demo Mode Guard for Administrative Mutations
  if (process.env.DEMO_MODE === "true" && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const isProtectedAdminApi =
      pathname.startsWith("/api/admin") ||
      pathname.startsWith("/api/settings") ||
      pathname.startsWith("/api/upload") ||
      pathname.startsWith("/api/seed") ||
      pathname.startsWith("/api/categories") ||
      (pathname.startsWith("/api/products") && !pathname.includes("/reviews")) ||
      (pathname.startsWith("/api/orders") && (request.method !== "POST" || pathname.includes("/batch")));

    if (isProtectedAdminApi) {
      return NextResponse.json(
        {
          error: "Demo Mode is active. Changes are disabled in the live preview. Set DEMO_MODE=false in your .env file to enable changes.",
          isDemo: true,
        },
        { status: 403 }
      );
    }
  }

  // Exclude static assets, API, and admin routes from storefront locale redirection
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/install") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") || // e.g. images, logo.png, styles
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Supported languages pattern
  const locales = [
    "en", "ar", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko", "tr", "nl",
    "hi", "bn", "pa", "vi", "pl", "uk", "ro", "el", "cs", "hu", "sv", "id", "ms",
    "th", "fa", "he", "no", "da", "fi", "sk", "bg", "hr", "sr", "lt", "lv", "et",
    "sl", "ga", "mt", "is", "al", "ge", "am", "az", "kk", "uz", "tl", "ur"
  ];

  // Check if the URL has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Extract the locale from the pathname
    const matchLocale = pathname.split("/")[1];
    
    // Update the selected_lang cookie to match the explicit URL locale
    const response = NextResponse.next();
    response.cookies.set("selected_lang", matchLocale, { path: "/", maxAge: 31536000 });
    return response;
  }

  // Get preferences
  const defaultLang = request.cookies.get("default_lang")?.value || "en";
  const selectedLang = request.cookies.get("selected_lang")?.value || defaultLang;

  // If the user's preferred language is NOT the default, redirect to the localized subpath
  if (selectedLang !== defaultLang) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${selectedLang}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  // If it's the default language, rewrite internally to /[defaultLang]/... so Next.js matches the folder
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/${defaultLang}${pathname}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    // Match all pathnames including api for security guards, excluding static files
    "/((?!_next/static|_next/image|favicon.ico|images|classic_loafers.png|classic_shirt_dress.png|gold_necklace.png|hero_fashion_girl.png|high_waist_shorts.png|logo.png).*)",
  ],
};

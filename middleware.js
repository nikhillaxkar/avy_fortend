import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const adminToken = request.cookies.get("adminToken")?.value;

  const { pathname } = request.nextUrl;

  // User Protected Routes
  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/wishlist");

  // User Auth Routes
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  // Admin Routes
  const isAdminRoute =
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login");

  // ================= USER =================

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ================= ADMIN =================

  // Admin login nahi hai aur /admin open kar raha hai
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Admin login ho gaya hai aur dubara login page open kar raha hai
  if (pathname === "/admin/login" && adminToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg|.*\\.png).*)",
  ],
};
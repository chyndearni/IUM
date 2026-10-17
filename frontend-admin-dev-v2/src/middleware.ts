import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const isLogin = request.cookies.get("isLogin")?.value;
  const userProfile = request.cookies.get("userProfile")?.value;

  const { pathname } = request.nextUrl;
  const isAuth = isLogin === "true";

  // Halaman publik khusus login/register
  const publicOnlyPaths = [
    "/admin/login",
    "/admin/register",
    "/admin/forgot-password",
  ];
  const isPublicOnly = publicOnlyPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAuth && isPublicOnly) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika belum login, cegah akses halaman protected
  if (!isAuth && !isPublicOnly) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Jika login tapi token hilang
  if (isAuth && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Role-based access control
  const roleAccess: Record<string, string[]> = {
    superadmin: [
      "/dashboard",
      "/management-admin",
      "/management-company",
      "/management-user",
      "/report",
    ],
    admin: ["/dashboard", "/management-company", "/management-user", "/report"],
  };

  if (isAuth && role && roleAccess[role]) {
    const allowedPaths = roleAccess[role];
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Khusus pengecekan userProfile
  if (isAuth) {
    if (userProfile === "false" && pathname.startsWith("/resume/cv")) {
      return NextResponse.redirect(new URL("/resume", request.url));
    }
    if (userProfile === "true" && pathname === "/resume") {
      return NextResponse.redirect(new URL("/resume/cv", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/management-admin/:path*",
    "/management-company/:path*",
    "/management-user/:path*",
    "/report/:path*",
    "/profile/:path*",
    "/resume/:path*",
    "/my-apply-jobs/:path*",
    "/my-job-application/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};

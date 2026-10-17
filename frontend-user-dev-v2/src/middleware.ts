import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const isLogin = request.cookies.get("isLogin")?.value;
  const userProfile = request.cookies.get("userProfile")?.value;

  const { pathname } = request.nextUrl;
  const isAuth = isLogin === "true";

  const publicOnlyPaths = ["/login", "/register", "/forgot-password"];
  const isPublicOnly = publicOnlyPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAuth && isPublicOnly) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/lowongan-pekerjaan",
    "/profile-perusahaan",
    "/resume",
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isAuth && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuth && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuth && role && role !== "user" && role !== "perusahaan") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const pathOnlyForCompany = ["/lowongan-pekerjaan", "/profile-perusahaan"];
  if (
    isAuth &&
    pathOnlyForCompany.some((path) => pathname.startsWith(path)) &&
    role !== "perusahaan"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const pathOnlyForUser = ["/resume", "/my-apply-jobs", "/my-job-application"];
  if (
    isAuth &&
    pathOnlyForUser.some((path) => pathname.startsWith(path)) &&
    role !== "user"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // ✔️ Redirect logika userProfile yang benar
  if (isAuth) {
    // Jika user belum punya profile, cegah akses ke /resume/cv
    if (userProfile === "false" && pathname.startsWith("/resume/cv")) {
      return NextResponse.redirect(new URL("/resume", request.url));
    }

    // Jika user sudah punya profile, cegah akses ke halaman /resume langsung
    if (userProfile === "true" && pathname === "/resume") {
      return NextResponse.redirect(new URL("/resume/cv", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",

    "/lowongan-pekerjaan/:path*",
    "/profile-perusahaan/:path*",

    "/my-apply-jobs/:path*",
    "/my-job-application/:path*",

    "/resume/:path*",

    "/login",
    "/register",
    "/forgot-password",
  ],
};

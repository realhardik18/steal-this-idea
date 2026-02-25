import { NextResponse } from "next/server";

export function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Check if this is the launches subdomain
  const isLaunchesSubdomain =
    hostname.startsWith("launches.") ||
    hostname.startsWith("launches-"); // Vercel preview deploys use dashes

  if (isLaunchesSubdomain) {
    // Skip rewriting if already under /launches path (avoid double rewrite)
    if (pathname.startsWith("/launches")) {
      return NextResponse.next();
    }

    // Rewrite root and all paths to /launches/*
    const url = request.nextUrl.clone();
    url.pathname = `/launches${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and internal Next.js routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

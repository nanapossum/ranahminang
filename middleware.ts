import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { authCookieName } from "@/lib/auth/cookies";
import { verifyEdgeSessionToken } from "@/lib/auth/edge";

const protectedRoutes: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/dashboard/admin", roles: ["superadmin"] },
  { prefix: "/dashboard/producer", roles: ["producer"] },
  { prefix: "/dashboard/tourist", roles: ["superadmin", "tourist"] },
  { prefix: "/superadmin", roles: ["superadmin"] },
  { prefix: "/producer", roles: ["producer"] },
  { prefix: "/tourist", roles: ["superadmin", "tourist"] },
  { prefix: "/profile", roles: ["superadmin", "producer", "tourist"] },
  { prefix: "/api/admin", roles: ["superadmin"] }
];

function findProtectedRoute(pathname: string) {
  return protectedRoutes.find((route) => pathname.startsWith(route.prefix));
}

export async function middleware(request: NextRequest) {
  const protectedRoute = findProtectedRoute(request.nextUrl.pathname);

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(authCookieName)?.value;
  const session = token ? await verifyEdgeSessionToken(token) : null;

  if (!session) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!protectedRoute.roles.includes(session.role)) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin",
    "/dashboard/admin/:path*",
    "/dashboard/producer",
    "/dashboard/producer/:path*",
    "/dashboard/tourist",
    "/dashboard/tourist/:path*",
    "/superadmin",
    "/superadmin/:path*",
    "/producer",
    "/producer/:path*",
    "/tourist",
    "/tourist/:path*",
    "/profile",
    "/profile/:path*",
    "/api/admin/:path*"
  ]
};


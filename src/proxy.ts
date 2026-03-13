import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const { pathname } = request.nextUrl;

    // 1. Protect Admin Routes
    if (pathname.startsWith("/admin")) {
        if (!session || session.user.role !== "ADMIN") {
            // If not logged in or not an admin, redirect to storefront
            return NextResponse.redirect(new URL("/", request.url));
        }
        // Allow access to admin pages
        return NextResponse.next();
    }

    // 2. Always Redirect Admin to /admin
    // We exclude /login and /api routes to avoid redirect loops or breaking auth
    if (
        session?.user.role === "ADMIN" &&
        !pathname.startsWith("/admin") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/api") &&
        pathname !== "/favicon.ico"
    ) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    // 3. For all other routes, proceed normally
    return NextResponse.next();
}

export const config = {
    // Apply to all routes except internal Next.js paths and static assets
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
        "/admin"
    ],
};

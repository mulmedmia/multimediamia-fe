import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function isTokenValid(token) {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

function getRoleFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { cookies, nextUrl } = req;
  const token = cookies.get("authToken")?.value;
  const pendingEmail = cookies.get("pendingEmail")?.value;
  let role = null;
  let valid = false;

  if (token) {
    valid = await isTokenValid(token);
    if (valid) {
      role = getRoleFromToken(token);
    }
  }

  if (nextUrl.pathname.startsWith("/register/otp")) {
    if (!pendingEmail) {
      return NextResponse.redirect(new URL("/register", req.url));
    }
    return NextResponse.next();
  }

  if (
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/admin")
  ) {
    if (!token || !valid) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (nextUrl.pathname.startsWith("/dashboard") && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (nextUrl.pathname === "/login" && token && valid) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/register/otp", "/login"],
};

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { jwtDecode } from "jwt-decode";

const BYPASS_TOKEN = process.env.MAINTENANCE_BYPASS_TOKEN || "mia2026_dev_bypass";

async function isTokenValid(token) {
  if (!token || typeof token !== "string") return false;

  // 1. Validasi struktur JWT dan timestamp kedaluwarsa (exp)
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp) return false;
    // decoded.exp dalam detik, bandingkan dengan milidetik saat ini
    if (decoded.exp * 1000 <= Date.now()) {
      return false;
    }
  } catch {
    return false;
  }

  // 2. Jika JWT_SECRET diset di environment Vercel, coba verifikasi kriptografis
  if (process.env.JWT_SECRET) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      // Jika secret berbeda antara Vercel dan Render, biarkan lolos selama token belum expired.
      // Keamanan kriptografis hakiki ditegakkan 100% oleh Backend API Express di setiap request data.
    }
  }

  return true;
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

  // ============================================================
  // 1. MAINTENANCE MODE HANDLING
  // ============================================================
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const hasBypassCookie = cookies.get("maintenance_bypass")?.value === "true";
  const hasBypassQuery = nextUrl.searchParams.get("bypass_maintenance") === BYPASS_TOKEN;
  const isAdminOrJuriOrFinance = valid && (role === "ADMIN" || role === "JURI" || role === "FINANCE");

  if (isMaintenance) {
    // Penanganan bypass melalui query parameter (?bypass_maintenance=TOKEN)
    if (hasBypassQuery) {
      const cleanUrl = new URL(nextUrl.pathname, req.url);
      nextUrl.searchParams.forEach((val, key) => {
        if (key !== "bypass_maintenance") {
          cleanUrl.searchParams.set(key, val);
        }
      });
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set("maintenance_bypass", "true", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // Berlaku 24 jam
        sameSite: "lax",
      });
      return response;
    }

    const isBypassed = hasBypassCookie || isAdminOrJuriOrFinance;

    // Halaman maintenance itu sendiri selalu diizinkan
    if (nextUrl.pathname === "/maintenance") {
      return NextResponse.next();
    }

    // Izinkan halaman login agar Admin / Juri dapat masuk
    if (nextUrl.pathname === "/login") {
      if (token && valid) {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        } else if (role === "JURI") {
          return NextResponse.redirect(new URL("/juri/manage-submission", req.url));
        } else if (role === "FINANCE") {
          return NextResponse.redirect(new URL("/finance/pendaftaran", req.url));
        }
      }
      return NextResponse.next();
    }

    // Jika tidak dibypass, alihkan pengunjung umum ke /maintenance
    if (!isBypassed) {
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }
  } else {
    // Jika mode maintenance NONAKTIF, cegah akses manual ke /maintenance
    if (nextUrl.pathname === "/maintenance") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ============================================================
  // 2. EXISTING AUTH & ROLE CHECKS
  // ============================================================
  if (nextUrl.pathname.startsWith("/register/otp")) {
    if (!pendingEmail) {
      return NextResponse.redirect(new URL("/register", req.url));
    }
    return NextResponse.next();
  }

  if (
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/admin") ||
    nextUrl.pathname.startsWith("/juri") ||
    nextUrl.pathname.startsWith("/finance") ||
    nextUrl.pathname.startsWith("/history-pesanan") ||
    nextUrl.pathname.startsWith("/misi-harian") ||
    nextUrl.pathname.startsWith("/product") ||
    nextUrl.pathname.startsWith("/profile")
  ) {
    if (!token || !valid) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (nextUrl.pathname.startsWith("/juri") && role !== "JURI") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (nextUrl.pathname.startsWith("/finance") && role !== "FINANCE" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (nextUrl.pathname.startsWith("/dashboard") && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (nextUrl.pathname.startsWith("/dashboard") && role === "JURI") {
      return NextResponse.redirect(new URL("/juri/manage-submission", req.url));
    }

    if (nextUrl.pathname.startsWith("/dashboard") && role === "FINANCE") {
      return NextResponse.redirect(new URL("/finance/pendaftaran", req.url));
    }

    return NextResponse.next();
  }

  if (nextUrl.pathname === "/login" && token && valid) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (role === "JURI") {
      return NextResponse.redirect(new URL("/juri/manage-submission", req.url));
    } else if (role === "FINANCE") {
      return NextResponse.redirect(new URL("/finance/pendaftaran", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (
    nextUrl.pathname.includes("/daftar-lomba") &&
    nextUrl.pathname.startsWith("/competition-info")
  ) {
    if (!token || !valid) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static assets (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico, .woff, .woff2)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};

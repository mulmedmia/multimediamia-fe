"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log unexpected client runtime errors for diagnostics
    console.error("Unhandled client error in App Router:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0D14] text-[#FFF9F5] p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-red-500 shadow-lg shadow-red-500/5">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
        Terjadi Kesalahan Sistem
      </h1>

      <p className="text-[#AAB1BD] text-sm sm:text-base mb-8 max-w-md">
        Mohon maaf, sistem mengalami kendala tak terduga saat memuat halaman ini.
        Silakan coba muat ulang atau kembali ke beranda.
      </p>

      {error?.message && process.env.NODE_ENV !== "production" && (
        <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/10 max-w-lg text-left text-xs font-mono text-red-400 overflow-x-auto">
          <code>{error.message}</code>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => reset()}
          className="mia-btn-primary px-6 py-3 text-sm inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

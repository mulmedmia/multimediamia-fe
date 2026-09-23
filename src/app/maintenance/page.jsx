"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  RefreshCw,
  Clock,
  ShieldCheck,
  MessageCircle,
  Instagram,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MaintenancePage() {
  const [isChecking, setIsChecking] = useState(false);

  const handleRefresh = () => {
    setIsChecking(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#FFF9F5] flex flex-col justify-between selection:bg-[#E01C20] selection:text-white relative overflow-hidden">
      {/* Background Decorative Gradients & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#E01C20]/15 via-[#FED700]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#571845]/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-[350px] h-[350px] bg-[#E01C20]/10 blur-[100px] pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Brand Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src="/mia2026_logo.png"
            alt="Multimedia in Action 2026 Logo"
            width={34}
            height={34}
            className="object-contain"
            priority
          />
          <span className="text-base sm:text-lg font-bold text-[#FFF9F5] tracking-tight">
            Multimedia{" "}
            <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
              In Action 2026
            </span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#AAB1BD] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Server Status: In Maintenance</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="max-w-2xl w-full mx-auto text-center space-y-8">
          {/* Animated Status Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#E01C20] to-[#FED700] opacity-25 blur-xl animate-pulse" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#141824] border border-white/15 flex items-center justify-center shadow-2xl">
              <Wrench className="w-12 h-12 sm:w-14 sm:h-14 text-[#FED700] animate-bounce duration-1000" />
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-xl bg-[#E01C20] flex items-center justify-center border-2 border-[#0A0D14] shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Badge & Headings */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>PEMELIHARAAN SISTEM BERKALA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFF9F5] tracking-tight leading-tight">
              Website Sedang Dalam{" "}
              <span className="bg-gradient-to-r from-[#E01C20] via-[#FF4500] to-[#FED700] bg-clip-text text-transparent">
                Perbaikan & Pembaruan
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#AAB1BD] max-w-xl mx-auto leading-relaxed">
              Halo peserta dan pengunjung MIA 2026! Saat ini tim teknis kami sedang
              melakukan pembaruan sistem dan peningkatan performa server. Seluruh data tim,
              pendaftaran, dan karya Anda tetap aman.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141824]/90 border border-white/10 space-y-2 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Estimasi Waktu</span>
              </div>
              <p className="text-xs text-[#AAB1BD] leading-relaxed">
                Pemeliharaan berlangsung sementara. Sistem akan kembali online segera setelah seluruh sinkronisasi selesai.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#141824]/90 border border-white/10 space-y-2 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Keamanan Data</span>
              </div>
              <p className="text-xs text-[#AAB1BD] leading-relaxed">
                Database dan dokumen submisi Anda tersimpan dengan aman di cloud storage berenkripsi tinggi.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRefresh}
              disabled={isChecking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#E01C20] to-[#FF4500] hover:opacity-90 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(224,28,32,0.35)] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
              />
              <span>{isChecking ? "Memeriksa Status..." : "Cek Status & Muat Ulang"}</span>
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#FFF9F5] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Hubungi Panitia (WhatsApp)</span>
            </a>
          </div>

          {/* Admin bypass hint */}
          <p className="text-[11px] text-[#AAB1BD]/60">
            Panitia atau juri lomba?{" "}
            <Link
              href="/login"
              className="text-[#FED700] hover:underline font-medium inline-flex items-center gap-0.5"
            >
              <span>Login Akses Panitia</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAB1BD]">
        <p>© 2026 Multimedia Informatics Award (MIA). All rights reserved.</p>
        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com/ksm_multimedia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Instagram className="w-4 h-4 text-pink-500" />
            <span>@ksm_multimedia</span>
          </a>
          <a
            href="mailto:ksmmultimedia@gmail.com"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email Resmi</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

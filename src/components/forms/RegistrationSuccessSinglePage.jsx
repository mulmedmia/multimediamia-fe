"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  X,
  ExternalLink,
  MessageCircle,
  Users,
  Trophy,
  ArrowRight,
  Info,
  Clock,
} from "lucide-react";

export function RegistrationSuccessSinglePage({ registration, onClose }) {
  const category = registration?.category || {};
  const categoryName = category.name || category.category_name || "Kategori Lomba";
  const categorySlug = category.slug || "";
  const whatsappUrl = category.whatsapp_group_url;
  const teamName =
    registration?.team_name ||
    registration?.user?.name ||
    "Tim Anda";

  return (
    <div className="mia-card p-6 sm:p-10 shadow-2xl space-y-7 w-full max-w-2xl mx-auto relative overflow-hidden animate-in fade-in-50 zoom-in-95 duration-300">
      {/* Tombol Tutup X di pojok kanan atas */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Tutup Halaman"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header Sukses */}
      <div className="text-center space-y-3 pt-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Pendaftaran Berhasil Dicatat
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight pt-1">
            Selamat, Pendaftaran Berhasil!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Data pendaftaran Anda telah berhasil tersimpan di sistem{" "}
            <span className="text-foreground font-semibold">
              Multimedia In Action 2026
            </span>
            .
          </p>
        </div>
      </div>

      {/* Ringkasan Pendaftaran */}
      <div className="p-4 sm:p-5 rounded-2xl bg-input/30 border border-border/50 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground pb-2.5 border-b border-border/40">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Detail Pendaftaran
          </span>
          <span className="text-amber-400 font-medium flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi Berkas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              Nama Tim:
            </span>
            <p className="font-bold text-foreground text-sm sm:text-base">
              {teamName}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Kategori Lomba:
            </span>
            <p className="font-bold text-foreground text-sm sm:text-base">
              {categoryName} {categorySlug && `(${categorySlug})`}
            </p>
          </div>
        </div>
      </div>

      {/* Highlight Box: WhatsApp Group */}
      {whatsappUrl ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0F121A] to-emerald-950/20 border border-emerald-500/40 space-y-4 shadow-xl shadow-emerald-950/40">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Grup WhatsApp Resmi ({categoryName})
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Segera bergabung ke dalam grup WhatsApp koordinasi resmi peserta lomba{" "}
                <span className="text-foreground font-semibold">
                  {categoryName}
                </span>
                . Seluruh informasi teknis, arahan panitia, dan jadwal briefing akan disampaikan di sini.
              </p>
            </div>
          </div>

          {/* Tombol Akses WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm sm:text-base shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Gabung Grup WhatsApp Sekarang</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/80">
            <Info className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <span>
              Tautan grup ini juga dapat Anda akses kapan saja melalui menu{" "}
              <strong className="text-foreground">Detail Tim</strong> di dashboard.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Info className="w-4 h-4" />
            <span>Informasi Grup WhatsApp Peserta</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Tautan grup WhatsApp koordinasi untuk kategori{" "}
            <span className="text-foreground font-medium">{categoryName}</span>{" "}
            akan segera diperbarui oleh panitia. Anda dapat memeriksanya sewaktu-waktu di menu{" "}
            <strong className="text-foreground">Detail Tim</strong> pada dashboard.
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2">
        <Button
          onClick={onClose}
          className="w-full h-11 sm:h-12 rounded-xl bg-input/60 hover:bg-input border border-white/20 text-foreground font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <span>Tutup & Buka Dashboard Lomba</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

export default RegistrationSuccessSinglePage;

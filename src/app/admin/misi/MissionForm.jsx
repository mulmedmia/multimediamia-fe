"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserCategories } from "@/services/user-category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Zap,
  Gem,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ExternalLink,
  HelpCircle,
  Trophy,
} from "lucide-react";

// Helper datetime-local formatter
const formatDatetimeForInput = (isoDate) => {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export default function MissionForm({ initial, onSubmit, isLoading, onCancel }) {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["user-categories-dropdown"],
    queryFn: getAllUserCategories,
    staleTime: 5 * 60 * 1000,
  });

  const isInitiallyFixed =
    initial &&
    initial.min_xp === initial.max_xp &&
    initial.min_diamond === initial.max_diamond;

  const [rewardMode, setRewardMode] = useState(
    initial ? (isInitiallyFixed ? "FIXED" : "RANGE") : "FIXED"
  );

  const [form, setForm] = useState({
    category_id: initial?.category_id || "ALL",
    title: initial?.title || "",
    description: initial?.description || "",
    deadline: formatDatetimeForInput(initial?.deadline) || "",
    status: initial?.status || "ACTIVE",
    fixed_xp:
      initial?.max_xp !== undefined
        ? String(initial.max_xp)
        : "100",
    fixed_diamond:
      initial?.max_diamond !== undefined
        ? String(initial.max_diamond)
        : "10",
    min_xp: initial?.min_xp !== undefined ? String(initial.min_xp) : "50",
    max_xp: initial?.max_xp !== undefined ? String(initial.max_xp) : "100",
    min_diamond: initial?.min_diamond !== undefined ? String(initial.min_diamond) : "10",
    max_diamond: initial?.max_diamond !== undefined ? String(initial.max_diamond) : "20",
    google_docs_url: initial?.google_docs_url || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      const fixed =
        initial.min_xp === initial.max_xp &&
        initial.min_diamond === initial.max_diamond;
      setRewardMode(fixed ? "FIXED" : "RANGE");
      setForm({
        category_id: initial.category_id || "ALL",
        title: initial.title || "",
        description: initial.description || "",
        deadline: formatDatetimeForInput(initial.deadline) || "",
        status: initial.status || "ACTIVE",
        fixed_xp:
          initial.max_xp !== undefined
            ? String(initial.max_xp)
            : "100",
        fixed_diamond:
          initial.max_diamond !== undefined
            ? String(initial.max_diamond)
            : "10",
        min_xp: initial.min_xp !== undefined ? String(initial.min_xp) : "50",
        max_xp: initial.max_xp !== undefined ? String(initial.max_xp) : "100",
        min_diamond: initial.min_diamond !== undefined ? String(initial.min_diamond) : "10",
        max_diamond: initial.max_diamond !== undefined ? String(initial.max_diamond) : "20",
        google_docs_url: initial.google_docs_url || "",
      });
      setError("");
    } else {
      setRewardMode("FIXED");
      setForm({
        category_id: "ALL",
        title: "",
        description: "",
        deadline: "",
        status: "ACTIVE",
        fixed_xp: "100",
        fixed_diamond: "10",
        min_xp: "50",
        max_xp: "100",
        min_diamond: "10",
        max_diamond: "20",
        google_docs_url: "",
      });
      setError("");
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || form.title.trim().length < 5) {
      setError("Judul misi wajib diisi minimal 5 karakter.");
      return;
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      setError("Deskripsi misi wajib diisi minimal 10 karakter.");
      return;
    }
    if (!form.deadline) {
      setError("Batas waktu (deadline) misi wajib ditentukan.");
      return;
    }

    let minXp, maxXp, minDia, maxDia;

    if (rewardMode === "FIXED") {
      const fixedXpNum = Number(form.fixed_xp);
      const fixedDiaNum = Number(form.fixed_diamond);

      if (isNaN(fixedXpNum) || fixedXpNum < 0) {
        setError("Jumlah XP (Fix) harus berupa angka positif (>= 0).");
        return;
      }
      if (isNaN(fixedDiaNum) || fixedDiaNum < 0) {
        setError("Jumlah Diamond (Fix) harus berupa angka positif (>= 0).");
        return;
      }

      minXp = fixedXpNum;
      maxXp = fixedXpNum;
      minDia = fixedDiaNum;
      maxDia = fixedDiaNum;
    } else {
      const parsedMinXp = Number(form.min_xp);
      const parsedMaxXp = Number(form.max_xp);
      if (isNaN(parsedMinXp) || parsedMinXp < 0 || isNaN(parsedMaxXp) || parsedMaxXp < 0) {
        setError("Nilai XP harus berupa angka positif.");
        return;
      }
      if (parsedMinXp > parsedMaxXp) {
        setError("Min XP tidak boleh lebih besar dari Max XP.");
        return;
      }

      const parsedMinDia = Number(form.min_diamond);
      const parsedMaxDia = Number(form.max_diamond);
      if (isNaN(parsedMinDia) || parsedMinDia < 0 || isNaN(parsedMaxDia) || parsedMaxDia < 0) {
        setError("Nilai Diamond harus berupa angka positif.");
        return;
      }
      if (parsedMinDia > parsedMaxDia) {
        setError("Min Diamond tidak boleh lebih besar dari Max Diamond.");
        return;
      }

      minXp = parsedMinXp;
      maxXp = parsedMaxXp;
      minDia = parsedMinDia;
      maxDia = parsedMaxDia;
    }

    if (!form.google_docs_url.trim()) {
      setError("Link Google Docs panduan misi wajib diisi.");
      return;
    }
    try {
      new URL(form.google_docs_url.trim());
    } catch {
      setError("Format Link Google Docs tidak valid (harus diawali http:// atau https://).");
      return;
    }

    setError("");

    const payload = {
      category_id:
        form.category_id && form.category_id !== "ALL" ? form.category_id : null,
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: new Date(form.deadline).toISOString(),
      status: form.status,
      min_xp: minXp,
      max_xp: maxXp,
      min_diamond: minDia,
      max_diamond: maxDia,
      google_docs_url: form.google_docs_url.trim(),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Kategori Kompetisi */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#FED700]" />
            <span>Kategori Kompetisi <span className="text-[#E01C20]">*</span></span>
          </Label>
          <Select
            value={form.category_id || "ALL"}
            onValueChange={(val) => setForm((f) => ({ ...f, category_id: val }))}
            disabled={loadingCategories}
          >
            <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
              <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih cakupan kategori"} />
            </SelectTrigger>
            <SelectContent className="bg-[#141824] border-border/50 text-foreground">
              <SelectItem value="ALL">
                🌐 Semua Kategori (Global / Bersama)
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                  {cat.category_name || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            {form.category_id === "ALL" || !form.category_id
              ? "Misi ini akan tampil di seluruh kategori lomba (WIA & UIA). Reward akan diberikan ke seluruh tim yang diikuti peserta."
              : "Misi ini hanya akan tampil khusus untuk kategori yang dipilih."}
          </p>
        </div>

        {/* Judul Misi */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title" className="text-xs text-muted-foreground font-medium">
            Judul Misi Harian <span className="text-[#E01C20]">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Contoh: Misi 1: Share Twibbon MIA 2026 di Instagram"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Deadline Misi */}
        <div className="space-y-1.5">
          <Label htmlFor="deadline" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Batas Waktu (Deadline) <span className="text-[#E01C20]">*</span></span>
          </Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Status Misi */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Status Misi <span className="text-[#E01C20]">*</span>
          </Label>
          <Select
            value={form.status}
            onValueChange={(val) => setForm((f) => ({ ...f, status: val }))}
          >
            <SelectTrigger className="h-10! bg-input/40 border-border/50 rounded-xl text-xs text-foreground w-full">
              <SelectValue placeholder="Pilih status misi" />
            </SelectTrigger>
            <SelectContent className="bg-[#141824] border-border/50 text-foreground">
              <SelectItem value="ACTIVE">ACTIVE (Misi Aktif)</SelectItem>
              <SelectItem value="DRAFT">DRAFT (Disembunyikan)</SelectItem>
              <SelectItem value="EXPIRED">EXPIRED (Kadaluarsa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deskripsi Misi */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description" className="text-xs text-muted-foreground font-medium">
            Deskripsi & Ringkasan Instruksi <span className="text-[#E01C20]">*</span>
          </Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Tuliskan instruksi langkah demi langkah, syarat pengerjaan, dan format bukti pengumpulan misi..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="bg-input/40 border-border/50 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 resize-none"
            required
          />
        </div>

        {/* Opsi Tipe Reward: Fix vs Range */}
        <div className="sm:col-span-2 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <Label className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
              <span>Tipe Alokasi Hadiah (Reward) <span className="text-[#E01C20]">*</span></span>
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-[#141824] border border-border/50 rounded-xl mt-2">
            <button
              type="button"
              onClick={() => {
                setRewardMode("FIXED");
                setForm((f) => ({
                  ...f,
                  fixed_xp: f.fixed_xp || f.max_xp || f.min_xp || "100",
                  fixed_diamond: f.fixed_diamond || f.max_diamond || f.min_diamond || "10",
                }));
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                rewardMode === "FIXED"
                  ? "bg-[#E01C20] text-white shadow-md shadow-red-900/30"
                  : "text-[#AAB1BD] hover:text-white hover:bg-white/5"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Nilai Tetap (Fix)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRewardMode("RANGE");
                setForm((f) => ({
                  ...f,
                  min_xp: f.min_xp || f.fixed_xp || "50",
                  max_xp: f.max_xp || f.fixed_xp || "100",
                  min_diamond: f.min_diamond || f.fixed_diamond || "10",
                  max_diamond: f.max_diamond || f.fixed_diamond || "20",
                }));
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                rewardMode === "RANGE"
                  ? "bg-[#E01C20] text-white shadow-md shadow-red-900/30"
                  : "text-[#AAB1BD] hover:text-white hover:bg-white/5"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Rentang Nilai (Range)</span>
            </button>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {rewardMode === "FIXED"
              ? "Peserta mendapat nilai pasti saat misi disetujui"
              : "Admin bebas menentukan nilai saat me-review submission"}
          </span>
        </div>

        {rewardMode === "FIXED" ? (
          <>
            {/* Input Fixed XP */}
            <div className="space-y-1.5">
              <Label htmlFor="fixed_xp" className="text-xs font-medium flex items-center gap-1.5 text-amber-400">
                <Zap className="h-3.5 w-3.5 fill-amber-400" />
                <span>Hadiah XP (Tetap) <span className="text-[#E01C20]">*</span></span>
              </Label>
              <Input
                id="fixed_xp"
                type="number"
                min="0"
                placeholder="100"
                value={form.fixed_xp}
                onChange={(e) => setForm((f) => ({ ...f, fixed_xp: e.target.value }))}
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Pasti mendapatkan {form.fixed_xp || 0} XP
              </p>
            </div>

            {/* Input Fixed Diamond */}
            <div className="space-y-1.5">
              <Label htmlFor="fixed_diamond" className="text-xs font-medium flex items-center gap-1.5 text-cyan-400">
                <Gem className="h-3.5 w-3.5 fill-cyan-400" />
                <span>Hadiah Diamond (Tetap) <span className="text-[#E01C20]">*</span></span>
              </Label>
              <Input
                id="fixed_diamond"
                type="number"
                min="0"
                placeholder="10"
                value={form.fixed_diamond}
                onChange={(e) => setForm((f) => ({ ...f, fixed_diamond: e.target.value }))}
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Pasti mendapatkan {form.fixed_diamond || 0} Diamond
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Rentang Hadiah XP */}
            <div className="space-y-1.5">
              <Label htmlFor="min_xp" className="text-xs font-medium flex items-center gap-1.5 text-amber-400">
                <Zap className="h-3.5 w-3.5 fill-amber-400" />
                <span>Min XP <span className="text-[#E01C20]">*</span></span>
              </Label>
              <Input
                id="min_xp"
                type="number"
                min="0"
                placeholder="50"
                value={form.min_xp}
                onChange={(e) => setForm((f) => ({ ...f, min_xp: e.target.value }))}
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max_xp" className="text-xs font-medium flex items-center gap-1.5 text-amber-400">
                <Zap className="h-3.5 w-3.5 fill-amber-400" />
                <span>Max XP <span className="text-[#E01C20]">*</span></span>
              </Label>
              <Input
                id="max_xp"
                type="number"
                min="0"
                placeholder="100"
                value={form.max_xp}
                onChange={(e) => setForm((f) => ({ ...f, max_xp: e.target.value }))}
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
                required
              />
            </div>

            {/* Rentang Hadiah Diamond */}
            <div className="space-y-1.5">
              <Label htmlFor="min_diamond" className="text-xs font-medium flex items-center gap-1.5 text-cyan-400">
                <Gem className="h-3.5 w-3.5 fill-cyan-400" />
                <span>Min Diamond <span className="text-[#E01C20]">*</span></span>
              </Label>
              <Input
                id="min_diamond"
                type="number"
                min="0"
                placeholder="10"
                value={form.min_diamond}
                onChange={(e) => setForm((f) => ({ ...f, min_diamond: e.target.value }))}
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="max_diamond" className="text-xs font-medium flex items-center gap-1.5 text-cyan-400">
                <Gem className="h-3.5 w-3.5 fill-cyan-400" />
                <span>Max Diamond <span className="text-[#E01C20]">*</span></span>
              </Label>
              <Input
                id="max_diamond"
                type="number"
                min="0"
                placeholder="20"
                value={form.max_diamond}
                onChange={(e) => setForm((f) => ({ ...f, max_diamond: e.target.value }))}
                className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
                required
              />
            </div>
          </>
        )}

        {/* Reward Preview Callout Box */}
        <div className="sm:col-span-2 p-3 bg-[#0F121A] border border-border/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HelpCircle className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
            <span>
              {rewardMode === "FIXED"
                ? "Hadiah tetap (pasti) yang diberikan saat review di-ACC:"
                : "Rentang alokasi reward untuk review submission:"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs">
              <Zap className="h-3 w-3 fill-amber-400" />
              {rewardMode === "FIXED"
                ? `${form.fixed_xp || 0} XP (Fix)`
                : `${form.min_xp || 0} - ${form.max_xp || 0} XP`}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-xs">
              <Gem className="h-3 w-3 fill-cyan-400" />
              {rewardMode === "FIXED"
                ? `${form.fixed_diamond || 0} Diamond (Fix)`
                : `${form.min_diamond || 0} - ${form.max_diamond || 0} Diamond`}
            </span>
          </div>
        </div>

        {/* Google Docs URL */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="google_docs_url" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Link Google Docs Panduan / Brief Misi <span className="text-[#E01C20]">*</span></span>
          </Label>
          <Input
            id="google_docs_url"
            type="url"
            placeholder="https://docs.google.com/document/d/..."
            value={form.google_docs_url}
            onChange={(e) => setForm((f) => ({ ...f, google_docs_url: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
          <p className="text-[11px] text-muted-foreground">
            Peserta akan dapat membuka tautan ini untuk membaca rincian petunjuk teknis misi.
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl text-xs text-muted-foreground hover:text-white cursor-pointer"
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          {isLoading ? "Menyimpan..." : initial ? "Perbarui Misi" : "Simpan Misi"}
        </Button>
      </DialogFooter>
    </form>
  );
}

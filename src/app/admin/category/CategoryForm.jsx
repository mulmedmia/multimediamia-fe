"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/image-loader";
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
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  AlertCircle,
  Calendar,
  Clock,
  ExternalLink,
  MessageCircle,
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

export default function CategoryForm({
  initial,
  onSubmit,
  isLoading,
  type = "create",
  onCancel,
}) {
  const getDefaultBatch1Start = () => {
    return formatDatetimeForInput(new Date("2026-09-24T00:00:00"));
  };

  const getDefaultBatch1End = () => {
    return formatDatetimeForInput(new Date("2026-10-05T23:59:59"));
  };

  const getDefaultBatch2Start = () => {
    return formatDatetimeForInput(new Date("2026-10-06T00:00:00"));
  };

  const getDefaultBatch2End = () => {
    return formatDatetimeForInput(new Date("2026-10-16T23:59:59"));
  };

  const getDefaultPreliminaryDeadline = () => {
    const now = new Date();
    now.setDate(now.getDate() + 20);
    now.setHours(23, 59, 0, 0);
    return formatDatetimeForInput(now);
  };

  const getDefaultFinalDeadline = () => {
    const now = new Date();
    now.setDate(now.getDate() + 35);
    now.setHours(23, 59, 0, 0);
    return formatDatetimeForInput(now);
  };

  const [form, setForm] = useState({
    name: initial?.name || "",
    slug: initial?.slug || initial?.category_name || "",
    organizer: initial?.organizer || "Panitia MIA 2026",
    description: initial?.description || "",
    status: initial?.status || "VERIFIED",
    team_type: initial?.team_type || "GROUP",
    preliminary_deadline: formatDatetimeForInput(initial?.preliminary_deadline || initial?.deadline) || getDefaultPreliminaryDeadline(),
    final_deadline: formatDatetimeForInput(initial?.final_deadline || initial?.deadline) || getDefaultFinalDeadline(),
    batch_1_start: formatDatetimeForInput(initial?.batch_1_start) || (type === "create" ? getDefaultBatch1Start() : ""),
    batch_1_end: formatDatetimeForInput(initial?.batch_1_end) || (type === "create" ? getDefaultBatch1End() : ""),
    batch_2_start: formatDatetimeForInput(initial?.batch_2_start) || (type === "create" ? getDefaultBatch2Start() : ""),
    batch_2_end: formatDatetimeForInput(initial?.batch_2_end) || (type === "create" ? getDefaultBatch2End() : ""),
    file_url: initial?.file_url || "",
    whatsapp_group_url: initial?.whatsapp_group_url || "",
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(
    initial?.image || initial?.image_url || null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        slug: initial.slug || initial.category_name || "",
        organizer: initial.organizer || "Panitia MIA 2026",
        description: initial.description || "",
        status: initial.status || "VERIFIED",
        team_type: initial.team_type || "GROUP",
        preliminary_deadline: formatDatetimeForInput(initial.preliminary_deadline || initial.deadline) || getDefaultPreliminaryDeadline(),
        final_deadline: formatDatetimeForInput(initial.final_deadline || initial.deadline) || getDefaultFinalDeadline(),
        batch_1_start: formatDatetimeForInput(initial.batch_1_start) || "",
        batch_1_end: formatDatetimeForInput(initial.batch_1_end) || "",
        batch_2_start: formatDatetimeForInput(initial.batch_2_start) || "",
        batch_2_end: formatDatetimeForInput(initial.batch_2_end) || "",
        file_url: initial.file_url || "",
        whatsapp_group_url: initial.whatsapp_group_url || "",
        image: null,
      });
      setPreviewUrl(initial.image || initial.image_url || null);
      setError("");
    } else {
      setForm({
        name: "",
        slug: "",
        organizer: "Panitia MIA 2026",
        description: "",
        status: "VERIFIED",
        team_type: "GROUP",
        preliminary_deadline: getDefaultPreliminaryDeadline(),
        final_deadline: getDefaultFinalDeadline(),
        batch_1_start: getDefaultBatch1Start(),
        batch_1_end: getDefaultBatch1End(),
        batch_2_start: getDefaultBatch2Start(),
        batch_2_end: getDefaultBatch2End(),
        file_url: "",
        whatsapp_group_url: "",
        image: null,
      });
      setPreviewUrl(null);
      setError("");
    }
  }, [initial]);

  const handleNameChange = (val) => {
    setForm((f) => ({ ...f, name: val }));
  };

  const handleSlugChange = (val) => {
    setForm((f) => ({
      ...f,
      slug: val.toUpperCase(),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || form.name.trim().length < 3) {
      setError("Nama perlombaan wajib diisi minimal 3 karakter.");
      return;
    }
    if (!form.slug.trim() || form.slug.trim().length < 2) {
      setError("Singkatan / Slug perlombaan wajib diisi minimal 2 karakter (contoh: WIA, UIA).");
      return;
    }
    if (!form.organizer.trim() || form.organizer.trim().length < 3) {
      setError("Penyelenggara wajib diisi minimal 3 karakter.");
      return;
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      setError("Deskripsi kategori wajib diisi minimal 10 karakter.");
      return;
    }
    if (!form.preliminary_deadline) {
      setError("Batas pengumpulan hasil karya sementara wajib ditentukan.");
      return;
    }
    if (!form.final_deadline) {
      setError("Batas pengumpulan hasil karya final wajib ditentukan.");
      return;
    }

    if (form.batch_1_start && form.batch_1_end) {
      const b1Start = new Date(form.batch_1_start).getTime();
      const b1End = new Date(form.batch_1_end).getTime();
      if (b1Start > b1End) {
        setError("Tanggal mulai Batch 1 tidak boleh melewati tanggal selesai Batch 1.");
        return;
      }
    }

    if (form.batch_2_start && form.batch_2_end) {
      const b2Start = new Date(form.batch_2_start).getTime();
      const b2End = new Date(form.batch_2_end).getTime();
      if (b2Start > b2End) {
        setError("Tanggal mulai Batch 2 tidak boleh melewati tanggal selesai Batch 2.");
        return;
      }
    }

    const prelim = new Date(form.preliminary_deadline).getTime();
    const final = new Date(form.final_deadline).getTime();

    if (prelim > final) {
      setError("Batas pengumpulan karya sementara tidak boleh melewati batas pengumpulan karya final.");
      return;
    }

    if (!form.file_url.trim()) {
      setError("Link guidebook / panduan lomba wajib diisi.");
      return;
    }
    try {
      new URL(form.file_url.trim());
    } catch {
      setError("Format Link Guidebook tidak valid (harus diawali http:// atau https://).");
      return;
    }

    if (form.whatsapp_group_url && form.whatsapp_group_url.trim()) {
      try {
        new URL(form.whatsapp_group_url.trim());
      } catch {
        setError("Format Link Grup WhatsApp tidak valid (harus diawali http:// atau https://).");
        return;
      }
    }

    if (type === "create" && !form.image) {
      setError("Banner / gambar kategori wajib diunggah.");
      return;
    }

    setError("");

    const cleanSlug = form.slug.trim().toUpperCase();

    const payload = {
      name: form.name.trim(),
      slug: cleanSlug,
      category_name: cleanSlug, // compatibility
      organizer: form.organizer.trim(),
      description: form.description.trim(),
      status: form.status,
      team_type: form.team_type,
      preliminary_deadline: new Date(form.preliminary_deadline).toISOString(),
      final_deadline: new Date(form.final_deadline).toISOString(),
      deadline: new Date(form.final_deadline).toISOString(), // backward compatibility
      batch_1_start: form.batch_1_start ? new Date(form.batch_1_start).toISOString() : null,
      batch_1_end: form.batch_1_end ? new Date(form.batch_1_end).toISOString() : null,
      batch_2_start: form.batch_2_start ? new Date(form.batch_2_start).toISOString() : null,
      batch_2_end: form.batch_2_end ? new Date(form.batch_2_end).toISOString() : null,
      file_url: form.file_url.trim(),
      whatsapp_group_url: form.whatsapp_group_url ? form.whatsapp_group_url.trim() : null,
    };

    if (form.image) {
      payload.image = form.image;
    }

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
        {/* Nama Perlombaan */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground font-medium">
            Nama Perlombaan <span className="text-[#E01C20]">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Contoh: Web In Action"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Singkatan / Slug Perlombaan */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="slug" className="text-xs text-muted-foreground font-medium">
              Singkatan / Slug Lomba <span className="text-[#E01C20]">*</span>
            </Label>
            <span className="text-[10px] text-muted-foreground/70">
              Contoh: WIA (Web In Action), UIA (UI/UX In Action)
            </span>
          </div>
          <Input
            id="slug"
            placeholder="Contoh: WIA"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 font-bold tracking-wider uppercase"
            required
          />
        </div>

        {/* Penyelenggara */}
        <div className="space-y-1.5">
          <Label htmlFor="organizer" className="text-xs text-muted-foreground font-medium">
            Penyelenggara <span className="text-[#E01C20]">*</span>
          </Label>
          <Input
            id="organizer"
            placeholder="Contoh: Panitia MIA 2026"
            value={form.organizer}
            onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Tipe Peserta */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Tipe Kepesertaan <span className="text-[#E01C20]">*</span>
          </Label>
          <Select
            value={form.team_type}
            onValueChange={(val) => setForm((f) => ({ ...f, team_type: val }))}
          >
            <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground w-full">
              <SelectValue placeholder="Pilih tipe tim" />
            </SelectTrigger>
            <SelectContent className="bg-[#141824] border-border/50 text-foreground">
              <SelectItem value="GROUP">GROUP (Kelompok / Tim)</SelectItem>
              <SelectItem value="INDIVIDUAL">INDIVIDUAL (Individu)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Kategori */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Status Kategori <span className="text-[#E01C20]">*</span>
          </Label>
          <Select
            value={form.status}
            onValueChange={(val) => setForm((f) => ({ ...f, status: val }))}
          >
            <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground w-full">
              <SelectValue placeholder="Pilih status kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#141824] border-border/50 text-foreground">
              <SelectItem value="VERIFIED">VERIFIED (Terverifikasi & Aktif)</SelectItem>
              <SelectItem value="NOT_VERIFIED">NOT_VERIFIED (Belum Verifikasi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden sm:block"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {/* Batch 1: Mulai & Selesai */}
        <div className="space-y-1.5">
          <Label htmlFor="batch_1_start" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#FF4500]" />
            <span>Batch 1: Mulai Pendaftaran</span>
          </Label>
          <Input
            id="batch_1_start"
            type="datetime-local"
            value={form.batch_1_start}
            onChange={(e) => setForm((f) => ({ ...f, batch_1_start: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="batch_1_end" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#FF4500]" />
            <span>Batch 1: Selesai Pendaftaran</span>
          </Label>
          <Input
            id="batch_1_end"
            type="datetime-local"
            value={form.batch_1_end}
            onChange={(e) => setForm((f) => ({ ...f, batch_1_end: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Batch 2: Mulai & Selesai */}
        <div className="space-y-1.5">
          <Label htmlFor="batch_2_start" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#FED700]" />
            <span>Batch 2: Mulai Pendaftaran</span>
          </Label>
          <Input
            id="batch_2_start"
            type="datetime-local"
            value={form.batch_2_start}
            onChange={(e) => setForm((f) => ({ ...f, batch_2_start: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="batch_2_end" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#FED700]" />
            <span>Batch 2: Selesai Pendaftaran</span>
          </Label>
          <Input
            id="batch_2_end"
            type="datetime-local"
            value={form.batch_2_end}
            onChange={(e) => setForm((f) => ({ ...f, batch_2_end: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Pengumpulan Hasil Karya Sementara */}
        <div className="space-y-1.5">
          <Label htmlFor="preliminary_deadline" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Pengumpulan Hasil Karya Sementara <span className="text-[#E01C20]">*</span></span>
          </Label>
          <Input
            id="preliminary_deadline"
            type="datetime-local"
            value={form.preliminary_deadline}
            onChange={(e) => setForm((f) => ({ ...f, preliminary_deadline: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
          <p className="text-[10px] text-muted-foreground">
            Batas pengumpulan awal sebelum fase review juri & perbaikan.
          </p>
        </div>

        {/* Pengumpulan Hasil Karya Final */}
        <div className="space-y-1.5">
          <Label htmlFor="final_deadline" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#E01C20]" />
            <span>Pengumpulan Hasil Karya Final <span className="text-[#E01C20]">*</span></span>
          </Label>
          <Input
            id="final_deadline"
            type="datetime-local"
            value={form.final_deadline}
            onChange={(e) => setForm((f) => ({ ...f, final_deadline: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
          <p className="text-[10px] text-muted-foreground">
            Batas akhir pengumpulan karya final setelah fase perbaikan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {/* Deskripsi Kategori */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description" className="text-xs text-muted-foreground font-medium">
            Deskripsi Kategori & Ketentuan Lomba <span className="text-[#E01C20]">*</span>
          </Label>
          <Textarea
            id="description"
            rows={3}
            placeholder="Tuliskan gambaran umum, kriteria karya yang diterima, dan ketentuan khusus lomba..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="bg-input/40 border-border/50 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 resize-none"
            required
          />
        </div>

        {/* Upload Gambar / Banner */}
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="image" className="text-xs text-muted-foreground font-medium">
              Banner / Poster Kategori {type === "create" && <span className="text-[#E01C20]">*</span>}
            </Label>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium">
              Rekomendasi: 1200 × 675 px (16:9)
            </span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-[#0F121A] border border-border/40 rounded-xl">
            {previewUrl ? (
              <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-border/50 bg-black/40 flex-shrink-0">
                <Image
                  src={getSafeImageUrl(previewUrl)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={typeof previewUrl === "string" && previewUrl.startsWith("blob:")}
                />
              </div>
            ) : (
              <div className="w-28 h-16 rounded-xl border border-dashed border-border/60 bg-white/[0.02] flex flex-col items-center justify-center text-muted-foreground flex-shrink-0 gap-1">
                <ImageIcon className="h-5 w-5 opacity-40" />
                <span className="text-[9px] opacity-40">16 : 9</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 bg-input/40 hover:bg-input/60 text-xs font-medium text-foreground cursor-pointer transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{previewUrl ? "Ganti Gambar Banner" : "Unggah Gambar Banner"}</span>
              </label>
              <div className="space-y-0.5 mt-1.5">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 flex-wrap">
                  <span>Ukuran disarankan:</span>
                  <span className="text-foreground font-semibold">1200 × 675 px</span>
                  <span>atau</span>
                  <span className="text-foreground font-semibold">1920 × 1080 px</span>
                  <span className="text-blue-400 font-medium">(Landscape 16:9)</span>
                </p>
                <p className="text-[10px] text-muted-foreground/70">
                  Format JPG, PNG, atau WEBP. Maksimal file 5MB (otomatis dikonversi & dikompresi ke AVIF).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Link Guidebook / URL */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="file_url" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Link Guidebook / Buku Panduan (Google Drive / PDF) <span className="text-[#E01C20]">*</span></span>
          </Label>
          <Input
            id="file_url"
            type="url"
            placeholder="https://drive.google.com/file/d/... atau https://..."
            value={form.file_url}
            onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
            required
          />
          <p className="text-[11px] text-muted-foreground">
            Tautan dokumen panduan teknis yang dapat diunduh atau dibaca oleh calon peserta.
          </p>
        </div>

        {/* Link Grup WhatsApp */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp_group_url" className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>Link Grup WhatsApp Kategori</span>
            </Label>
            <span className="text-[10px] text-muted-foreground/70">
              Opsional
            </span>
          </div>
          <Input
            id="whatsapp_group_url"
            type="url"
            placeholder="https://chat.whatsapp.com/..."
            value={form.whatsapp_group_url}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp_group_url: e.target.value }))}
            className="h-10 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
          />
          <p className="text-[11px] text-muted-foreground">
            Tautan undangan grup WhatsApp untuk koordinasi dan informasi penting bagi peserta lomba kategori ini.
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
          {isLoading ? "Menyimpan..." : initial ? "Perbarui Kategori" : "Simpan Kategori"}
        </Button>
      </DialogFooter>
    </form>
  );
}

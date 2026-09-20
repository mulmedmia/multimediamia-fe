"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BookOpen,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import { useGuidebook, useUpdateGuidebook } from "@/hooks/use-guidebook";
import { toast } from "sonner";

export default function AdminGuidebookPage() {
  const { guidebookUrl, isLoading } = useGuidebook();
  const updateMutation = useUpdateGuidebook();

  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (guidebookUrl) {
      setInputUrl(guidebookUrl);
    }
  }, [guidebookUrl]);

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();

    if (!trimmed) {
      setError("Link Google Drive Guidebook tidak boleh kosong.");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      setError("Format URL tidak valid. Pastikan diawali dengan https:// atau http://");
      return;
    }

    if (!trimmed.includes("drive.google.com")) {
      setError("Link harus berupa tautan Google Drive yang valid (drive.google.com).");
      return;
    }

    setError("");
    updateMutation.mutate(trimmed);
  };

  const handleTestLink = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      toast.error("Masukkan link terlebih dahulu untuk menguji.");
      return;
    }
    try {
      new URL(trimmed);
      window.open(trimmed, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Format link tidak valid.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E01C20] text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Pengaturan Sistem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Kelola Link Guidebook
        </h1>
        <p className="text-sm text-muted-foreground">
          Tentukan tautan Google Drive buku panduan (guidebook) resmi MIA 2026. Tautan ini akan otomatis diterapkan ke seluruh tombol panduan di seluruh website.
        </p>
      </div>

      {/* Main Settings Card */}
      <Card className="bg-[#0F121A]/80 border-border/50 shadow-xl backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E01C20]/15 border border-[#E01C20]/30 flex items-center justify-center text-[#E01C20] flex-shrink-0">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                Tautan Google Drive Guidebook
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Pastikan folder atau dokumen di Google Drive sudah disetel ke publik ("Siapa saja yang memiliki link").
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="guidebook_url"
                className="text-xs sm:text-sm font-semibold text-foreground flex items-center justify-between"
              >
                <span>Link Google Drive <span className="text-[#E01C20]">*</span></span>
                {guidebookUrl && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-normal">
                    <CheckCircle2 className="h-3 w-3" />
                    Tersimpan Aktif
                  </span>
                )}
              </Label>

              <div className="relative">
                <Input
                  id="guidebook_url"
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={inputUrl}
                  disabled={isLoading || updateMutation.isPending}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (error) setError("");
                  }}
                  className="h-11 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-[#E01C20]"
                  required
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Contoh: <code className="text-cyan-400">https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m?usp=sharing</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading || updateMutation.isPending}
                className="mia-btn-primary h-11 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-md"
              >
                <Save className="h-4 w-4" />
                <span>
                  {updateMutation.isPending ? "Menyimpan..." : "Simpan Link Guidebook"}
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleTestLink}
                className="h-11 px-5 text-xs sm:text-sm rounded-xl border-border/50 text-foreground hover:bg-white/5 cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4 text-cyan-400" />
                <span>Uji Buka Tautan</span>
              </Button>
            </div>
          </form>

          {/* Implementation Notice Info Box */}
          <div className="p-4 rounded-xl bg-[#141824] border border-border/40 space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <HelpCircle className="h-4 w-4 text-[#FED700] flex-shrink-0" />
              <span>Otomatis Diterapkan ke Seluruh Titik Aplikasi:</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-[11px] leading-relaxed">
              <li>
                <strong>Beranda (Hero Banner):</strong> Tombol <em>"Lihat Guidebook"</em>.
              </li>
              <li>
                <strong>Halaman Kontak & Footer:</strong> Tombol <em>"Download Panduan"</em> dan tautan <em>"Panduan Lomba"</em>.
              </li>
              <li>
                <strong>Form Pendaftaran Lomba:</strong> Tombol <em>"Buka Guidebook Perlombaan"</em> di bawah field Link Drive Dokumen.
              </li>
              <li>
                <strong>Dashboard Peserta (Edit Data Tim):</strong> Tombol referensi guidebook dokumen pendaftaran.
              </li>
              <li>
                <strong>Halaman Detail Kategori:</strong> Sebagai tautan guidebook default jika kategori lomba belum memiliki guidebook khusus.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

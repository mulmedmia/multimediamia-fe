"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  User,
  Trophy,
  FileText,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Users,
  Mail,
  GitBranch,
  PlayCircle,
} from "lucide-react";
import YouTubePreview from "@/components/common/YouTubePreview";

export default function SubmissionDetailModal({ open, onClose, data }) {
  if (!data) return null;

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> APPROVED
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" /> PENDING
          </Badge>
        );
      case "REVISION":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" /> REVISION
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <XCircle className="h-3 w-3" /> REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs border-border/50">
            {status || "UNKNOWN"}
          </Badge>
        );
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getLinkTypeLabel = (type) => {
    switch (type?.toUpperCase()) {
      case "PROPOSAL":
        return "Draft Proposal (GDocs)";
      case "PRESENTATION":
        return "File Presentasi (Slides/Canva)";
      case "ORIGINALITY_STATEMENT":
        return "Surat Keterangan Orisinil (Materai 10k)";
      case "GITHUB":
        return "GitHub Utama";
      case "GITHUB_SECONDARY":
        return "GitHub Tambahan";
      case "DEPLOYMENT":
        return "Deployment / Live";
      case "FIGMA":
        return "Desain Figma";
      case "FIGMA_PROTOTYPE":
        return "Prototipe Figma";
      case "YOUTUBE":
        return "YouTube Demo";
      case "OTHER":
        return "Link Lainnya";
      default:
        return type || "Link";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
            <FileText className="h-5 w-5 text-[#E01C20]" />
            <span>Detail Submission Karya</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Informasi lengkap karya peserta, tautan repositori/demo, dan hasil penilaian juri.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Header Status & Score Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-[#0F121A] border border-border/40 rounded-xl">
            <div className="flex items-center gap-2.5">
              {getStatusBadge(data?.status)}
              {data?.is_verified ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Tampil di Show It
                </Badge>
              ) : (
                <Badge className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  Belum Tampil di Show It
                </Badge>
              )}
            </div>
          </div>

          {/* Grid Informasi Identitas & Info Lomba */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identitas Peserta */}
            <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 space-y-3">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
                <User className="h-4 w-4 text-[#E01C20]" />
                <span>Identitas Peserta & Tim</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <Label className="text-muted-foreground">Nama Peserta</Label>
                  <p className="font-semibold text-foreground mt-0.5">{data?.registration?.user?.name || data?.user?.name || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-muted-foreground/60" />
                    <span>{data?.registration?.user?.email || data?.user?.email || "-"}</span>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nama Tim</Label>
                  <p className="font-medium text-purple-400 mt-0.5">
                    {(data?.registration?.team_name || data?.team_name) ? (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 inline" /> {data?.registration?.team_name || data?.team_name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Individu</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Lomba & Proyek */}
            <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 space-y-3">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
                <Trophy className="h-4 w-4 text-[#E01C20]" />
                <span>Kompetisi & Karya</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <Label className="text-muted-foreground">Kategori Lomba</Label>
                  <p className="font-semibold text-foreground mt-0.5">
                    {data?.registration?.category?.category_name || data?.category?.category_name || "-"}
                  </p>
                </div>
                {data?.sub_theme && (
                  <div>
                    <Label className="text-muted-foreground">Sub-Tema</Label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data.sub_theme.split(',').map((st, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        >
                          {st.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Judul Karya / Proyek</Label>
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {data?.project_name || data?.title || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Waktu Pengumpulan</Label>
                  <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground/60" />
                    <span>{formatDateDisplay(data?.created_at)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Video Demo YouTube (Jika Ada) */}
          <YouTubePreview
            submission={data}
            title={`Video Karya ${data?.project_name || data?.title || "Peserta"}`}
            showFallback={false}
            className="rounded-xl border border-border/40 shadow-md"
          />

          {/* Deskripsi Proyek */}
          <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 space-y-2">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-1 border-b border-border/30">
              <FileText className="h-4 w-4 text-[#E01C20]" />
              <span>Deskripsi Proyek</span>
            </h3>
            <div className="p-3 bg-white/[0.02] border border-border/30 rounded-xl text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {data?.description || <span className="text-muted-foreground italic">Tidak ada deskripsi.</span>}
            </div>
          </div>

          {/* Flow Aplikasi (jika ada) */}
          {data?.flow_application && (
            <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 space-y-2">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-1 border-b border-border/30">
                <GitBranch className="h-4 w-4 text-[#E01C20]" />
                <span>Alur / Flow Aplikasi</span>
              </h3>
              <div className="p-3 bg-white/[0.02] border border-border/30 rounded-xl text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {data.flow_application}
              </div>
            </div>
          )}

          {/* Link Tautan Tambahan */}
          <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-1 border-b border-border/30">
              <Link2 className="h-4 w-4 text-[#E01C20]" />
              <span>Tautan Lampiran & Berkas Karya</span>
            </h3>
            {data?.links && data.links.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.links.map((link) => (
                  <div
                    key={link.id || link.link_id || link.url}
                    className="p-3 bg-white/[0.03] border border-border/30 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] bg-white/[0.06] px-2 py-0.5 rounded-md">
                        {getLinkTypeLabel(link.link_type || link.type)}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        <span>Buka</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate" title={link.url}>
                      {link.url}
                    </p>
                    {link.description && (
                      <p className="text-[11px] text-foreground/80 italic pt-0.5">
                        {link.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">Tidak ada tautan lampiran tambahan.</p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl text-xs text-muted-foreground hover:text-white"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

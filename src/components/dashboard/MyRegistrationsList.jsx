"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyRegistrations,
  deleteRegistration,
} from "@/services/competition.service.js";
import { getMySubmissions } from "@/services/submission.service";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  MessageSquare,
  Upload,
  FileText,
  Trash2,
  Calendar,
  Trophy,
  Clock,
  Zap,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formatDeadline = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function MyRegistrationsList({ onSelectRegistration }) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myRegistrations", user?.users_id],
    queryFn: () => getMyRegistrations(user.users_id),
    enabled: !!user?.users_id,
  });

  const { data: submissionsData } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: () => getMySubmissions(1, 100),
    enabled: !!user?.users_id,
  });

  const hasSubmissionForCategory = (categoryId) => {
    if (!submissionsData?.submissions) return false;
    return submissionsData.submissions.some(
      (submission) => submission.category_id === categoryId,
    );
  };

  const handleUploadSubmission = (registration) => {
    onSelectRegistration(registration, "upload");
  };

  const handleViewStatus = (registration) => {
    onSelectRegistration(registration, "status");
  };

  const deleteMutation = useMutation({
    mutationFn: deleteRegistration,
    onSuccess: () => {
      toast.success("Pendaftaran berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast.error(
        `Gagal menghapus pendaftaran: ${error.message || "Terjadi kesalahan"}`,
      );
      setDeleteConfirmId(null);
    },
  });

  const handleDeleteRegistration = (registrationId) => {
    deleteMutation.mutate(registrationId);
  };

  if (isLoading)
    return (
      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 w-full">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="mia-card p-7 sm:p-8 h-80 animate-pulse space-y-5"
          >
            <div className="h-7 w-2/3 bg-muted/50 rounded-lg"></div>
            <div className="h-5 w-1/2 bg-muted/50 rounded-lg"></div>
            <div className="h-28 bg-muted/30 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="mia-card p-8 sm:p-10 text-center space-y-2 max-w-xl">
        <p className="text-destructive font-semibold text-base sm:text-lg">
          Gagal memuat data pendaftaran.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Silakan muat ulang halaman atau coba beberapa saat lagi.
        </p>
      </div>
    );

  if (!registrations || registrations.length === 0) {
    return (
      <div className="mia-card p-10 sm:p-16 text-center !border-dashed space-y-5 max-w-xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Anda Belum Mendaftar
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pilih kategori lomba dan mulai berkompetisi sekarang! (Maksimal 2
            lomba per akun)
          </p>
        </div>
        <Link href="/#lomba">
          <Button className="mia-btn-primary h-11 rounded-full px-7 text-sm font-semibold cursor-pointer shadow-lg shadow-red-900/40 max-w-full truncate">
            Daftar dan Jadi Juara
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 w-full">
        {registrations?.map((reg) => {
          const hasSubmission = hasSubmissionForCategory(reg.category_id);
          const now = new Date();
          const prelimDate = reg.category?.preliminary_deadline
            ? new Date(reg.category.preliminary_deadline)
            : reg.category?.deadline
              ? new Date(reg.category.deadline)
              : null;
          const finalDate = reg.category?.final_deadline
            ? new Date(reg.category.final_deadline)
            : reg.category?.deadline
              ? new Date(reg.category.deadline)
              : null;

          const isPastPrelim = prelimDate ? now > prelimDate : false;
          const isPastFinal = finalDate ? now > finalDate : false;
          const isSubmissionOpen = reg.category?.is_submission_open !== false;
          const allowRevision = !!reg.category?.allow_revision;

          return (
            <div
              key={reg.registration_id}
              onClick={() => onSelectRegistration(reg)}
              className="mia-card p-7 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6 cursor-pointer hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-mia-bg/40"
            >
              <div className="space-y-5">
                {/* Header: Title & Badges */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">
                      {reg.category?.name || "Nama Lomba"}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium truncate">
                      {reg.team_name ? `Tim: ${reg.team_name}` : reg.user?.name}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className={cn(
                        "text-xs sm:text-sm px-3 py-1 rounded-full font-semibold border",
                        reg.is_verified
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-amber-500/15 border-amber-500/30 text-amber-400",
                      )}
                    >
                      {reg.is_verified
                        ? "Terverifikasi"
                        : "Belum Terverifikasi"}
                    </span>
                    {hasSubmission && (
                      <span className="text-xs sm:text-sm px-3 py-1 rounded-full font-semibold bg-sky-500/15 border border-sky-500/30 text-sky-400">
                        Karya Terupload
                      </span>
                    )}
                    {reg.category?.whatsapp_group_url && (
                      <a
                        href={reg.category.whatsapp_group_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Buka Grup WhatsApp Lomba"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Grup WA</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Registration Date & Gamification Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Terdaftar:{" "}
                      {new Date(reg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold text-xs">
                      <Zap className="w-3 h-3 fill-amber-400/40" />
                      {Number(reg.xp || 0).toLocaleString("id-ID")} XP
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-bold text-xs">
                      <span>💎</span>
                      {Number(reg.diamond || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Deadlines: Karya Sementara & Karya Final */}
                <div className="p-3.5 sm:p-4 bg-input/30 border border-border/40 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Batas Pengumpulan Karya
                    </span>
                    {!isSubmissionOpen ? (
                      <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                        Ditutup
                      </span>
                    ) : isPastFinal ? (
                      <span className="text-[11px] font-semibold text-muted-foreground bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                        Selesai
                      </span>
                    ) : isPastPrelim && !allowRevision ? (
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        Menunggu Revisi
                      </span>
                    ) : allowRevision ? (
                      <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                        Fase Perbaikan
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        Karya Sementara
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Karya Sementara */}
                    <div className="p-2.5 rounded-xl bg-[#0F121A]/80 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                        <span>Karya Sementara:</span>
                      </div>
                      <p
                        className={cn(
                          "font-semibold pl-3 text-xs sm:text-[13px]",
                          isPastPrelim
                            ? "text-muted-foreground line-through opacity-75"
                            : "text-foreground",
                        )}
                      >
                        {formatDeadline(prelimDate)}
                      </p>
                    </div>

                    {/* Karya Final */}
                    <div className="p-2.5 rounded-xl bg-[#0F121A]/80 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                        <span>Karya Final:</span>
                      </div>
                      <p
                        className={cn(
                          "font-semibold pl-3 text-xs sm:text-[13px]",
                          isPastFinal
                            ? "text-muted-foreground line-through opacity-75"
                            : "text-foreground",
                        )}
                      >
                        {formatDeadline(finalDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback Box - MIA Red Theme */}
                <div className="p-4 sm:p-5 bg-primary/10 border border-primary/25 rounded-2xl space-y-1.5 backdrop-blur-xs">
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-primary">
                        Feedback Panitia:
                      </p>
                      {reg.feedback ? (
                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed mt-1 font-normal break-words">
                          {reg.feedback}
                        </p>
                      ) : (
                        <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed mt-1">
                          Belum ada feedback. Feedback akan muncul setelah
                          pendaftaran Anda direview oleh panitia.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/40">
                {/* Subtle Hapus Action */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!reg.is_verified) {
                      setDeleteConfirmId(reg.registration_id);
                    }
                  }}
                  disabled={deleteMutation.isPending || reg.is_verified}
                  title={
                    reg.is_verified
                      ? "Pendaftaran yang sudah terverifikasi tidak dapat dihapus"
                      : "Hapus Pendaftaran"
                  }
                  className="h-10 px-4 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/40 hover:border-destructive/40 text-xs sm:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground disabled:hover:border-border/40 inline-flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>
                    {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                  </span>
                </Button>

                {/* Primary CTA Action */}
                {hasSubmission ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewStatus(reg);
                    }}
                    className="h-10 sm:h-11 flex-1 bg-sky-600/20 border border-sky-500/50 hover:bg-sky-600 hover:border-sky-400 text-sky-300 hover:text-white rounded-full px-5 text-xs sm:text-sm font-semibold shadow-md shadow-sky-950/40 cursor-pointer inline-flex items-center justify-center gap-2 transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Lihat Status</span>
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadSubmission(reg);
                    }}
                    disabled={!reg.is_verified}
                    className="h-10 sm:h-11 flex-1 mia-btn-primary rounded-full px-5 text-xs sm:text-sm font-semibold shadow-lg shadow-red-900/40 cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Karya</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(isOpen) => !isOpen && setDeleteConfirmId(null)}
      >
        <DialogContent className="w-[95vw] max-w-md bg-[#0F121A] border border-border/60 text-foreground rounded-2xl p-6 shadow-2xl space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive flex-shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Hapus Pendaftaran?
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-1">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus pendaftaran lomba ini? Tindakan
              ini tidak dapat dibatalkan dan semua data terkait akan hilang.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full border border-white/20 hover:border-white/40 bg-input/40 hover:bg-input text-foreground text-xs font-medium h-9 px-4 cursor-pointer transition-all"
                disabled={deleteMutation.isPending}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleDeleteRegistration(deleteConfirmId)}
              className="w-full sm:w-auto rounded-full bg-destructive text-white hover:bg-destructive/90 text-xs font-semibold h-9 px-4 cursor-pointer transition-all shadow-md shadow-red-900/30"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

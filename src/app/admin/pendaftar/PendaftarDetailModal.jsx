"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useFeedbackRegistration } from "@/hooks/admin-use-pendaftar";
import {
  Notebook,
  ExternalLink,
  Send,
  Users,
  User,
  Mail,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const pendaftarFeedbackSchema = z.object({
  feedback: z
    .string({
      required_error: "Feedback wajib diisi",
    })
    .trim()
    .min(3, "Feedback minimal 3 karakter")
    .max(400, "Feedback maksimal 400 karakter"),
});

// Helper function untuk parse team members
const parseTeamMembers = (teamMembersString) => {
  if (!teamMembersString) return [];
  try {
    const parsed =
      typeof teamMembersString === "string"
        ? JSON.parse(teamMembersString)
        : teamMembersString;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return teamMembersString
      .split(",")
      .map((member) => member.trim().replace(/['"[\]]/g, ""))
      .filter((member) => member.length > 0);
  }
};

export default function PendaftarDetailModal({ open, onClose, data }) {
  const feedbackMutation = useFeedbackRegistration();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pendaftarFeedbackSchema),
  });

  const handleSendFeedback = (formData) => {
    if (!data?.registration_id) return;
    feedbackMutation.mutate(
      { id: data.registration_id, feedback: formData.feedback },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  if (!data) return null;

  const members = parseTeamMembers(data.team_members);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-3xl sm:max-w-[40rem] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
            <Notebook className="h-5 w-5 text-[#E01C20]" />
            <span>Detail Pendaftaran</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Informasi lengkap data diri, berkas lomba, dan formulir feedback untuk peserta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Card: Informasi Utama */}
          <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
              <User className="h-4 w-4 text-[#E01C20]" />
              <span>Profil Peserta & Kompetisi</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Nama Peserta</Label>
                <p className="font-semibold text-foreground mt-0.5">{data.user?.name || "-"}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="break-all">{data.user?.email || "-"}</span>
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Kategori Lomba</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs border-border/50 bg-white/[0.02]">
                    {data.category?.category_name || "-"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Status Verifikasi</Label>
                <div className="mt-1">
                  <Badge
                    className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                      data.is_verified
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {data.is_verified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Terverifikasi
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" /> Belum Terverifikasi
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Nama Tim</Label>
                <p className="font-medium text-foreground mt-0.5">
                  {data.team_name ? (
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 inline" /> {data.team_name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">Individu</span>
                  )}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Waktu Registrasi</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.created_at
                    ? new Date(data.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) + " WIB"
                    : "-"}
                </p>
              </div>
            </div>

            {/* Anggota Tim Jika Ada */}
            {members.length > 0 && (
              <div className="pt-2 border-t border-border/30 space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  <span>Daftar Anggota Tim ({members.length})</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] border border-border/30 rounded-xl text-xs"
                    >
                      <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-foreground truncate">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Berkas Dokumen */}
            <div className="pt-2 border-t border-border/30">
              <Label className="text-xs text-muted-foreground block mb-2">Berkas / Lampiran Pendaftaran</Label>
              {data.file_url ? (
                <a
                  href={data.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Buka Berkas Pendaftaran</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              ) : (
                <p className="text-xs text-muted-foreground italic">Tidak ada file berkas yang dilampirkan.</p>
              )}
            </div>
          </div>

          {/* Card: Feedback Section */}
          <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
              <MessageSquare className="h-4 w-4 text-[#E01C20]" />
              <span>Feedback Admin</span>
            </h3>

            {data.feedback && (
              <div className="p-3.5 bg-white/[0.02] border border-border/40 rounded-xl space-y-1">
                <p className="text-xs text-muted-foreground">Catatan / Feedback Sebelumnya:</p>
                <p className="text-xs sm:text-sm text-foreground italic">&ldquo;{data.feedback}&rdquo;</p>
              </div>
            )}

            <form onSubmit={handleSubmit(handleSendFeedback)} className="space-y-3">
              <div>
                <Label htmlFor="feedback" className="text-xs text-muted-foreground">
                  Kirim Catatan / Evaluasi ke Peserta
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Tulis feedback perbaikan berkas atau catatan verifikasi untuk peserta..."
                  rows={3}
                  {...register("feedback")}
                  className={cn(
                    "mt-1.5 bg-input/40 border-border/50 rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
                    errors.feedback
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-border/50 focus-visible:border-ring focus-visible:ring-ring/50"
                  )}
                />
                {errors.feedback && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {errors.feedback.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={feedbackMutation.isPending}
                  className="rounded-xl text-xs text-muted-foreground hover:text-white"
                >
                  Tutup
                </Button>
                <Button
                  type="submit"
                  disabled={feedbackMutation.isPending}
                  className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  {feedbackMutation.isPending ? "Mengirim..." : "Kirim Feedback"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

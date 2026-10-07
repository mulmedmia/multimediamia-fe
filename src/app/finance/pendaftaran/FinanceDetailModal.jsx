"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Notebook,
  ExternalLink,
  Users,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Label } from "@/components/ui/label";

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

export default function FinanceDetailModal({ open, onClose, data }) {
  if (!data) return null;

  const members = parseTeamMembers(data.team_members);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "-";
    try {
      return (
        new Date(dateString).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      );
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-3xl sm:max-w-[40rem] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2.5 text-foreground">
            <Notebook className="h-5 w-5 text-[#E01C20]" />
            <span>Detail Pendaftaran & Pembayaran</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Rincian data peserta, berkas bukti transfer, dan status verifikasi pembayaran.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Card: Status Pembayaran Finance */}
          <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span>Status Verifikasi Finance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <Label className="text-xs text-muted-foreground">Status Bukti Bayar</Label>
                <div className="mt-1">
                  <Badge
                    className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                      data.is_verified_finance
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {data.is_verified_finance ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Pembayaran Valid
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" /> Menunggu Pengecekan
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Diverifikasi Oleh</Label>
                <p className="font-semibold text-foreground mt-0.5">
                  {data.verified_finance_by_name || "-"}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Waktu Verifikasi Finance</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateDisplay(data.verified_finance_at)}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Status Verifikasi Tim (Compe)</Label>
                <div className="mt-1">
                  <Badge
                    className={`text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                      data.is_verified
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {data.is_verified ? "Terverifikasi" : "Belum Verifikasi"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Catatan Finance */}
            {data.finance_notes && (
              <div className="pt-2 border-t border-border/30">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Catatan Finance</span>
                </Label>
                <p className="text-xs text-foreground bg-white/[0.02] p-2.5 rounded-lg border border-border/30">
                  {data.finance_notes}
                </p>
              </div>
            )}
          </div>

          {/* Card: Informasi Profil Peserta */}
          <div className="bg-[#0F121A]/90 border border-border/40 rounded-xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/30">
              <User className="h-4 w-4 text-[#E01C20]" />
              <span>Profil Peserta & Tim</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Nama Ketua / Akun</Label>
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
                <Label className="text-xs text-muted-foreground">Nomor WhatsApp</Label>
                <p className="font-medium text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {data.user?.whatsapp_number || data.user?.whatsapp ? (
                    <a
                      href={`https://wa.me/${(data.user?.whatsapp_number || data.user?.whatsapp).replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1"
                      title="Hubungi via WhatsApp"
                    >
                      <span>{data.user?.whatsapp_number || data.user?.whatsapp}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="italic text-muted-foreground/50">Belum diisi</span>
                  )}
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
                  {formatDateDisplay(data.created_at)}
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
                      className="flex items-center gap-2.5 p-2 bg-white/[0.03] border border-border/30 rounded-xl text-xs"
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

            {/* Berkas / Bukti Pembayaran */}
            <div className="pt-2 border-t border-border/30">
              <Label className="text-xs text-muted-foreground block mb-2">
                Berkas / Bukti Pembayaran Pendaftaran
              </Label>
              {data.file_url ? (
                <a
                  href={data.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Buka Berkas Bukti Pembayaran (Google Drive)</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Tidak ada berkas bukti pembayaran yang dilampirkan.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

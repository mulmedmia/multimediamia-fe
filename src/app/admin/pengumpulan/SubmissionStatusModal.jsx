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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SubmissionStatusModal({
  open,
  onClose,
  data,
  status,
  setStatus,
  is_verified,
  setIsVerified,
  onSubmit,
  isLoading,
}) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-center text-foreground">
            Update Status Submission
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center">
            Perbarui status kelayakan karya dan izin penayangan di Show It.
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Karya */}
        <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-1.5 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Judul Karya:</span>
            <span className="font-semibold text-foreground truncate max-w-[200px]">
              {data.project_name || data.title || "-"}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Peserta / Tim:</span>
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {data.registration?.team_name || data.team_name || data.registration?.user?.name || data.user?.name || "-"}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-muted-foreground">Kategori:</span>
            <span className="text-muted-foreground">
              {data.registration?.category?.category_name || data.category?.category_name || "-"}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs text-muted-foreground font-medium">
              Status Evaluasi Karya
            </Label>
            <Select
              value={status}
              onValueChange={(val) => {
                setStatus(val);
                if (val !== "APPROVED") {
                  setIsVerified(false);
                }
              }}
            >
              <SelectTrigger className="h-10 bg-input/40 border-border/50 rounded-xl text-xs text-foreground">
                <SelectValue placeholder="Pilih status karya" />
              </SelectTrigger>
              <SelectContent className="bg-[#141824] border-border/50 text-foreground">
                <SelectItem value="PENDING">PENDING (Menunggu Evaluasi)</SelectItem>
                <SelectItem value="APPROVED">APPROVED (Disetujui / Lolos)</SelectItem>
                <SelectItem value="REVISION">REVISION (Perlu Perbaikan)</SelectItem>
                <SelectItem value="REJECTED">REJECTED (Ditolak)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className={`flex items-start space-x-3 p-3 rounded-xl border transition-colors ${
              status === "APPROVED"
                ? "bg-white/[0.02] border-border/30"
                : "bg-white/[0.01] border-border/20 opacity-60"
            }`}
          >
            <Checkbox
              id="verified"
              checked={status === "APPROVED" && Boolean(is_verified)}
              onCheckedChange={(checked) => {
                if (status === "APPROVED") {
                  setIsVerified(Boolean(checked));
                }
              }}
              disabled={status !== "APPROVED"}
              className="mt-0.5 rounded-md border-border/60 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 disabled:cursor-not-allowed"
            />
            <div className="space-y-1">
              <Label
                htmlFor="verified"
                className={`text-xs text-muted-foreground leading-relaxed select-none ${
                  status === "APPROVED" ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                <span className="text-foreground font-medium block">
                  Tampilkan di Show It
                </span>
                Izinkan karya ini tampil pada galeri pameran publik Show It.
              </Label>
              {status !== "APPROVED" && (
                <p className="text-[11px] text-amber-400 font-medium">
                  * Hanya dapat diaktifkan jika status evaluasi karya adalah APPROVED.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl text-xs text-muted-foreground hover:text-white"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#FF5722] to-[#E01C20] hover:from-[#e04515] hover:to-[#c4181c] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

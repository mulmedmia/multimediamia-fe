"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVerifyRegistration } from "@/hooks/admin-use-pendaftar";
import { CheckCircle2, AlertCircle, XCircle, UserCheck } from "lucide-react";

export default function PendaftarVerifyModal({ open, onClose, data }) {
  const verifyMutation = useVerifyRegistration();

  const handleVerify = (is_verified) => {
    if (!data?.registration_id) return;
    verifyMutation.mutate(
      { id: data.registration_id, is_verified },
      { onSuccess: () => onClose() }
    );
  };

  if (!data) return null;

  const isAlreadyVerified = Boolean(data.is_verified);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0D14] border border-border/50 text-[#FFF9F5] max-w-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              isAlreadyVerified
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            }`}
          >
            {isAlreadyVerified ? (
              <AlertCircle className="h-6 w-6" />
            ) : (
              <UserCheck className="h-6 w-6" />
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-center text-foreground">
            {isAlreadyVerified ? "Batalkan Verifikasi Pendaftar" : "Verifikasi Pendaftar"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center">
            {isAlreadyVerified
              ? "Status pendaftar akan dikembalikan menjadi Belum Verifikasi."
              : "Verifikasi pendaftar ini untuk mengonfirmasi kelengkapan berkas dan keikutsertaan kompetisi."}
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Data Pendaftar */}
        <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Nama Peserta:</span>
            <span className="font-semibold text-foreground">{data.user?.name || "-"}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Email:</span>
            <span className="text-muted-foreground">{data.user?.email || "-"}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Kategori Lomba:</span>
            <span className="font-medium text-foreground">
              {data.category?.category_name || "-"}
            </span>
          </div>
          {data.team_name && (
            <div className="flex justify-between items-center py-0.5 border-b border-border/20">
              <span className="text-muted-foreground">Nama Tim:</span>
              <span className="font-medium text-purple-400">{data.team_name}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Status Finance:</span>
            <Badge
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                data.is_verified_finance
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {data.is_verified_finance ? "Pembayaran Valid" : "Belum Dicek"}
            </Badge>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-muted-foreground">Status Tim:</span>
            <Badge
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                isAlreadyVerified
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {isAlreadyVerified ? "Terverifikasi" : "Belum Terverifikasi"}
            </Badge>
          </div>
        </div>

        {/* Warning if finance has not verified payment yet */}
        {!isAlreadyVerified && !data.is_verified_finance && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              <strong>Perhatian:</strong> Bukti pembayaran tim ini belum diverifikasi oleh tim Finance. Pastikan pembayaran telah terkonfirmasi sebelum memverifikasi tim.
            </span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={verifyMutation.isPending}
            className="rounded-xl text-xs text-muted-foreground hover:text-white"
          >
            Batal
          </Button>
          {isAlreadyVerified ? (
            <Button
              type="button"
              onClick={() => handleVerify(false)}
              disabled={verifyMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              {verifyMutation.isPending ? "Memproses..." : "Batalkan Verifikasi"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleVerify(true)}
              disabled={verifyMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {verifyMutation.isPending ? "Memproses..." : "Konfirmasi Verifikasi"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
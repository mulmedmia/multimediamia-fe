"use client";

import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFinanceVerifyRegistration } from "@/hooks/admin-use-pendaftar";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  ExternalLink,
  CreditCard,
  MessageSquare,
} from "lucide-react";

export default function FinanceVerifyModal({ open, onClose, data }) {
  const verifyMutation = useFinanceVerifyRegistration();
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (data) {
      setNotes(data.finance_notes || "");
    }
  }, [data]);

  const handleVerify = (is_verified_finance) => {
    if (!data?.registration_id) return;
    verifyMutation.mutate(
      {
        id: data.registration_id,
        is_verified_finance,
        finance_notes: notes,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  if (!data) return null;

  const isAlreadyVerified = Boolean(data.is_verified_finance);

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
            <CreditCard className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-center text-foreground">
            {isAlreadyVerified
              ? "Batalkan Verifikasi Pembayaran"
              : "Verifikasi Bukti Pembayaran"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center">
            {isAlreadyVerified
              ? "Status verifikasi pembayaran akan dibatalkan menjadi belum dicek."
              : "Tandai bahwa bukti pembayaran peserta ini sudah dicek oleh tim Finance dan dinyatakan valid."}
          </DialogDescription>
        </DialogHeader>

        {/* Ringkasan Data Pendaftar */}
        <div className="p-3.5 bg-[#0F121A] border border-border/40 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-border/20">
            <span className="text-muted-foreground">Nama Peserta:</span>
            <span className="font-semibold text-foreground">
              {data.user?.name || "-"}
            </span>
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
            <span className="text-muted-foreground">Status Finance Saat Ini:</span>
            <Badge
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                isAlreadyVerified
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {isAlreadyVerified ? "Pembayaran Valid" : "Belum Dicek"}
            </Badge>
          </div>

          {/* Quick link bukti berkas/pembayaran */}
          <div className="pt-1.5 flex items-center justify-between">
            <span className="text-muted-foreground">Bukti Pembayaran:</span>
            {data.file_url ? (
              <a
                href={data.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 font-medium"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Buka Berkas / Bukti</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-muted-foreground italic">Tidak ada berkas</span>
            )}
          </div>
        </div>

        {/* Input Catatan Finance */}
        <div className="space-y-1.5">
          <Label htmlFor="finance-notes" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-[#E01C20]" />
            <span>Catatan Finance (Opsional)</span>
          </Label>
          <Textarea
            id="finance-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Transfer BCA a.n. John Doe Rp 150.000 valid..."
            className="w-full bg-[#0F121A] border-border/50 text-xs rounded-xl p-3 placeholder:text-muted-foreground/50 resize-none focus:border-[#E01C20] focus:ring-1 focus:ring-[#E01C20]"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={verifyMutation.isPending}
            className="rounded-xl text-xs text-muted-foreground hover:text-white cursor-pointer"
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
              {verifyMutation.isPending ? "Memproses..." : "Konfirmasi Pembayaran Valid"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

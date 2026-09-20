"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamForm } from "@/components/forms/TeamForm";
import { useUpdateRegistration } from "@/hooks/user-use-registration";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function EditTeamModal({ open, onClose, registration }) {
  const updateMutation = useUpdateRegistration();

  const handleClose = () => {
    onClose();
  };

  const isVerified = Boolean(registration?.is_verified);

  const handleSubmit = (data) => {
    if (isVerified) {
      toast.warning("Tidak dapat mengedit tim!", {
        description: "Data tim sudah terverifikasi dan tidak dapat diubah.",
      });
      return;
    }

    const payload = {
      team_name: data.team_name,
      team_members: data.team_members,
    };

    if (data.file_url && data.file_url.trim() !== "") {
      payload.file_url = data.file_url;
    }

    updateMutation.mutate(
      {
        registrationId: registration.registration_id,
        data: payload,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#0F121A] border border-border/50 rounded-2xl text-foreground p-6 sm:p-7 shadow-2xl space-y-4 selection:bg-primary selection:text-white"
      >
        <DialogHeader className="pb-3 border-b border-border/40 space-y-1">
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Edit Data Tim
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isVerified
              ? "Status pendaftaran tim Anda sudah diverifikasi oleh panitia."
              : "Perbarui nama tim, anggota tim, atau link dokumen persyaratan."}
          </DialogDescription>
        </DialogHeader>

        {isVerified && (
          <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-400" />
            <span>
              Status tim Anda sudah <strong>Terverifikasi</strong>. Data tim telah dikunci dan tidak dapat diubah lagi.
            </span>
          </div>
        )}

        <TeamForm
          registration={registration}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isPending={updateMutation.isPending}
          disabled={isVerified}
        />
      </DialogContent>
    </Dialog>
  );
}

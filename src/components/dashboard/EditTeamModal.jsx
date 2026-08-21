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

export function EditTeamModal({ open, onClose, registration }) {
  const updateMutation = useUpdateRegistration();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (data) => {
    const namesArray = data.team_members
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    const formattedTeamMembers = `['${namesArray.join("', '")}']`;

    const payload = {
      team_name: data.team_name,
      team_members: formattedTeamMembers,
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
            Perbarui nama tim, anggota tim, atau link dokumen persyaratan.
          </DialogDescription>
        </DialogHeader>

        <TeamForm
          registration={registration}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isPending={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

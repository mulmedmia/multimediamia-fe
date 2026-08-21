"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubmissionForm } from "@/components/forms/SubmissionForm";

export function EditSubmissionModal({
  open,
  onClose,
  registrationId,
  editingSubmission,
}) {
  const queryClient = useQueryClient();

  const handleClose = () => {
    onClose();
  };

  if (!editingSubmission) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0F121A] border border-border/50 rounded-2xl text-foreground p-6 sm:p-7 shadow-2xl space-y-4 selection:bg-primary selection:text-white"
      >
        <DialogHeader className="pb-3 border-b border-border/40 space-y-1">
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Edit Submission
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Perbarui data karya dan tautan berkas yang telah Anda unggah.
          </DialogDescription>
        </DialogHeader>

        <SubmissionForm
          registrationId={registrationId}
          editingSubmission={editingSubmission}
          onSuccess={() => {
            handleClose();
            queryClient.invalidateQueries(["mySubmissions"]);
          }}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}

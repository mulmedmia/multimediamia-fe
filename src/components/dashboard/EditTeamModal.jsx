"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRegistration } from "@/hooks/user-use-registration";
import { useRouter } from "next/navigation";

// Schema validasi
const editTeamSchema = z.object({
  team_name: z.string().min(1, "Nama tim wajib diisi"),
  team_members: z.string().min(1, "Anggota tim wajib diisi"),
  file_url: z
    .string()
    .url("Format URL tidak valid")
    .optional()
    .or(z.literal("")),
});

export function EditTeamModal({ open, onClose, registration }) {
  const updateMutation = useUpdateRegistration();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editTeamSchema),
  });

  // Set default values ketika modal dibuka
  useEffect(() => {
    if (open && registration) {
      // Parse team members dari format ['name1', 'name2'] ke "name1, name2"
      let teamMembersDisplay = "";
      if (registration.team_members) {
        try {
          const parsed = JSON.parse(registration.team_members);
          if (Array.isArray(parsed)) {
            teamMembersDisplay = parsed.join(", ");
          }
        } catch (e) {
          // Jika gagal parse sebagai JSON, coba split berdasarkan koma
          teamMembersDisplay = registration.team_members
            .replace(/[\[\]']/g, "")
            .split(",")
            .map((name) => name.trim())
            .join(", ");
        }
      }

      reset({
        team_name: registration.team_name || "",
        team_members: teamMembersDisplay,
        file_url: registration.file_url || "",
      });
    }
  }, [open, registration, reset]);

  const onSubmit = (data) => {
    // Format team_members kembali ke format ['name1', 'name2']
    const namesArray = data.team_members
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    const formattedTeamMembers = `['${namesArray.join("', '")}']`;

    const payload = {
      team_name: data.team_name,
      team_members: formattedTeamMembers,
    };

    // Hanya kirim file_url jika ada
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
          onClose();
          reset();
        },
      },
    );
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Data Tim</DialogTitle>
          <DialogDescription>
            Perbarui nama tim, anggota tim, atau link dokumen persyaratan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Tim */}
          <div className="space-y-2">
            <Label htmlFor="team_name">Nama Tim *</Label>
            <Input
              id="team_name"
              placeholder="Masukkan nama tim"
              {...register("team_name")}
            />
            {errors.team_name && (
              <p className="text-xs text-red-500">{errors.team_name.message}</p>
            )}
          </div>

          {/* Anggota Tim */}
          <div className="space-y-2">
            <Label htmlFor="team_members">Anggota Tim *</Label>
            <Textarea
              id="team_members"
              placeholder="contoh: Asep, Kakang, Solihin"
              rows={3}
              {...register("team_members")}
            />
            <p className="text-xs text-muted-foreground">
              Pisahkan setiap nama dengan koma ( , ).
            </p>
            {errors.team_members && (
              <p className="text-xs text-red-500">
                {errors.team_members.message}
              </p>
            )}
          </div>

          {/* File URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="file_url">Link Drive Dokumen (Opsional)</Label>
            <Input
              id="file_url"
              placeholder="https://drive.google.com/..."
              {...register("file_url")}
            />
            <p className="text-xs text-muted-foreground">
              Update link dokumen persyaratan jika diperlukan.
            </p>
            {errors.file_url && (
              <p className="text-xs text-red-500">{errors.file_url.message}</p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

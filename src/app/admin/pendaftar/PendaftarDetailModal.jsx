"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeedbackRegistration } from "@/hooks/admin-use-pendaftar";
import { ExternalLink, Send } from "lucide-react";
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
    // Coba parse sebagai JSON array
    const parsed = JSON.parse(teamMembersString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // Jika gagal, coba split berdasarkan koma dan bersihkan karakter
    return teamMembersString
      .split(",")
      .map((member) => member.trim().replace(/['"\[\]]/g, ""))
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
    feedbackMutation.mutate(
      { id: data.registration_id, feedback: formData.feedback },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      },
    );
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detail Pendaftar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informasi Pendaftar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Pendaftar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nama Lengkap
                  </Label>
                  <p className="font-medium">{data.user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email
                  </Label>
                  <p className="font-medium">{data.user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Kategori
                  </Label>
                  <div>
                    <Badge variant="outline">
                      {data.category?.category_name}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nama Tim
                  </Label>
                  <p className="font-medium">{data.team_name || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Anggota Tim
                  </Label>
                  <div className="mt-1">
                    {(() => {
                      const members = parseTeamMembers(data.team_members);

                      return members.length > 0 ? (
                        <div className="space-y-2">
                          {members.map((member, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                            >
                              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                {idx + 1}
                              </span>
                              <span className="text-sm flex-1">{member}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">-</p>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status Verifikasi
                  </Label>
                  <div>
                    <Badge variant={data.is_verified ? "default" : "secondary"}>
                      {data.is_verified
                        ? "Terverifikasi"
                        : "Belum Terverifikasi"}
                    </Badge>
                  </div>
                </div>
              </div>

              {data.file_url && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    File Dokumen
                  </Label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={data.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Lihat File
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Feedback untuk Pendaftar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.feedback && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Feedback Sebelumnya
                  </Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{data.feedback}</p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit(handleSendFeedback)}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="feedback"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Kirim Feedback Baru
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tulis feedback untuk pendaftar..."
                    rows={4}
                    {...register("feedback")}
                    className={cn(
                      "mt-1",
                      errors.feedback &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                  />
                  {errors.feedback && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      {errors.feedback.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={feedbackMutation.isPending}
                  >
                    Tutup
                  </Button>
                  <Button type="submit" disabled={feedbackMutation.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    {feedbackMutation.isPending
                      ? "Mengirim..."
                      : "Kirim Feedback"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

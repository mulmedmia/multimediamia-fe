"use client";

import React, { useState } from "react";
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
  const [feedback, setFeedback] = useState(data?.feedback || "");
  const feedbackMutation = useFeedbackRegistration();

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;

    feedbackMutation.mutate(
      { id: data.registration_id, feedback },
      {
        onSuccess: () => {
          onClose();
          setFeedback("");
        },
      }
    );
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Lengkap
                  </label>
                  <p className="font-medium">{data.user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="font-medium">{data.user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Kategori
                  </label>
                  <div>
                    <Badge variant="outline">
                      {data.category?.category_name}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Tim
                  </label>
                  <p className="font-medium">{data.team_name || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Anggota Tim
                  </label>
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Status Verifikasi
                  </label>
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
                  <label className="text-sm font-medium text-muted-foreground">
                    File Dokumen
                  </label>
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Feedback Sebelumnya
                  </label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{data.feedback}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Kirim Feedback Baru
                </label>
                <Textarea
                  placeholder="Tulis feedback untuk pendaftar..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={feedbackMutation.isPending}
                >
                  Tutup
                </Button>
                <Button
                  onClick={handleSendFeedback}
                  disabled={!feedback.trim() || feedbackMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {feedbackMutation.isPending
                    ? "Mengirim..."
                    : "Kirim Feedback"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

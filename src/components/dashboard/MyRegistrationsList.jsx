"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyRegistrations,
  deleteRegistration,
} from "@/services/competition.service.js";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { LayoutDashboard, AlertTriangle, MessageSquare } from "lucide-react";

export function MyRegistrationsList({ onSelectRegistration }) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: registrations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myRegistrations", user?.users_id],
    queryFn: () => getMyRegistrations(user.users_id),
    enabled: !!user?.users_id,
  });

  const handleUploadSubmission = (registration) => {
    // Pilih registration dan arahkan ke tab upload
    onSelectRegistration(registration, "upload"); // Tambahkan parameter tab
  };

  // Mutation untuk menghapus registrasi
  const deleteMutation = useMutation({
    mutationFn: deleteRegistration,
    onSuccess: () => {
      toast.success("Pendaftaran berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast.error(
        `Gagal menghapus pendaftaran: ${error.message || "Terjadi kesalahan"}`
      );
      setDeleteConfirmId(null);
    },
  });

  const handleDeleteRegistration = (registrationId) => {
    deleteMutation.mutate(registrationId);
  };

  const handleViewDashboard = (registrationId) => {
    router.push(`/dashboard/${registrationId}`);
  };

  if (isLoading)
    return (
      <p className="text-center text-muted-foreground">
        Memuat riwayat pendaftaran...
      </p>
    );
  if (isError)
    return (
      <p className="text-center text-red-500">Gagal memuat data pendaftaran.</p>
    );

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">
          Anda belum mendaftar lomba apapun.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {registrations?.map((reg) => (
          <Card
            key={reg.registration_id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => onSelectRegistration(reg)} // Default ke tab beranda
          >
            <div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="pr-2">
                    {reg.category?.name || "Nama Lomba"}
                  </span>
                  <Badge
                    variant={reg.is_verified ? "success" : "secondary"}
                    className={
                      reg.is_verified
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }
                  >
                    {reg.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {reg.team_name ? `Tim: ${reg.team_name}` : reg.user.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Terdaftar pada:{" "}
                  {new Date(reg.created_at).toLocaleDateString("id-ID")}
                </p>

                {/* Feedback Box - Selalu tampil */}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Feedback:
                      </p>
                      {reg.feedback ? (
                        <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                          {reg.feedback}
                        </p>
                      ) : (
                        <p className="text-xs text-blue-500 dark:text-blue-400 leading-relaxed italic">
                          Belum ada feedback. Feedback akan muncul setelah
                          dilakukan review terhadap pendaftaran Anda.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
            <CardFooter className="flex justify-between gap-2 w-full">
              {/* Tombol Hapus */}
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah klik tombol memicu klik pada card
                  setDeleteConfirmId(reg.registration_id);
                }}
                className="flex-1"
                disabled={deleteMutation.isPending}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
              </Button>

              {/* Tombol Upload Karya */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadSubmission(reg);
                }}
                disabled={!reg.is_verified}
                className="flex-1"
              >
                Upload Karya
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(isOpen) => !isOpen && setDeleteConfirmId(null)}
      >
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                Konfirmasi Hapus
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus pendaftaran lomba ini? Tindakan
              ini tidak dapat dibatalkan dan semua data terkait akan hilang.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                disabled={deleteMutation.isPending}
              >
                Tidak, Batal
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleDeleteRegistration(deleteConfirmId)}
              className="w-full sm:w-auto"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

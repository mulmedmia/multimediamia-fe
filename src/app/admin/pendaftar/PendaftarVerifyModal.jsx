"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVerifyRegistration } from "@/hooks/admin-use-pendaftar";
import { CheckCircle, XCircle } from "lucide-react";

export default function PendaftarVerifyModal({ open, onClose, data }) {
  const verifyMutation = useVerifyRegistration();

  const handleVerify = (is_verified) => {
    verifyMutation.mutate(
      { id: data.registration_id, is_verified },
      { onSuccess: () => onClose() }
    );
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Verifikasi Pendaftar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nama:</span>
              <p className="font-medium">{data.user?.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <p className="font-medium">{data.user?.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Kategori:</span>
              <div className="mt-1">
                <Badge variant="outline">{data.category?.category_name}</Badge>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Status Saat Ini:</span>
              <div className="mt-1">
                <Badge variant={data.is_verified ? "default" : "secondary"}>
                  {data.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={verifyMutation.isPending}
            >
              Batal
            </Button>
            {data.is_verified ? (
              <Button
                variant="destructive"
                onClick={() => handleVerify(false)}
                disabled={verifyMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {verifyMutation.isPending ? "Memproses..." : "Batalkan Verifikasi"}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => handleVerify(true)}
                disabled={verifyMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {verifyMutation.isPending ? "Memproses..." : "Verifikasi"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
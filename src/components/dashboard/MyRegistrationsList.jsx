"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyRegistrations } from "@/services/competition.service.js";
import { useAuthContext } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { LayoutDashboard } from "lucide-react";

const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'destructive';
    default: return 'secondary';
  }
};

export function MyRegistrationsList({ onSelectRegistration }) {
  const [openDialogId, setOpenDialogId] = useState(null);
  const { user } = useAuthContext(); 

  const { data: registrations, isLoading, isError } = useQuery({
    queryKey: ['myRegistrations', user?.users_id],
    queryFn: () => getMyRegistrations(user.users_id),
    enabled: !!user?.users_id, 
  });

  if (isLoading) return <p className="text-center text-muted-foreground">Memuat riwayat pendaftaran...</p>;
  if (isError) return <p className="text-center text-red-500">Gagal memuat data pendaftaran.</p>;

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Anda belum mendaftar lomba apapun.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {registrations.map((reg) => (
        <Card key={reg.registration_id} className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="pr-2">{reg.category?.name || "Nama Lomba"}</span>
                <Badge variant={getStatusVariant(reg.status)}>{reg.status || "PENDING"}</Badge>
              </CardTitle>
              <CardDescription>Tim: {reg.team_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Terdaftar pada: {new Date(reg.created_at).toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </div>
          {/* --- PERBAIKAN LAYOUT DI SINI --- */}
          <CardFooter className="flex justify-between gap-2">
            {/* Menghapus `w-full` agar tombol tidak memenuhi lebar */}
            <Button variant="outline" onClick={() => onSelectRegistration(reg)}>
              <LayoutDashboard className="mr-2 h-4 w-4"/>
              Dashboard
            </Button>
            <Dialog 
              open={openDialogId === reg.registration_id} 
              onOpenChange={(isOpen) => !isOpen && setOpenDialogId(null)}
            >
              <DialogTrigger asChild>
                {/* Menghapus `w-full` agar tombol tidak memenuhi lebar */}
                <Button onClick={() => setOpenDialogId(reg.registration_id)} disabled={reg.status !== 'APPROVED'}>
                  Upload Karya
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Karya untuk {reg.category?.name}</DialogTitle>
                </DialogHeader>
                <SubmissionForm
                  registrationId={reg.registration_id}
                  onSuccess={() => setOpenDialogId(null)}
                />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

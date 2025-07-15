"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyRegistrations } from "@/services/competition.service.js";
import { useAuthContext } from "@/providers/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'destructive';
    default: return 'secondary';
  }
};

export function MyRegistrationsList() {
    const { user } = useAuthContext();

  const { data: registrations, isLoading, isError } = useQuery({
    queryKey: ['myRegistrations', user?.id],
    queryFn: () => getMyRegistrations(user.id),
  });

  if (isLoading) return <p className="text-center">Memuat riwayat...</p>;
  if (isError) return <p className="text-center text-red-500">Gagal memuat data.</p>;

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Anda belum mendaftar lomba apapun.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {registrations.map((reg) => (
        <Card key={reg.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{reg.category?.name || "Nama Lomba"}</span>
              <Badge variant={getStatusVariant(reg.status)}>{reg.status || "PENDING"}</Badge>
            </CardTitle>
            <CardDescription>Tim: {reg.team_name}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, submitCompetitionRegistration } from "@/services/competition.service.js";
import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registrationSchema = z.object({
  team_name: z.string().min(3, "Nama tim minimal 3 karakter."),
  category_id: z.string({ required_error: "Anda harus memilih kategori." }),
  file_url: z.string().url({ message: "Harap masukkan link Google Drive yang valid." }),
});

export function CompetitionRegistrationForm() {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const mutation = useMutation({
    mutationFn: submitCompetitionRegistration,
    onSuccess: () => {
      alert("Pendaftaran berhasil!");
      reset();
      queryClient.invalidateQueries({ queryKey: ['myRegistrations', user?.users_id] });
    },
    onError: (error) => {
      const errorMessage = error.errors?.user_id?._errors[0] || error.message || 'Terjadi kesalahan';
      alert(`Gagal: ${errorMessage}`);
    },
  });

  const onSubmit = (data) => {
    if (!user || !user.users_id) {
        alert("Sesi pengguna tidak ditemukan. Silakan coba login ulang.");
        return;
    }

    const submissionData = {
      ...data,
      user_id: user.users_id, 
    };
    
    mutation.mutate(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="team_name">Nama Tim</Label>
        <Input id="team_name" placeholder="Tim Koding Keren" {...register("team_name")} />
        {errors.team_name && <p className="text-xs text-red-500">{errors.team_name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Pilih Kategori</Label>
        <Controller name="category_id" control={control} render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full" disabled={catLoading}>
              <SelectValue placeholder={catLoading ? "Memuat..." : "-- Pilih --"} />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) ? (
                categories.map((cat) => (
                  <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <p className="p-2 text-xs text-muted-foreground">
                  Gagal memuat pilihan kategori.
                </p>
              )}
            </SelectContent>
          </Select>
        )}/>
        {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file_url">Link Bukti Pendaftaran (Google Drive)</Label>
        <Input id="file_url" placeholder="https://drive.google.com/..." {...register("file_url")} />
        {errors.file_url && <p className="text-xs text-red-500">{errors.file_url.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Mendaftarkan..." : "Daftar Lomba"}
      </Button>
    </form>
  );
}

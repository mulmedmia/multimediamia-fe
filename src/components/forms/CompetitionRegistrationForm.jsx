"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, submitCompetitionRegistration } from "@/services/competition.service.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const registrationSchema = z.object({
  team_name: z.string().min(3, "Nama tim minimal 3 karakter."),
  category_id: z.string({ required_error: "Anda harus memilih kategori." }),
});

export function CompetitionRegistrationForm() {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
    },
    onError: (error) => alert(`Gagal: ${error.message}`),
  });

  const onSubmit = (data) => mutation.mutate(data);

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
            <SelectTrigger disabled={catLoading}>
              <SelectValue placeholder={catLoading ? "Memuat..." : "-- Pilih --"} />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(categories) ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
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
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Mendaftarkan..." : "Daftar Lomba"}
      </Button>
    </form>
  );
}
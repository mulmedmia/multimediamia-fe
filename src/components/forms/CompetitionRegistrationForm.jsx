"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  submitCompetitionRegistration,
} from "@/services/competition.service.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/hooks/use-auth";

const registrationSchema = z
  .object({
    team_name: z.string().optional(),
    category_id: z
      .string({ required_error: "Anda harus memilih kategori." })
      .min(1, "Kategori harus dipilih."),
    file_url: z
      .string()
      .url({ message: "Harap masukkan URL Google Drive yang valid!" }),
    team_members: z.string().optional(),
    selected_category_type: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isTeam = data.selected_category_type === "TEAM";
    if (isTeam) {
      if (!data.team_name || data.team_name.length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Nama tim minimal 3 karakter.",
          path: ["team_name"],
        });
      }
      if (!data.team_members || data.team_members.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Anggota tim tidak boleh kosong.",
          path: ["team_members"],
        });
      }
    }
  });

export function CompetitionRegistrationForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();

  // Asumsi 'getCategories' dapat mengembalikan array Individual dan Team [{id, name, team_type: 'Individual' | 'Team' }]
  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      category_id: "",
      file_url: "",
      team_name: "",
      team_members: "",
      selected_category_type: "",
    },
  });

  const selectedCategoryType = watch("selected_category_type");

  const mutation = useMutation({
    mutationFn: submitCompetitionRegistration,
    onSuccess: () => {
      alert("Pendaftaran berhasil!");
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      reset();
    },
    onError: (error) => alert(`Gagal: ${error.message}`),
  });

  if (isLoading) {
    return (
        <p className="ml-2">Memvalidasi sesi Anda...</p>
    );
  }
  
  const onSubmit = (data) => {
    // Payload sesuai backend
    if (!user || !user.users_id) {
      alert("Sesi Anda telah berakhir. Harap login kembali.");
      return;
    }

    const payload = {
      user_id: user.users_id, // Ambil id dari objek user
      category_id: data.category_id,
      file_url: data.file_url,
    };

    if (selectedCategoryType === "TEAM") {
      payload.team_name = data.team_name;
      const membersArray = data.team_members
        .split(",")
        .map((name) => name.trim());
      payload.team_members = membersArray;
    }

    // Panggil mutation dengan payload
    mutation.mutate(payload);
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories?.find(
      (cat) => cat.category_id === value
    );
    const type = selectedCategory?.team_type || null;

    setValue("category_id", value);
    setValue("selected_category_type", type, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pilih Kategori */}
      <div className="space-y-2">
        <Label>Pilih Kategori</Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={handleCategoryChange}
              defaultValue={field.value}
            >
              <SelectTrigger disabled={catLoading}>
                <SelectValue
                  placeholder={
                    catLoading ? "Memuat..." : "-- Pilih Kategori --"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <SelectItem
                      key={cat.category_id}
                      value={String(cat.category_id)}
                    >
                      {cat.category_name} ({cat.team_type})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category_id && (
          <p className="text-xs text-red-500">{errors.category_id.message}</p>
        )}
      </div>
      {/* Input URL Google Drive */}
      <div className="space-y-2">
        <Label htmlFor="file_url">URL Google Drive</Label>
        <Input
          id="file_url"
          placeholder="https://drive.google.com/..."
          {...register("file_url")}
        />
        {errors.file_url && (
          <p className="text-xs text-red-500">{errors.file_url.message}</p>
        )}
      </div>

      {/* -- Form untuk Tim */}
      {selectedCategoryType === "GROUP" && (
        <>
          {/* Pilih nama Tim */}
          <div className="space-y-2">
            <Label htmlFor="team_name">Nama Tim</Label>
            <Input
              id="team_name"
              placeholder="Tim Koding Keren"
              {...register("team_name")}
            />
            {errors.team_name && (
              <p className="text-xs text-red-500">{errors.team_name.message}</p>
            )}
          </div>
          {/* Anggota Tim */}
          <div className="space-y-2">
            <label htmlFor="team_members">Anggota Tim</label>
            <Textarea
              id="team_members"
              placeholder="contoh: Asep, Kakang, Solihin"
              {...register("team_members")}
            />
            <p className="text-xs text-muted-foreground">
              Pisahkan setiap nama dengan koma ( , ).{" "}
            </p>
            {errors.team_members && (
              <p className="text-xs text-red-500">
                {errors.team_members.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Button untuk Submit */}
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Mendaftarkan..." : "Daftar Lomba"}
      </Button>
    </form>
  );
}

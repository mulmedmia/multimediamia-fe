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
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { useEffect } from "react";

const registrationSchema = z.object({
  team_name: z.string().optional(),
  category_id: z
    .string({ required_error: "Anda harus memilih kategori." })
    .min(1, "Kategori harus dipilih."),
  file_url: z.string().url({ message: "Harap masukkan URL yang valid." }),
  team_members: z.string().optional(),
  selected_category_type: z.string().optional(),
});

export function CompetitionRegistrationForm({ defaultCategoryId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuthContext();

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
      category_id: defaultCategoryId || "",
      file_url: "",
      team_name: "",
      team_members: "",
      selected_category_type: "",
    },
  });

  const selectedCategoryType = watch("selected_category_type");

  // Effect untuk mengatur kategori dan tipe ketika defaultCategoryId berubah
  useEffect(() => {
    if (defaultCategoryId && categories && categories.length > 0) {
      const selectedCategory = categories.find(
        (cat) => String(cat.category_id) === String(defaultCategoryId)
      );

      if (selectedCategory) {
        setValue("category_id", defaultCategoryId);
        setValue("selected_category_type", selectedCategory.team_type, {
          shouldValidate: true,
        });
      }
    }
  }, [defaultCategoryId, categories, setValue]);

  const mutation = useMutation({
    mutationFn: submitCompetitionRegistration,
    onSuccess: () => {
      toast.success("Pendaftaran berhasil!");
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      reset();
    },
    onError: (error) => {
      toast.error(`Gagal: ${error.message || "Terjadi kesalahan"}`);
    },
  });

  const onSubmit = (data) => {
    if (!user || !user.users_id) {
      toast.error("Sesi Anda telah berakhir. Harap login kembali.");
      return;
    }

    const payload = {
      user_id: user.users_id,
      category_id: data.category_id,
      file_url: data.file_url,
    };

    if (selectedCategoryType === "GROUP") {
      payload.team_name = data.team_name;

      const namesArray = data.team_members
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");
      payload.team_members = `['${namesArray.join("', '")}']`;
    }

    mutation.mutate(payload);
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories?.find(
      (cat) => String(cat.category_id) === String(value)
    );
    const type = selectedCategory?.team_type || null;

    setValue("category_id", value);
    setValue("selected_category_type", type, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Pilih Kategori</Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={handleCategoryChange}
              value={field.value}
              disabled={catLoading || !!defaultCategoryId} // Disable jika ada defaultCategoryId
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
                  categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={String(category.category_id)}
                    >
                      {category.category_name} ({category.team_type})
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

      <div className="space-y-2">
        <Label htmlFor="file_url">Link Drive Dokumen</Label>
        <Input
          id="file_url"
          placeholder="https://drive.google.com/..."
          {...register("file_url")}
        />
        <p className="text-xs text-muted-foreground">
          Upload dokumen persyaratan ke Google Drive dan share linknya di sini.
        </p>
        {errors.file_url && (
          <p className="text-xs text-red-500">{errors.file_url.message}</p>
        )}
      </div>

      {selectedCategoryType === "GROUP" && (
        <>
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
          <div className="space-y-2">
            <label htmlFor="team_members">Anggota Tim</label>
            <Textarea
              id="team_members"
              placeholder="contoh: Asep, Kakang, Solihin"
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
        </>
      )}

      <Button type="submit" className="w-full cursor-pointer" disabled={mutation.isPending}>
        {mutation.isPending ? "Mendaftarkan..." : "Daftar Sekarang"}
      </Button>
    </form>
  );
}

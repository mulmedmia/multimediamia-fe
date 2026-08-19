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
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link2Icon, PersonIcon, LayersIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";

const registrationSchema = z
  .object({
    team_name: z.string().optional(),
    category_id: z
      .string({ required_error: "Anda harus memilih kategori." })
      .min(1, "Kategori harus dipilih."),
    file_url: z.url({
      protocol: /^https?$/,
      hostname: /^drive\.google\.com$/,
      message: "Harap masukkan link Google Drive yang valid",
    }),
    member_2: z.string().optional(),
    member_3: z.string().optional(),
    selected_category_type: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selected_category_type === "GROUP") {
      if (!data.team_name || data.team_name.replace(/\s+/g, "").length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Nama tim minimal 3 karakter",
          path: ["team_name"],
        });
      }
      if (!data.member_2 || data.member_2.replace(/\s+/g, "").length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Nama anggota minimal 3 karakter",
          path: ["member_2"],
        });
      }
      if (data.member_3 && data.member_3.replace(/\s+/g, "").length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Nama anggota minimal 3 karakter",
          path: ["member_3"],
        });
      }
    }
  });

export function CompetitionRegistrationForm({ defaultCategoryId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

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
      member_2: "",
      member_3: "",
      selected_category_type: "",
    },
  });

  const selectedCategoryType = watch("selected_category_type");

  // Effect untuk mengatur kategori dan tipe ketika defaultCategoryId berubah
  useEffect(() => {
    if (defaultCategoryId && categories && categories.length > 0) {
      const selectedCategory = categories.find(
        (cat) => String(cat.category_id) === String(defaultCategoryId),
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

      const namesArray = [user?.name, data.member_2, data.member_3]
        .map((name) => (name ? name.trim() : ""))
        .filter((name) => name !== "");
      payload.team_members = `['${namesArray.join("', '")}']`;
    }

    mutation.mutate(payload);
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories?.find(
      (cat) => String(cat.category_id) === String(value),
    );
    const type = selectedCategory?.team_type || null;

    setValue("category_id", value);
    setValue("selected_category_type", type, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label className="block text-sm font-semibold text-foreground">
          Kategori Lomba
        </Label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={handleCategoryChange}
              value={field.value}
              disabled={catLoading || !!defaultCategoryId}
            >
              <SelectTrigger
                disabled={catLoading}
                className={cn(
                  "w-full h-11 bg-input border rounded-xl px-4 text-sm text-foreground focus-visible:border-ring focus-visible:ring-ring/50 transition-all",
                  errors.category_id
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border",
                )}
              >
                <SelectValue
                  placeholder={
                    catLoading ? "Memuat kategori..." : "-- Pilih Kategori --"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-[#141824] border border-border text-foreground rounded-xl shadow-2xl z-50">
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={String(category.category_id)}
                      className="hover:bg-primary/20 focus:bg-primary/20 text-foreground cursor-pointer py-2.5"
                    >
                      {category.category_name} ({category.team_type})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category_id && (
          <p className="text-xs text-destructive mt-1 font-medium">
            {errors.category_id.message}
          </p>
        )}
      </div>

      {/* Individual Competition Field */}
      {selectedCategoryType === "INDIVIDUAL" && (
        <div className="space-y-2 cursor-not-allowed">
          <Label className="block text-sm font-semibold text-foreground">
            Nama Peserta
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <PersonIcon className="w-4 h-4" />
            </div>
            <Input
              type="text"
              value={user?.name || ""}
              className="h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all border-border focus-visible:border-ring focus-visible:ring-ring/50"
              disabled
            />
          </div>
        </div>
      )}

      {/* Group Competition Additional Fields */}
      {selectedCategoryType === "GROUP" && (
        <div className="space-y-5">
          {/* Team Name */}
          <div className="space-y-2">
            <Label
              htmlFor="team_name"
              className="block text-sm font-semibold text-foreground"
            >
              Nama Tim
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                <LayersIcon className="w-4 h-4" />
              </div>
              <Input
                id="team_name"
                placeholder="Masukkan nama tim"
                required
                {...register("team_name")}
                className={cn(
                  "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                  errors.team_name
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                )}
              />
            </div>
            {errors.team_name && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.team_name.message}
              </p>
            )}
          </div>

          {/* Team Members Stacks */}
          <div className="space-y-3">
            <Label className="block text-sm font-semibold text-foreground">
              Anggota Tim
            </Label>

            {/* Stack 1: Ketua (Current User) */}
            <div className="relative cursor-not-allowed">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                <PersonIcon className="w-4 h-4" />
              </div>
              <Input
                type="text"
                value={user?.name + " (Ketua)" || ""}
                disabled
                className="h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground opacity-70 border-border"
              />
            </div>

            {/* Stack 2: Anggota 2 (Required) */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                  <PersonIcon className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Nama anggota 2"
                  required
                  {...register("member_2")}
                  className={cn(
                    "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                    errors.member_2
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                  )}
                />
              </div>
            </div>

            {/* Stack 3: Anggota 3 (Optional) */}
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                  <PersonIcon className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Nama anggota 3 (opsional)"
                  {...register("member_3")}
                  className={cn(
                    "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                    errors.member_3
                      ? "border-destructive focus-visible:ring-destructive"
                      : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                  )}
                />
              </div>
            </div>

            {/* <p className="text-xs text-mia-muted-2">
              Biarkan anggota 3 kosong jika tim hanya beranggotakan 2 orang
            </p> */}
            {(errors.member_2 || errors.member_3) && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.member_2.message || errors.member_3.message}
              </p>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Drive Document Link Field */}
      <div className="space-y-2">
        <Label
          htmlFor="file_url"
          className="block text-sm font-semibold text-foreground"
        >
          Link Drive Dokumen
        </Label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
            <Link2Icon className="w-4 h-4" />
          </div>
          <Input
            id="file_url"
            placeholder="https://drive.google.com/..."
            required
            {...register("file_url")}
            className={cn(
              "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
              errors.file_url
                ? "border-destructive focus-visible:ring-destructive"
                : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
            )}
          />
        </div>
        <p className="text-xs text-mia-muted-2">
          Upload dokumen persyaratan ke Google Drive dan masukkan link publik di
          sini
        </p>
        {errors.file_url && (
          <p className="text-xs text-destructive mt-1 font-medium">
            {errors.file_url.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mia-btn-primary h-11 w-full text-sm font-semibold shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <span>Daftar Sekarang</span>
          )}
        </Button>
      </div>
    </form>
  );
}

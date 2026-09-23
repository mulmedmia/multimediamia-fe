"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  submitCompetitionRegistration,
  checkTeamNameAvailability,
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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link2Icon, PersonIcon, LayersIcon } from "@radix-ui/react-icons";
import { Info, ExternalLink, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { useGuidebook } from "@/hooks/use-guidebook";

const registrationSchema = z
  .object({
    team_name: z.string().max(25, "Nama tim maksimal 25 karakter").optional(),
    category_id: z
      .string({ required_error: "Anda harus memilih kategori." })
      .min(1, "Kategori harus dipilih."),
    file_url: z.url({
      protocol: /^https?$/,
      hostname: /^drive\.google\.com$/,
      message: "Harap masukkan link Google Drive yang valid",
    }),
    team_lead: z.string(),
    member_1: z.string().optional(),
    member_2: z.string().optional(),
    selected_category_type: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const minCharError = (field = "", minChar = 3, prefixMsg = "") => {
      if (data[field].replace(/\s+/g, "").length < minChar) {
        ctx.addIssue({
          message: `${prefixMsg} minimal ${minChar} karakter`,
          path: [field],
        });
      }
    };

    // Group
    if (data.selected_category_type === "GROUP") {
      minCharError("team_name", 3, "Nama tim");
      minCharError("team_lead", 3, "Nama peserta");
      if (data.member_1) minCharError("member_1", 3, "Nama peserta");
      if (data.member_2) minCharError("member_2", 3, "Nama peserta");
    }

    // Individual
    // Asumsikan Nama Ketua = Nama Tim
    else {
      minCharError("team_lead", 3, "Nama peserta");
    }
  });

function PersonInput({
  field,
  register,
  errors,
  placeholder,
  role,
  required = false,
}) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
        <PersonIcon className="w-4 h-4" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        required={required}
        {...register(field)}
        className={cn(
          "h-11 bg-input rounded-xl pl-10 pr-22 text-sm text-foreground placeholder:text-mia-muted-2 transition-all peer",
          errors[field]
            ? "border-destructive focus-visible:ring-destructive"
            : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
        )}
      />
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-mia-muted-2 z-10 pointer-events-none select-none peer-placeholder-shown:hidden">
        {role}
      </span>
    </div>
  );
}

function InputError({ fieldError }) {
  return (
    fieldError && (
      <p className="text-xs text-destructive mt-1 font-medium">
        {fieldError.message}
      </p>
    )
  );
}

export function CompetitionRegistrationForm({ defaultCategoryId, onSuccessRegistration }) {
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
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      category_id: defaultCategoryId || "",
      file_url: "",
      team_name: "",
      team_lead: user?.name || "",
      member_1: "",
      member_2: "",
      selected_category_type: "",
    },
  });

  const [teamNameStatus, setTeamNameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const [teamNameMessage, setTeamNameMessage] = useState("");

  const { guidebookUrl: globalGuidebookUrl } = useGuidebook();
  const selectedCategoryType = watch("selected_category_type");
  const currentCategoryId = watch("category_id");
  const teamNameValue = watch("team_name");
  const selectedCategory = categories?.find(
    (cat) => String(cat.category_id) === String(currentCategoryId),
  );
  const guidebookUrl = selectedCategory?.file_url || globalGuidebookUrl;

  // Real-time check keunikan nama tim dalam kategori yang dipilih
  useEffect(() => {
    if (selectedCategoryType !== "GROUP" || !currentCategoryId) {
      setTeamNameStatus(null);
      setTeamNameMessage("");
      return;
    }

    const trimmed = (teamNameValue || "").trim();
    if (!trimmed || trimmed.length < 3) {
      setTeamNameStatus(null);
      setTeamNameMessage("");
      if (errors.team_name?.type === "duplicate") {
        clearErrors("team_name");
      }
      return;
    }

    setTeamNameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const result = await checkTeamNameAvailability(currentCategoryId, trimmed);
        if (result.available) {
          setTeamNameStatus("available");
          setTeamNameMessage("Nama tim tersedia");
          if (errors.team_name?.type === "duplicate") {
            clearErrors("team_name");
          }
        } else {
          setTeamNameStatus("taken");
          setTeamNameMessage(result.message || "Nama tim sudah digunakan dalam kategori lomba ini");
          setError("team_name", {
            type: "duplicate",
            message: result.message || "Nama tim sudah digunakan dalam kategori lomba ini",
          });
        }
      } catch {
        setTeamNameStatus(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [teamNameValue, currentCategoryId, selectedCategoryType, setError, clearErrors, errors.team_name?.type]);

  // Untuk lomba Grup (1-3 orang) dengan 1 ketua + 2 anggota
  const groupPersonInputs = [
    {
      field: "team_lead",
      placeholder: "Nama ketua (wajib)",
      role: "Ketua",
      required: true,
    },
    {
      field: "member_1",
      placeholder: "Nama anggota 1 (opsional)",
      role: "Anggota 1",
    },
    {
      field: "member_2",
      placeholder: "Nama anggota 2 (opsional)",
      role: "Anggota 2",
    },
  ];

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
    onSuccess: (data) => {
      toast.success("Pendaftaran berhasil!");
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
      if (onSuccessRegistration) {
        const catInfo = categories?.find(
          (c) => String(c.category_id) === String(data?.category_id || defaultCategoryId),
        );
        const enrichedData = {
          ...data,
          category: {
            ...catInfo,
            ...data?.category,
            whatsapp_group_url:
              data?.category?.whatsapp_group_url || catInfo?.whatsapp_group_url,
          },
        };
        onSuccessRegistration(enrichedData);
      } else {
        router.push("/dashboard");
      }
      reset();
    },
    onError: (error) => {
      const msg = error?.message || error?.response?.data?.message || "Terjadi kesalahan";
      if (msg.includes("Nama tim sudah digunakan")) {
        setError("team_name", {
          type: "duplicate",
          message: msg,
        });
        setTeamNameStatus("taken");
        setTeamNameMessage(msg);
      }
      toast.error(`Gagal: ${msg}`);
    },
  });

  const onSubmit = async (data) => {
    if (!user || !user.users_id) {
      toast.error("Sesi Anda telah berakhir. Harap login kembali.");
      return;
    }

    // Validasi pencegahan jika nama tim sudah terdeteksi ganda di frontend
    if (selectedCategoryType === "GROUP") {
      if (teamNameStatus === "taken") {
        setError("team_name", {
          type: "duplicate",
          message: "Nama tim sudah digunakan dalam kategori lomba ini. Silakan gunakan nama lain.",
        });
        toast.error("Nama tim sudah digunakan dalam kategori lomba ini!");
        return;
      }

      // Verifikasi cepat sebelum kirim
      if (data.team_name && teamNameStatus !== "available") {
        try {
          const check = await checkTeamNameAvailability(data.category_id, data.team_name);
          if (!check.available) {
            setTeamNameStatus("taken");
            setTeamNameMessage(check.message || "Nama tim sudah digunakan dalam kategori lomba ini");
            setError("team_name", {
              type: "duplicate",
              message: check.message || "Nama tim sudah digunakan dalam kategori lomba ini",
            });
            toast.error(check.message || "Nama tim sudah digunakan dalam kategori lomba ini!");
            return;
          }
        } catch {
          // Lanjutkan jika network check timeout
        }
      }
    }

    const payload = {
      user_id: user.users_id,
      category_id: data.category_id,
      file_url: data.file_url,
    };

    if (selectedCategoryType === "GROUP") {
      payload.team_name = data.team_name ? data.team_name.trim() : "";

      const namesArray = [data.team_lead, data.member_1, data.member_2]
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
    // Reset team name status saat ganti kategori
    setTeamNameStatus(null);
    setTeamNameMessage("");
    if (errors.team_name?.type === "duplicate") {
      clearErrors("team_name");
    }
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
                      {category.category_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
        <InputError fieldError={errors.category_id} />
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
              required
              {...register("team_lead")}
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
              Nama Tim <span className="text-[#E01C20]">*</span>
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
                  "h-11 bg-input rounded-xl pl-10 pr-10 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                  errors.team_name || teamNameStatus === "taken"
                    ? "border-destructive focus-visible:ring-destructive"
                    : teamNameStatus === "available"
                      ? "border-emerald-500/60 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30"
                      : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                )}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {teamNameStatus === "checking" && (
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                )}
                {teamNameStatus === "available" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {teamNameStatus === "taken" && (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
            </div>
            {errors.team_name ? (
              <InputError fieldError={errors.team_name} />
            ) : teamNameStatus === "available" ? (
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nama tim tersedia</span>
              </p>
            ) : null}
          </div>

          {/* Team Members Stacks */}
          <div className="space-y-3">
            <Label className="block text-sm font-semibold text-foreground">
              Anggota Tim
            </Label>

            {groupPersonInputs.map((person, index) => (
              <PersonInput
                key={index}
                {...person}
                register={register}
                errors={errors}
              />
            ))}

            <InputError
              fieldError={
                [errors.team_lead, errors.member_1, errors.member_2].filter(
                  (err) => !!err,
                )[0]
              }
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Drive Document Link Field */}
      <div className="space-y-3">
        <Label
          htmlFor="file_url"
          className="block text-sm font-semibold text-foreground"
        >
          Link Drive Dokumen <span className="text-[#E01C20]">*</span>
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
        <InputError fieldError={errors.file_url} />

        {/* Keterangan Dokumen Persyaratan & Tombol Guidebook */}
        <div className="p-3.5 rounded-xl bg-[#1E2939]/70 border border-white/10 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-[#AAB1BD] leading-relaxed">
            <Info className="h-4 w-4 text-[#FED700] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#FFF9F5] mb-0.5">
                Ketentuan Berkas Pendaftaran:
              </p>
              <p>
                Unggah seluruh dokumen persyaratan (Kartu Pelajar / KTM, bukti pembayaran, dan berkas lainnya) ke Google Drive Anda. Pastikan akses link disetel ke{" "}
                <strong className="text-[#FED700]">"Siapa saja yang memiliki link" (Public)</strong> agar dapat diverifikasi oleh panitia.
              </p>
              <p className="mt-1 text-[#99A1AF]">
                Daftar rincian dan format dokumen persyaratan selengkapnya dapat dilihat di dalam <strong>Guidebook Perlombaan</strong>.
              </p>
            </div>
          </div>

          <div className="pt-0.5">
            <a
              href={guidebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mia-btn-secondary py-2 px-3.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center group"
            >
              <FileText className="h-3.5 w-3.5 text-[#E01C20]" />
              <span>
                {selectedCategory?.category_name || selectedCategory?.name
                  ? `Buka Guidebook ${selectedCategory.category_name || selectedCategory.name}`
                  : "Buka Guidebook Perlombaan"}
              </span>
              <ExternalLink className="h-3 w-3 text-[#AAB1BD] group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
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

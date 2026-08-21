"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createSubmission,
  updateSubmission,
} from "@/services/submission.service.js";
import { getRegistrationById } from "@/services/competition.service.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Link2Icon,
  LayersIcon,
  FileTextIcon,
  CodeIcon,
  VideoIcon,
  InfoCircledIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "../ui/textarea";

// !!! Asumsikan zod object punya `keys` yang sama dengan yang dilempar oleh Backend
// Schema dinamis berdasarkan team type
const createSubmissionSchema = (teamType) => {
  return z
    .object({
      // team_name hanya required untuk GROUP
      team_name: teamType === "GROUP" ? z.string() : z.string().optional(),
      project_name: z.string(),
      description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter." }),
      // flow_application hanya required untuk GROUP
      flow_application:
        teamType === "GROUP"
          ? z
              .string()
              .min(10, { message: "Flow aplikasi minimal 10 karakter." })
          : z.string().optional(),
      github_url: z
        .url({
          protocol: /^https?$/,
          hostname: /^github\.com/,
          message: "Harap masukkan URL GitHub yang valid.",
        })
        .optional()
        .or(z.literal("")),
      youtube_url: z
        .url({
          protocol: /^https?$/,
          hostname: /^youtu(\.be|be\.com)$/,
          message: "Harap masukkan URL YouTube yang valid.",
        })
        .optional()
        .or(z.literal("")),
      other_url: z
        .url({
          protocol: /^https?$/,
          message: "Harap masukkan URL yang valid.",
        })
        .optional()
        .or(z.literal("")),
      github_description: z.string().optional(),
      youtube_description: z.string().optional(),
      other_description: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const hasUrl = (field) =>
        Boolean(data[field] && data[field].trim() !== "");

      // If all links are empty
      if (
        !(hasUrl("github_url") || hasUrl("youtube_url") || hasUrl("other_url"))
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Harap isi minimal satu link project (GitHub, YouTube, atau Link Lainnya).",
          path: ["links_required"],
        });
      }
    });
};

const LINK_CONFIGS = [
  {
    field: "github_url",
    placeholder: "https://github.com/username/repository",
    descField: "github_description",
    descPlaceholder: "Repository source code",
    label: "Link GitHub",
    Icon: CodeIcon,
    type: "GITHUB",
  },
  {
    field: "youtube_url",
    placeholder: "https://youtube.com/watch?v=...",
    descField: "youtube_description",
    descPlaceholder: "Video demo project",
    label: "Link YouTube",
    Icon: VideoIcon,
    type: "YOUTUBE",
  },
  {
    field: "other_url",
    placeholder: "https://example.com/live-demo",
    descField: "other_description",
    descPlaceholder: "Live demo website",
    label: "Link Lainnya",
    Icon: Link2Icon,
    type: "OTHER",
  },
];

function LinkInput({
  field = "",
  placeholder = "",
  descField = "",
  descPlaceholder = "",
  label = "",
  Icon,
  register,
  errors,
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={field}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <Input
          id={field}
          placeholder={placeholder}
          {...register(field)}
          className={cn(
            "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
            errors[field]
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
          )}
        />
      </div>
      <InputError fieldError={errors[field]} />
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
          <Pencil1Icon className="w-3.5 h-3.5" />
        </div>
        <Input
          id={descField}
          placeholder={descPlaceholder}
          {...register(descField)}
          className="h-10 bg-input/60 rounded-xl pl-9 pr-4 text-xs text-foreground placeholder:text-mia-muted-2 border-border/60 focus-visible:border-ring focus-visible:ring-ring/50"
        />
      </div>
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

export function SubmissionForm({
  registrationId,
  editingSubmission = null,
  onSuccess,
  onCancel,
}) {
  // Query untuk mengambil data registrasi
  const { data: registration, isLoading: isLoadingRegistration } = useQuery({
    queryKey: ["registration", registrationId],
    queryFn: () => getRegistrationById(registrationId),
    enabled: !!registrationId,
  });

  // Tentukan team type dari registration
  const teamType = registration?.category?.team_type || "GROUP";

  // Memoized schema berdasarkan teamType
  const submissionSchema = useMemo(() => {
    return createSubmissionSchema(teamType);
  }, [teamType]);

  // Default values berdasarkan team type
  const getDefaultValues = useMemo(() => {
    const linksInfo = LINK_CONFIGS.reduce((acc, { type, field, descField }) => {
      const found = editingSubmission?.links?.find((l) => l.link_type === type);
      acc[field] = found?.url || "";
      acc[descField] = found?.description || "";
      return acc;
    }, {});

    return {
      team_name: teamType === "GROUP" ? registration?.team_name || "" : "",
      project_name: editingSubmission?.project_name || "",
      description: editingSubmission?.description || "",
      flow_application:
        teamType === "GROUP" ? editingSubmission?.flow_application || "" : "",
      ...linksInfo,
    };
  }, [registration, editingSubmission, teamType]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: getDefaultValues,
    mode: "onChange",
  });

  // Effect untuk reset form ketika data atau teamType berubah
  useEffect(() => {
    if (registration) {
      reset(getDefaultValues);
      clearErrors(); // Clear existing errors when resetting
    }
  }, [registration, getDefaultValues, reset, clearErrors]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (editingSubmission) {
        return updateSubmission(editingSubmission.submission_id, data);
      } else {
        return createSubmission(data);
      }
    },
    onSuccess: () => {
      toast.success(
        editingSubmission
          ? "Submission berhasil diperbarui!"
          : "Karya berhasil diunggah!",
      );
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error(
        `Gagal ${editingSubmission ? "memperbarui" : "mengunggah"}: ${
          error.response?.data?.message || error.message || "Terjadi kesalahan"
        }`,
      );
    },
  });

  const onSubmit = (data) => {
    if (!registration) {
      toast.error("Data registrasi tidak ditemukan. Silakan refresh halaman.");
      return;
    }

    // Prepare links array based on filled URLs
    const links = [];

    for (const { field, type, descField, descPlaceholder } of LINK_CONFIGS) {
      if (data[field]) {
        links.push({
          link_type: type,
          url: data[field],
          description: data[descField] || descPlaceholder,
        });
      }
    }

    // Prepare submission payload
    // SELALU kirim team_name dan flow_application tapi gunakan dummy values jika INDIVIDUAL
    const submissionPayload = {
      registration_id: registrationId,
      category_id:
        registration.category_id || registration.category?.category_id,
      project_name: data.project_name,
      description: data.description,
      links: links,
    };

    // PERBAIKAN: Selalu sediakan nilai untuk team_name & flow_application
    if (teamType === "GROUP") {
      // Untuk GROUP: kirim team_name dan flow_application
      submissionPayload.team_name =
        data.team_name || registration.team_name || "";
      submissionPayload.flow_application = data.flow_application || "";
    } else {
      // Untuk INDIVIDUAL: gunakan nama user sebagai team_name, tanpa flow_application
      submissionPayload.team_name =
        registration.user?.name ||
        registration.user?.full_name ||
        registration.user?.username ||
        "Individual Participant";

      // TIDAK mengirim flow_application untuk INDIVIDUAL
      submissionPayload.flow_application = "N/A - Individual Participant";
    }

    mutation.mutate(submissionPayload);
  };

  if (isLoadingRegistration) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">Memuat data registrasi...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Basic Information */}
      <div className="space-y-4">
        {/* Team Name - Hanya tampil untuk GROUP */}
        {teamType === "GROUP" && (
          <div className="space-y-2">
            <Label
              htmlFor="team_name"
              className="block text-sm font-semibold text-foreground"
            >
              Nama Tim
            </Label>
            <div className="relative cursor-not-allowed">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                <LayersIcon className="w-4 h-4" />
              </div>
              <Input
                id="team_name"
                placeholder="Masukkan nama tim Anda"
                {...register("team_name")}
                disabled
                className="h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 border-border cursor-not-allowed pointer-events-auto opacity-75"
              />
            </div>
            <p className="text-xs text-mia-muted-2">
              Nama tim dapat diperbarui melalui opsi Edit Tim pada halaman
              Beranda.
            </p>
          </div>
        )}

        {/* Project Name */}
        <div className="space-y-2">
          <Label
            htmlFor="project_name"
            className="block text-sm font-semibold text-foreground"
          >
            Nama Project
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <FileTextIcon className="w-4 h-4" />
            </div>
            <Input
              id="project_name"
              placeholder="Masukkan nama project"
              required
              {...register("project_name")}
              className={cn(
                "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                errors.project_name
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
          </div>
          <InputError fieldError={errors.project_name} />
        </div>

        {/* Project Description */}
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="block text-sm font-semibold text-foreground"
          >
            Deskripsi Project
          </Label>
          <Textarea
            id="description"
            placeholder="Deskripsi detail tentang project Anda, apa yang dilakukan dan bagaimana cara kerjanya..."
            required
            rows={4}
            {...register("description")}
            className={cn(
              "bg-input dark:bg-input/30 rounded-xl p-3.5 text-sm text-foreground placeholder:text-mia-muted-2 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
              errors.description
                ? "border-destructive focus-visible:ring-destructive"
                : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
            )}
          />
          <InputError fieldError={errors.description} />
        </div>

        {/* Flow Aplikasi - Hanya tampil untuk GROUP */}
        {teamType === "GROUP" && (
          <div className="space-y-2">
            <Label
              htmlFor="flow_application"
              className="block text-sm font-semibold text-foreground"
            >
              Flow Aplikasi
            </Label>
            <Textarea
              id="flow_application"
              placeholder="User buka app -> Login -> Dashboard -> Browse fitur -> Gunakan fitur spesifik..."
              required
              rows={3}
              {...register("flow_application")}
              className={cn(
                "bg-input dark:bg-input/30 rounded-xl p-3.5 text-sm text-foreground placeholder:text-mia-muted-2 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
                errors.flow_application
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
            <InputError fieldError={errors.flow_application} />
          </div>
        )}

        {/* Untuk INDIVIDUAL */}
        {teamType === "INDIVIDUAL" && (
          <div className="p-3.5 bg-sky-500/10 rounded-xl border border-sky-500/25 text-xs text-sky-300 flex items-center gap-2">
            <InfoCircledIcon className="w-4 h-4 flex-shrink-0" />
            <p>
              Untuk kategori Individual, Tim dan Flow Aplikasi tidak diperlukan.
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Links Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Link Project & Berkas
          </h3>
          <p className="text-xs text-mia-muted-2 mt-0.5">
            Isi minimal satu link. Semua link bersifat opsional.
          </p>
          {errors.links_required && (
            <div className="mt-2.5 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <InfoCircledIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errors.links_required.message}</span>
            </div>
          )}
        </div>

        {LINK_CONFIGS.map((link, index) => (
          <LinkInput
            key={index}
            {...link}
            register={register}
            errors={errors}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-3">
        {editingSubmission && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={mutation.isPending}
            className="h-11 rounded-full border border-border bg-input hover:bg-input/80 text-foreground text-sm font-semibold px-6 cursor-pointer"
          >
            Batal
          </Button>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 mia-btn-primary h-11 text-sm font-semibold shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>
                {editingSubmission ? "Mengupdate..." : "Mengunggah..."}
              </span>
            </>
          ) : (
            <span>
              {editingSubmission ? "Update Submission" : "Upload Karya"}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

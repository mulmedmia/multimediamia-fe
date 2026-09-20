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
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "../ui/textarea";

// !!! Asumsikan zod object punya `keys` yang sama dengan yang dilempar oleh Backend
// Schema dinamis berdasarkan team type, kategori, dan fase deadline
const createSubmissionSchema = (teamType, categorySlug, isFinalPhase) => {
  const isWIA = categorySlug === "WIA";
  const isUIA = categorySlug === "UIA";

  if (isWIA) {
    return z.object({
      team_name: teamType === "GROUP" ? z.string() : z.string().optional(),
      project_name: z
        .string()
        .min(1, { message: "Nama project wajib diisi." })
        .max(80, { message: "Nama project maksimal 80 karakter." }),
      description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter." })
        .max(400, {
          message: "Deskripsi maksimal 400 karakter.",
        }),
      flow_application:
        teamType === "GROUP"
          ? z
              .string()
              .min(10, { message: "Flow aplikasi minimal 10 karakter." })
              .max(400, {
                message: "Flow aplikasi maksimal 400 karakter.",
              })
          : z.string().optional(),
      proposal_url: z
        .string()
        .min(1, { message: "Link draft proposal (Google Docs) wajib diisi." })
        .url({ message: "Harap masukkan format URL proposal yang valid." }),
      proposal_description: z.string().optional(),
      github_url: z
        .string()
        .min(1, { message: "Link repository GitHub utama wajib diisi." })
        .url({ message: "Harap masukkan format URL GitHub yang valid." }),
      github_description: z.string().optional(),
      github_secondary_url: z
        .string()
        .url({ message: "Harap masukkan URL GitHub kedua yang valid." })
        .optional()
        .or(z.literal("")),
      github_secondary_description: z.string().optional(),
      deployment_url: isFinalPhase
        ? z
            .string()
            .min(1, { message: "Link deployment / live website wajib diisi pada fase final." })
            .url({ message: "Harap masukkan URL deployment yang valid." })
        : z
            .string()
            .url({ message: "Harap masukkan URL deployment yang valid." })
            .optional()
            .or(z.literal("")),
      deployment_description: z.string().optional(),
      youtube_url: isFinalPhase
        ? z
            .string()
            .min(1, { message: "Link video demo YouTube wajib diisi pada fase final." })
            .url({ message: "Harap masukkan URL YouTube yang valid." })
        : z
            .string()
            .url({ message: "Harap masukkan URL YouTube yang valid." })
            .optional()
            .or(z.literal("")),
      youtube_description: z.string().optional(),
      other_url: z
        .string()
        .url({ message: "Harap masukkan URL yang valid." })
        .optional()
        .or(z.literal("")),
      other_description: z.string().optional(),
    });
  }

  if (isUIA) {
    return z.object({
      team_name: teamType === "GROUP" ? z.string() : z.string().optional(),
      project_name: z
        .string()
        .min(1, { message: "Nama project wajib diisi." })
        .max(80, { message: "Nama project maksimal 80 karakter." }),
      description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter." })
        .max(400, {
          message: "Deskripsi maksimal 400 karakter.",
        }),
      flow_application:
        teamType === "GROUP"
          ? z
              .string()
              .min(10, { message: "Flow aplikasi minimal 10 karakter." })
              .max(400, {
                message: "Flow aplikasi maksimal 400 karakter.",
              })
          : z.string().optional(),
      proposal_url: z
        .string()
        .min(1, { message: "Link draft proposal (Google Docs) wajib diisi." })
        .url({ message: "Harap masukkan format URL proposal yang valid." }),
      figma_url: z
        .string()
        .min(1, { message: "Link desain Figma wajib diisi." })
        .url({ message: "Harap masukkan format URL Figma yang valid." }),
      figma_prototype_url: isFinalPhase
        ? z
            .string()
            .min(1, { message: "Link prototipe Figma wajib diisi pada fase final." })
            .url({ message: "Harap masukkan format URL prototipe Figma yang valid." })
        : z
            .string()
            .url({ message: "Harap masukkan format URL prototipe Figma yang valid." })
            .optional()
            .or(z.literal("")),
      youtube_url: isFinalPhase
        ? z
            .string()
            .min(1, { message: "Link video demo YouTube wajib diisi pada fase final." })
            .url({ message: "Harap masukkan URL YouTube yang valid." })
        : z
            .string()
            .url({ message: "Harap masukkan URL YouTube yang valid." })
            .optional()
            .or(z.literal("")),
      other_url: z
        .string()
        .url({ message: "Harap masukkan URL yang valid." })
        .optional()
        .or(z.literal("")),
    });
  }

  // Fallback untuk kategori Non-WIA / Non-UIA
  return z
    .object({
      // team_name hanya required untuk GROUP
      team_name: teamType === "GROUP" ? z.string() : z.string().optional(),
      project_name: z
        .string()
        .min(1, { message: "Nama project wajib diisi." })
        .max(80, { message: "Nama project maksimal 80 karakter." }),
      description: z
        .string()
        .min(10, { message: "Deskripsi minimal 10 karakter." })
        .max(400, {
          message: "Deskripsi maksimal 400 karakter.",
        }),
      // flow_application hanya required untuk GROUP
      flow_application:
        teamType === "GROUP"
          ? z
              .string()
              .min(10, { message: "Flow aplikasi minimal 10 karakter." })
              .max(400, {
                message: "Flow aplikasi maksimal 400 karakter.",
              })
          : z.string().optional(),
      github_url: z
        .string()
        .url({
          message: "Harap masukkan URL GitHub yang valid.",
        })
        .optional()
        .or(z.literal("")),
      youtube_url: z
        .string()
        .url({
          message: "Harap masukkan URL YouTube yang valid.",
        })
        .optional()
        .or(z.literal("")),
      other_url: z
        .string()
        .url({
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

function LinkInput({
  field = "",
  placeholder = "",
  label = "",
  helperText = "",
  required = false,
  Icon,
  register,
  errors,
}) {
  return (
    <div className="space-y-2 p-3.5 bg-input/20 border border-border/40 rounded-xl transition-all">
      <div className="flex items-center justify-between gap-2">
        <Label
          htmlFor={field}
          className="block text-sm font-semibold text-foreground"
        >
          {label}{" "}
          {required ? (
            <span className="text-red-500 font-bold">*</span>
          ) : (
            <span className="text-xs font-normal text-muted-foreground">(Opsional)</span>
          )}
        </Label>
        {required && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400">
            Wajib
          </span>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          {helperText}
        </p>
      )}

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
  const categorySlug = registration?.category?.slug?.toUpperCase();
  const isWIA = categorySlug === "WIA";
  const isUIA = categorySlug === "UIA";

  const isFinalPhase = useMemo(() => {
    if (!registration?.category) return false;
    if (registration.category.allow_revision) return true;
    if (registration.category.preliminary_deadline) {
      return new Date() > new Date(registration.category.preliminary_deadline);
    }
    return false;
  }, [registration?.category]);

  const activeLinkConfigs = useMemo(() => {
    if (isWIA) {
      return [
        {
          field: "proposal_url",
          placeholder: "https://docs.google.com/document/d/...",
          descField: "proposal_description",
          descPlaceholder: "Draft Proposal (Google Docs)",
          label: "Link Draft Proposal (Google Docs)",
          helperText:
            "Wajib. Pastikan hak akses link Google Docs diatur ke publik / Siapa saja yang memiliki link (Viewer).",
          Icon: FileTextIcon,
          type: "PROPOSAL",
          required: true,
        },
        {
          field: "github_url",
          placeholder: "https://github.com/username/repository",
          descField: "github_description",
          descPlaceholder: "Repository GitHub Utama",
          label: "Link Repo GitHub (Utama)",
          helperText: "Wajib. Repository source code utama aplikasi.",
          Icon: CodeIcon,
          type: "GITHUB",
          required: true,
        },
        {
          field: "github_secondary_url",
          placeholder: "https://github.com/username/repository-backend",
          descField: "github_secondary_description",
          descPlaceholder: "Repository GitHub Tambahan (FE/BE dipisah)",
          label: "Link Repo GitHub (Opsional - FE/BE Terpisah)",
          helperText: "Opsional jika Anda memisahkan repo Frontend dan Backend.",
          Icon: CodeIcon,
          type: "GITHUB_SECONDARY",
          required: false,
        },
        {
          field: "deployment_url",
          placeholder: "https://my-app.vercel.app",
          descField: "deployment_description",
          descPlaceholder: "Deployment / Live Website",
          label: `Link Deployment / Live Website ${
            isFinalPhase ? "(Wajib Saat Final)" : "(Opsional Sementara)"
          }`,
          helperText: isFinalPhase
            ? "Wajib diisi pada tahap pengumpulan karya final."
            : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
          Icon: Link2Icon,
          type: "DEPLOYMENT",
          required: isFinalPhase,
        },
        {
          field: "youtube_url",
          placeholder: "https://youtube.com/watch?v=... atau https://youtu.be/...",
          descField: "youtube_description",
          descPlaceholder: "Video Demo Aplikasi YouTube",
          label: `Link Video Demo YouTube ${
            isFinalPhase ? "(Wajib Saat Final)" : "(Opsional Sementara)"
          }`,
          helperText: isFinalPhase
            ? "Wajib diisi pada tahap pengumpulan karya final."
            : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
          Icon: VideoIcon,
          type: "YOUTUBE",
          required: isFinalPhase,
        },
        {
          field: "other_url",
          placeholder: "https://...",
          descField: "other_description",
          descPlaceholder: "Panduan, kredensial akun uji coba juri, dsb.",
          label: "Link Lainnya (Opsional)",
          helperText:
            "Opsional (misal panduan instalasi, kredensial akun uji coba juri, dll.)",
          Icon: InfoCircledIcon,
          type: "OTHER",
          required: false,
        },
      ];
    }

    if (isUIA) {
      return [
        {
          field: "proposal_url",
          placeholder: "https://docs.google.com/document/d/...",
          descField: "proposal_description",
          descPlaceholder: "Draft Proposal (Google Docs)",
          label: "Link Draft Proposal (Google Docs)",
          helperText:
            "Wajib. Pastikan hak akses link Google Docs diatur ke publik / Siapa saja yang memiliki link (Viewer).",
          Icon: FileTextIcon,
          type: "PROPOSAL",
          required: true,
        },
        {
          field: "figma_url",
          placeholder: "https://www.figma.com/design/...",
          descField: "figma_description",
          descPlaceholder: "Desain Figma",
          label: "Link Desain Figma",
          helperText: "Wajib. Tautan file desain Figma proyek Anda.",
          Icon: LayersIcon,
          type: "FIGMA",
          required: true,
        },
        {
          field: "figma_prototype_url",
          placeholder: "https://www.figma.com/proto/...",
          descField: "figma_prototype_description",
          descPlaceholder: "Prototipe Figma",
          label: `Link Prototipe Figma ${
            isFinalPhase ? "(Wajib Saat Final)" : "(Opsional Sementara)"
          }`,
          helperText: isFinalPhase
            ? "Wajib diisi pada tahap pengumpulan karya final."
            : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
          Icon: LayersIcon,
          type: "FIGMA_PROTOTYPE",
          required: isFinalPhase,
        },
        {
          field: "youtube_url",
          placeholder: "https://youtube.com/watch?v=... atau https://youtu.be/...",
          descField: "youtube_description",
          descPlaceholder: "Video Demo Aplikasi YouTube",
          label: `Link Video Demo YouTube ${
            isFinalPhase ? "(Wajib Saat Final)" : "(Opsional Sementara)"
          }`,
          helperText: isFinalPhase
            ? "Wajib diisi pada tahap pengumpulan karya final."
            : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
          Icon: VideoIcon,
          type: "YOUTUBE",
          required: isFinalPhase,
        },
        {
          field: "other_url",
          placeholder: "https://...",
          descField: "other_description",
          descPlaceholder: "Panduan, kredensial akun uji coba juri, dsb.",
          label: "Link Lainnya (Opsional)",
          helperText:
            "Opsional (misal panduan pengujian, aset pendukung, dll.)",
          Icon: InfoCircledIcon,
          type: "OTHER",
          required: false,
        },
      ];
    }

    return [
      {
        field: "github_url",
        placeholder: "https://github.com/username/repository",
        descField: "github_description",
        descPlaceholder: "Repository source code",
        label: "Link GitHub",
        helperText: "Tautan repositori kode sumber proyek Anda.",
        Icon: CodeIcon,
        type: "GITHUB",
        required: false,
      },
      {
        field: "youtube_url",
        placeholder: "https://youtube.com/watch?v=...",
        descField: "youtube_description",
        descPlaceholder: "Video demo project",
        label: "Link YouTube",
        helperText: "Tautan video presentasi atau demo proyek.",
        Icon: VideoIcon,
        type: "YOUTUBE",
        required: false,
      },
      {
        field: "other_url",
        placeholder: "https://example.com/live-demo",
        descField: "other_description",
        descPlaceholder: "Live demo website",
        label: "Link Lainnya",
        helperText: "Tautan pendukung lain seperti live demo atau panduan.",
        Icon: Link2Icon,
        type: "OTHER",
        required: false,
      },
    ];
  }, [isWIA, isUIA, isFinalPhase]);

  // Memoized schema berdasarkan teamType, categorySlug, dan isFinalPhase
  const submissionSchema = useMemo(() => {
    return createSubmissionSchema(teamType, categorySlug, isFinalPhase);
  }, [teamType, categorySlug, isFinalPhase]);

  // Default values berdasarkan team type dan activeLinkConfigs
  const getDefaultValues = useMemo(() => {
    const linksInfo = activeLinkConfigs.reduce(
      (acc, { type, field, descField }) => {
        const found = editingSubmission?.links?.find(
          (l) => l.link_type === type,
        );
        acc[field] = found?.url || "";
        acc[descField] = found?.description || "";
        return acc;
      },
      {},
    );

    return {
      team_name: teamType === "GROUP" ? registration?.team_name || "" : "",
      project_name: editingSubmission?.project_name || "",
      description: editingSubmission?.description || "",
      flow_application:
        teamType === "GROUP" ? editingSubmission?.flow_application || "" : "",
      ...linksInfo,
    };
  }, [registration, editingSubmission, teamType, activeLinkConfigs]);

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

    // Prepare links array based on active configs
    const links = [];

    for (const {
      field,
      type,
      descField,
      descPlaceholder,
    } of activeLinkConfigs) {
      const val = data[field];
      if (val && val.trim() !== "") {
        links.push({
          link_type: type,
          url: val.trim(),
          description: data[descField]?.trim() || descPlaceholder,
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
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center flex-wrap gap-2">
            <span>
              {isWIA
                ? "Link Berkas & Repositori Web In Action"
                : isUIA
                  ? "Link Berkas & Desain UI/UX In Action"
                  : "Link Project & Berkas"}
            </span>
            {(isWIA || isUIA) && (
              <span className="text-xs font-normal normal-case px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">
                {isFinalPhase
                  ? "Fase Pengumpulan Final"
                  : "Fase Pengumpulan Sementara"}
              </span>
            )}
          </h3>
          <p className="text-xs text-mia-muted-2 mt-1 leading-relaxed">
            {isWIA
              ? isFinalPhase
                ? "Pada fase final, Draft Proposal, Repo GitHub Utama, Deployment, dan Video YouTube wajib diisi."
                : "Pada pengumpulan sementara, Draft Proposal dan Repo GitHub Utama wajib diisi. Deployment dan Video YouTube bersifat opsional dan wajib saat pengumpulan final."
              : isUIA
                ? isFinalPhase
                  ? "Pada fase final, Draft Proposal, Desain Figma, Prototipe Figma, dan Video YouTube wajib diisi."
                  : "Pada pengumpulan sementara, Draft Proposal dan Desain Figma wajib diisi. Prototipe Figma dan Video YouTube bersifat opsional dan wajib saat pengumpulan final."
                : "Isi minimal satu link project (GitHub, YouTube, atau Link Lainnya)."}
          </p>
          {errors.links_required && (
            <div className="mt-2.5 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <InfoCircledIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errors.links_required.message}</span>
            </div>
          )}
        </div>

        {activeLinkConfigs.map((link, index) => (
          <LinkInput
            key={link.field || index}
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

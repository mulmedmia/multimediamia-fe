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
import { useEffect, useMemo, useState } from "react";
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
import { Github, Presentation, FileCheck, Upload, ImageIcon, BookmarkCheck, Check } from "lucide-react";
import { SUB_THEMES } from "@/lib/constants";

// !!! Asumsikan zod object punya `keys` yang sama dengan yang dilempar oleh Backend
// Schema dinamis berdasarkan team type, kategori, dan fase deadline
const createSubmissionSchema = (teamType, categorySlug, isFinalPhase, categoryName = "") => {
  const normSlug = (categorySlug || "").toUpperCase();
  const normName = (categoryName || "").toUpperCase();
  const isWIA = normSlug === "WIA" || normSlug === "WEB DEVELOPMENT" || normName.includes("WEB");
  const isUIA = normSlug === "UIA" || normSlug === "UI/UX DESIGN" || normName.includes("UI/UX");

  if (isWIA) {
    return z.object({
      project_name: z
        .string()
        .min(1, { message: "Nama project wajib diisi." })
        .max(80, { message: "Nama project maksimal 80 karakter." }),
      sub_theme: z
        .union([
          z.array(z.string()).min(1, { message: "Harap pilih minimal satu sub-tema untuk Web In Action." }),
          z.string().min(1, { message: "Harap pilih minimal satu sub-tema untuk Web In Action." }),
        ]),
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
      presentation_url: z
        .string()
        .min(1, { message: "Link file presentasi (PowerPoint/Google Slides/Canva) wajib diisi." })
        .url({ message: "Harap masukkan format URL file presentasi yang valid." }),
      presentation_description: z.string().optional(),
      github_url: z
        .string()
        .min(1, { message: "Link repository GitHub utama wajib diisi." })
        .url({ message: "Harap masukkan format URL GitHub yang valid." }),
      github_description: z.string().optional(),
      originality_statement_url: z
        .string()
        .min(1, { message: "Link drive surat keterangan orisinil karya bermaterai 10.000 wajib diisi." })
        .url({ message: "Harap masukkan format URL surat keterangan orisinil yang valid." })
        .optional()
        .or(z.literal("")),
      originality_statement_description: z.string().optional(),
      proposal_url: isFinalPhase
        ? z
            .string()
            .min(1, { message: "Link draft proposal (Google Docs) wajib diisi pada fase final." })
            .url({ message: "Harap masukkan format URL proposal yang valid." })
        : z
            .string()
            .url({ message: "Harap masukkan format URL proposal yang valid." })
            .optional()
            .or(z.literal("")),
      proposal_description: z.string().optional(),
      github_secondary_url: z
        .string()
        .url({ message: "Harap masukkan URL GitHub kedua yang valid." })
        .optional()
        .or(z.literal("")),
      github_secondary_description: z.string().optional(),
      deployment_url: isFinalPhase
        ? z
            .string()
            .min(1, {
              message:
                "Link deployment / live website wajib diisi pada fase final.",
            })
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
            .min(1, {
              message: "Link video pitching YouTube wajib diisi pada fase final.",
            })
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
      project_name: z
        .string()
        .min(1, { message: "Nama project wajib diisi." })
        .max(80, { message: "Nama project maksimal 80 karakter." }),
      sub_theme: z
        .union([
          z.array(z.string()).min(1, { message: "Harap pilih minimal satu sub-tema untuk UI/UX In Action." }),
          z.string().min(1, { message: "Harap pilih minimal satu sub-tema untuk UI/UX In Action." }),
        ]),
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
      figma_description: z.string().optional(),
      originality_statement_url: z
        .string()
        .min(1, { message: "Link drive surat keterangan orisinil karya bermaterai 10.000 wajib diisi." })
        .url({ message: "Harap masukkan format URL surat keterangan orisinil yang valid." })
        .optional()
        .or(z.literal("")),
      originality_statement_description: z.string().optional(),
      figma_prototype_url: isFinalPhase
        ? z
            .string()
            .min(1, {
              message: "Link prototipe Figma wajib diisi pada fase final.",
            })
            .url({
              message: "Harap masukkan format URL prototipe Figma yang valid.",
            })
        : z
            .string()
            .url({
              message: "Harap masukkan format URL prototipe Figma yang valid.",
            })
            .optional()
            .or(z.literal("")),
      youtube_url: isFinalPhase
        ? z
            .string()
            .min(1, {
              message: "Link video pitching YouTube wajib diisi pada fase final.",
            })
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
      project_name: z
        .string()
        .min(1, { message: "Nama project wajib diisi." })
        .max(80, { message: "Nama project maksimal 80 karakter." }),
      sub_theme: z
        .union([
          z.array(z.string()),
          z.string(),
        ])
        .optional()
        .or(z.literal("")),
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
  overrideInfo = "",
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
            <span className="text-red-500 font-bold"> *</span>
          ) : (
            <span className="text-xs font-normal text-muted-foreground">
              ({overrideInfo || "Opsional"})
            </span>
          )}
        </Label>
        {required && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400">
            {overrideInfo || "Wajib"}
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
  const categoryName = (registration?.category?.name || registration?.category?.category_name || "").toUpperCase();
  const isWIA = categorySlug === "WIA" || categorySlug === "WEB DEVELOPMENT" || categoryName.includes("WEB");
  const isUIA = categorySlug === "UIA" || categorySlug === "UI/UX DESIGN" || categoryName.includes("UI/UX");

  const isFinalPhase = useMemo(() => {
    if (!registration?.category) return false;
    if (registration.category.allow_revision) return true;
    if (registration.category.preliminary_deadline) {
      return new Date() > new Date(registration.category.preliminary_deadline);
    }
    return false;
  }, [registration?.category]);

  const activeLinkConfigs = useMemo(() => {
    const configs = [];

    if (isWIA) {
      configs.push(
        ...[
          {
            field: "presentation_url",
            placeholder: "https://docs.google.com/presentation/d/... atau link Canva/Drive",
            descField: "presentation_description",
            descPlaceholder: "File Presentasi (Slides/Canva)",
            label: "Link File Presentasi (PowerPoint/Google Slides/Canva)",
            helperText:
              "Tautan slide presentasi karya. Pastikan hak akses diatur publik (Viewer) agar dapat diakses dewan juri.",
            Icon: Presentation,
            type: "PRESENTATION",
            required: true,
          },
          {
            field: "github_url",
            placeholder: "https://github.com/username/repository",
            descField: "github_description",
            descPlaceholder: "Repository GitHub Utama",
            label: "Link Repo GitHub (Utama)",
            helperText: "Repository source code utama aplikasi.",
            Icon: Github,
            type: "GITHUB",
            required: true,
          },
          {
            field: "originality_statement_url",
            placeholder: "https://drive.google.com/file/d/.../view",
            descField: "originality_statement_description",
            descPlaceholder: "Surat Keterangan Orisinil Karya Bermaterai 10.000",
            label: "Link Surat Keterangan Orisinil Karya (Materai 10.000)",
            helperText:
              "Tautan Google Drive surat pernyataan orisinalitas karya bermaterai Rp 10.000 (Pastikan akses publik Viewer).",
            Icon: FileCheck,
            type: "ORIGINALITY_STATEMENT",
            required: isFinalPhase,
            overrideInfo: isFinalPhase
              ? "Wajib Saat Final"
              : "Opsional Sementara",
          },
          {
            field: "proposal_url",
            placeholder: "https://docs.google.com/document/d/...",
            descField: "proposal_description",
            descPlaceholder: "Draft Proposal (Google Docs)",
            label: "Link Draft Proposal (Google Docs)",
            helperText: isFinalPhase
              ? "Wajib diisi pada tahap pengumpulan karya final."
              : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
            Icon: FileTextIcon,
            type: "PROPOSAL",
            required: isFinalPhase,
            overrideInfo: isFinalPhase
              ? "Wajib Saat Final"
              : "Opsional Sementara",
          },
          {
            field: "github_secondary_url",
            placeholder: "https://github.com/username/repository-backend",
            descField: "github_secondary_description",
            descPlaceholder: "Repository GitHub Tambahan (FE/BE dipisah)",
            label: "Link Repo GitHub",
            helperText:
              "Opsional jika Anda memisahkan repository Frontend dan Backend.",
            Icon: Github,
            type: "GITHUB_SECONDARY",
            required: false,
            overrideInfo: "Opsional - FE/BE Terpisah",
          },
          {
            field: "deployment_url",
            placeholder: "https://my-app.vercel.app",
            descField: "deployment_description",
            descPlaceholder: "Deployment / Live Website",
            label: "Link Deployment / Live Website",
            helperText: isFinalPhase
              ? "Wajib diisi pada tahap pengumpulan karya final."
              : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
            Icon: Link2Icon,
            type: "DEPLOYMENT",
            required: isFinalPhase,
            overrideInfo: isFinalPhase
              ? "Wajib Saat Final"
              : "Opsional Sementara",
          },
        ],
      );
    } else if (isUIA) {
      configs.push(
        ...[
          {
            field: "proposal_url",
            placeholder: "https://docs.google.com/document/d/...",
            descField: "proposal_description",
            descPlaceholder: "Draft Proposal (Google Docs)",
            label: "Link Draft Proposal (Google Docs)",
            helperText:
              "Pastikan hak akses link Google Docs diatur ke publik / Siapa saja yang memiliki link (Viewer).",
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
            helperText: "Tautan file desain Figma proyek Anda.",
            Icon: LayersIcon,
            type: "FIGMA",
            required: true,
          },
          {
            field: "originality_statement_url",
            placeholder: "https://drive.google.com/file/d/.../view",
            descField: "originality_statement_description",
            descPlaceholder: "Surat Keterangan Orisinil Karya Bermaterai 10.000",
            label: "Link Surat Keterangan Orisinil Karya (Materai 10.000)",
            helperText:
              "Tautan Google Drive surat pernyataan orisinalitas karya bermaterai Rp 10.000 (Pastikan akses publik Viewer).",
            Icon: FileCheck,
            type: "ORIGINALITY_STATEMENT",
            overrideInfo: isFinalPhase
              ? "Wajib Saat Final"
              : "Opsional Sementara",
          },
          {
            field: "figma_prototype_url",
            placeholder: "https://www.figma.com/proto/...",
            descField: "figma_prototype_description",
            descPlaceholder: "Prototipe Figma",
            label: "Link Prototipe Figma",
            helperText: isFinalPhase
              ? "Wajib diisi pada tahap pengumpulan karya final."
              : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
            Icon: LayersIcon,
            type: "FIGMA_PROTOTYPE",
            required: isFinalPhase,
            overrideInfo: isFinalPhase
              ? "Wajib Saat Final"
              : "Opsional Sementara",
          },
        ],
      );
    } else {
      configs.push({
        field: "github_url",
        placeholder: "https://github.com/username/repository",
        descField: "github_description",
        descPlaceholder: "Repository source code",
        label: "Link GitHub",
        helperText: "Tautan repository kode sumber proyek Anda.",
        Icon: CodeIcon,
        type: "GITHUB",
        required: false,
      });
    }

    configs.push(
      ...[
        {
          field: "youtube_url",
          placeholder:
            "https://youtube.com/watch?v=... atau https://youtu.be/...",
          descField: "youtube_description",
          descPlaceholder: "Video Pitching Aplikasi YouTube",
          label: "Link Video Pitching YouTube",
          helperText: isFinalPhase
            ? "Wajib diisi pada tahap pengumpulan karya final."
            : "Opsional pada pengumpulan sementara, wajib saat pengumpulan karya final.",
          Icon: VideoIcon,
          type: "YOUTUBE",
          required: isFinalPhase,
          overrideInfo: isFinalPhase
            ? "Wajib Saat Final"
            : "Opsional Sementara",
        },
        {
          field: "other_url",
          placeholder: "https://...",
          descField: "other_description",
          descPlaceholder: "Panduan, kredensial akun uji coba juri, dsb.",
          label: "Link Lainnya",
          helperText: "Misal: panduan pengujian, aset pendukung, dll.",
          Icon: InfoCircledIcon,
          type: "OTHER",
          required: false,
        },
      ],
    );

    return configs;
  }, [isWIA, isUIA, isFinalPhase]);

  // Memoized schema berdasarkan teamType, categorySlug, dan isFinalPhase
  const submissionSchema = useMemo(() => {
    return createSubmissionSchema(teamType, categorySlug, isFinalPhase, categoryName);
  }, [teamType, categorySlug, isFinalPhase, categoryName]);

  // Helper untuk parsing sub_theme menjadi array of string
  const parseSubThemesToArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

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
      project_name: editingSubmission?.project_name || "",
      sub_theme: parseSubThemesToArray(editingSubmission?.sub_theme),
      description: editingSubmission?.description || "",
      flow_application:
        teamType === "GROUP" ? editingSubmission?.flow_application || "" : "",
      ...linksInfo,
    };
  }, [registration, editingSubmission, teamType, activeLinkConfigs]);

  const currentSubThemes = useMemo(() => {
    if (isWIA) return SUB_THEMES.WIA || [];
    if (isUIA) return SUB_THEMES.UIA || [];
    return [];
  }, [isWIA, isUIA]);

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

  const selectedSubThemesValue = watch("sub_theme");
  const selectedSubThemes = useMemo(() => {
    if (Array.isArray(selectedSubThemesValue)) return selectedSubThemesValue;
    if (typeof selectedSubThemesValue === "string" && selectedSubThemesValue.trim()) {
      return selectedSubThemesValue.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [selectedSubThemesValue]);

  const handleToggleSubTheme = (themeName) => {
    const current = Array.isArray(selectedSubThemes) ? selectedSubThemes : [];
    const next = current.includes(themeName)
      ? current.filter((t) => t !== themeName)
      : [...current, themeName];

    setValue("sub_theme", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    editingSubmission?.thumbnail_url || editingSubmission?.thumbnail || null,
  );
  const [thumbnailError, setThumbnailError] = useState("");

  useEffect(() => {
    if (editingSubmission) {
      setThumbnailPreview(
        editingSubmission.thumbnail_url || editingSubmission.thumbnail || null,
      );
      setThumbnailFile(null);
      setThumbnailError("");
    }
  }, [editingSubmission]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setThumbnailError("File harus berupa gambar (JPG, PNG, atau WEBP)");
        toast.error("File harus berupa gambar (JPG, PNG, atau WEBP)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setThumbnailError("Ukuran file gambar maksimal 5MB");
        toast.error("Ukuran file gambar maksimal 5MB");
        return;
      }
      setThumbnailError("");
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

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
      const serverMessage =
        error?.error ||
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : "Terjadi kesalahan");
      toast.error(
        `Gagal ${editingSubmission ? "memperbarui" : "mengunggah"}: ${serverMessage}`,
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

    // Validasi thumbnail karya wajib diunggah
    const hasThumbnail =
      thumbnailFile ||
      editingSubmission?.thumbnail_url ||
      editingSubmission?.thumbnail;

    if (isFinalPhase && !hasThumbnail) {
      setThumbnailError("Thumbnail karya wajib diunggah.");
      toast.error("Thumbnail karya wajib diunggah.");
      const thumbEl = document.getElementById("thumbnail-upload-container");
      if (thumbEl) {
        thumbEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Format sub_theme: jika array gabungkan menjadi comma-separated string
    const formattedSubTheme = Array.isArray(data.sub_theme)
      ? data.sub_theme.join(", ")
      : (data.sub_theme || "");

    // Prepare submission payload
    // Sesuai schema backend: category_id dan team_name dihapus, registration_id wajib
    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("registration_id", registrationId);
      formData.append("project_name", data.project_name);
      if (formattedSubTheme) {
        formData.append("sub_theme", formattedSubTheme);
      }
      formData.append("description", data.description);
      formData.append(
        "flow_application",
        teamType === "GROUP"
          ? data.flow_application || ""
          : "N/A - Individual Participant",
      );
      formData.append("links", JSON.stringify(links));
      formData.append("thumbnail", thumbnailFile);
      mutation.mutate(formData);
    } else {
      const submissionPayload = {
        registration_id: registrationId,
        project_name: data.project_name,
        sub_theme: formattedSubTheme || null,
        description: data.description,
        flow_application:
          teamType === "GROUP"
            ? data.flow_application || ""
            : "N/A - Individual Participant",
        links: links,
      };
      if (editingSubmission?.thumbnail_url || editingSubmission?.thumbnail) {
        submissionPayload.thumbnail_url =
          editingSubmission.thumbnail_url || editingSubmission.thumbnail;
      }
      mutation.mutate(submissionPayload);
    }
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
        {/* Team Name - Read-only display from registration */}
        {teamType === "GROUP" && (
          <div className="space-y-2">
            <Label className="block text-sm font-semibold text-foreground">
              Nama Tim
            </Label>
            <div className="relative cursor-default">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                <LayersIcon className="w-4 h-4" />
              </div>
              <div className="h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground border border-border flex items-center opacity-75">
                {registration?.team_name || "-"}
              </div>
            </div>
            <p className="text-xs text-mia-muted-2">
              {registration?.is_verified
                ? "Tim yang telah diverifikasi tidak bisa mengubah nama tim"
                : "Nama tim dapat diperbarui melalui opsi Edit Tim pada halaman Beranda."}
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

        {/* Sub-Tema Karya */}
        {currentSubThemes.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <Label className="block text-sm font-semibold text-foreground">
                Pilihan Sub-Tema <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-mia-muted-2">
                Pilih satu atau lebih sub-tema fokus karya Anda (bisa pilih lebih dari satu)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentSubThemes.map((theme) => {
                const isSelected = selectedSubThemes.includes(theme.name);
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => handleToggleSubTheme(theme.name)}
                    className={cn(
                      "text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer group text-foreground relative overflow-hidden select-none",
                      isSelected
                        ? "border-[#E01C20] bg-[#E01C20]/10 shadow-[0_0_15px_rgba(224,28,32,0.12)] ring-1 ring-[#E01C20]/40"
                        : "border-border/50 bg-input/20 hover:border-border hover:bg-input/40"
                    )}
                  >
                    {/* Kotak Centang Checkbox */}
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                          isSelected
                            ? "border-[#E01C20] bg-[#E01C20] text-white"
                            : "border-muted-foreground/40 group-hover:border-muted-foreground bg-transparent"
                        )}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 stroke-[3]" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            isSelected
                              ? "text-[#E01C20] dark:text-red-400"
                              : "text-foreground"
                          )}
                        >
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E01C20]/20 text-[#E01C20] border border-[#E01C20]/30 shrink-0 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                            Terpilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <input type="hidden" {...register("sub_theme")} />
            <InputError fieldError={errors.sub_theme} />
          </div>
        )}

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

        {/* Thumbnail Karya (Gambar Pratinjau Show It) */}
        <div id="thumbnail-upload-container" className="space-y-2">
          <div className="flex items-center gap-1">
            <Label
              htmlFor="thumbnail-upload"
              className="block text-sm font-semibold text-foreground"
            >
              Thumbnail Karya
              {" "}
              {!isFinalPhase ? (
                <span className="text-xs font-normal text-muted-foreground">(Opsional Sementara)</span>
              ) : (
                <span className="text-red-500 font-bold"> *</span>
              )}
            </Label>
          </div>

          <div
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border bg-input/20 transition-all",
              thumbnailError
                ? "border-destructive bg-destructive/5"
                : "border-border/40",
            )}
          >
            {thumbnailPreview ? (
              <div className="relative aspect-video w-full sm:w-44 rounded-lg overflow-hidden border border-white/10 bg-black/50 flex-shrink-0 group">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Karya Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "aspect-video w-full sm:w-44 rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground flex-shrink-0 gap-1.5 p-3",
                  thumbnailError
                    ? "border-destructive/60 bg-destructive/10"
                    : "border-border/60 bg-white/[0.02]",
                )}
              >
                <ImageIcon
                  className={cn(
                    "h-6 w-6 opacity-40",
                    thumbnailError ? "text-destructive" : "text-[#FED700]",
                  )}
                />
                <span className="text-[10px] opacity-60">16 : 9 Ratio</span>
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-2">
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <label
                htmlFor="thumbnail-upload"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/50 bg-input/40 hover:bg-input/60 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-sm"
              >
                <Upload className="h-4 w-4 text-[#FED700]" />
                <span>
                  {thumbnailPreview
                    ? "Ganti Thumbnail Karya"
                    : "Unggah Thumbnail Karya"}
                </span>
              </label>
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">
                  Format JPG, PNG, atau WEBP. Maksimal file 5MB. Rasio 16:9 disarankan.
                </p>
                <p className="text-[10px] text-muted-foreground/70">
                  Thumbnail karya akan ditampilkan pada galeri Show It saat masa Final Submission Babak Penyisihan.
                </p>
              </div>
            </div>
          </div>
          {thumbnailError && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {thumbnailError}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Links Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center flex-wrap gap-2">
            <span>
              {isWIA
                ? "Link Berkas & Repository Web In Action"
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
                ? "Pada fase final, File Presentasi, Repo GitHub Utama, Surat Orisinil (Materai 10k), Draft Proposal, Deployment, dan Video YouTube wajib diisi."
                : "Pada pengumpulan sementara, File Presentasi, Repo GitHub Utama, dan Surat Keterangan Orisinil bermaterai wajib diisi. Draft Proposal, Deployment, dan Video YouTube wajib saat pengumpulan final."
              : isUIA
                ? isFinalPhase
                  ? "Pada fase final, Draft Proposal, Desain Figma, Surat Orisinil (Materai 10k), Prototipe Figma, dan Video YouTube wajib diisi."
                  : "Pada pengumpulan sementara, Draft Proposal, Desain Figma, dan Surat Keterangan Orisinil bermaterai wajib diisi. Prototipe Figma dan Video YouTube wajib saat pengumpulan final."
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

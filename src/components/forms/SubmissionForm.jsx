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

// Schema dinamis berdasarkan team type
const createSubmissionSchema = (teamType) => {
  return z
    .object({
      // team_name hanya required untuk GROUP
      team_name:
        teamType === "GROUP"
          ? z.string().min(1, { message: "Nama tim wajib diisi." })
          : z.string().optional(),
      project_name: z.string().min(1, { message: "Nama project wajib diisi." }),
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
        .string()
        .url({ message: "Harap masukkan URL GitHub yang valid." })
        .optional()
        .or(z.literal("")),
      youtube_url: z
        .string()
        .url({ message: "Harap masukkan URL YouTube yang valid." })
        .optional()
        .or(z.literal("")),
      other_url: z
        .string()
        .url({ message: "Harap masukkan URL yang valid." })
        .optional()
        .or(z.literal("")),
      github_description: z.string().optional(),
      youtube_description: z.string().optional(),
      other_description: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const hasGithub = Boolean(
        data.github_url && data.github_url.trim() !== "",
      );
      const hasYoutube = Boolean(
        data.youtube_url && data.youtube_url.trim() !== "",
      );
      const hasOther = Boolean(data.other_url && data.other_url.trim() !== "");

      if (!hasGithub && !hasYoutube && !hasOther) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Harap isi minimal satu link project (GitHub, YouTube, atau Link Lainnya).",
          path: ["links_required"],
        });
      }
    });
};

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
    return {
      team_name: teamType === "GROUP" ? registration?.team_name || "" : "",
      project_name: editingSubmission?.project_name || "",
      description: editingSubmission?.description || "",
      flow_application:
        teamType === "GROUP" ? editingSubmission?.flow_application || "" : "",
      github_url:
        editingSubmission?.links?.find((l) => l.link_type === "GITHUB")?.url ||
        "",
      youtube_url:
        editingSubmission?.links?.find((l) => l.link_type === "YOUTUBE")?.url ||
        "",
      other_url:
        editingSubmission?.links?.find((l) => l.link_type === "OTHER")?.url ||
        "",
      github_description:
        editingSubmission?.links?.find((l) => l.link_type === "GITHUB")
          ?.description || "",
      youtube_description:
        editingSubmission?.links?.find((l) => l.link_type === "YOUTUBE")
          ?.description || "",
      other_description:
        editingSubmission?.links?.find((l) => l.link_type === "OTHER")
          ?.description || "",
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
      const newDefaultValues = {
        team_name: teamType === "GROUP" ? registration.team_name || "" : "",
        project_name: editingSubmission?.project_name || "",
        description: editingSubmission?.description || "",
        flow_application:
          teamType === "GROUP" ? editingSubmission?.flow_application || "" : "",
        github_url:
          editingSubmission?.links?.find((l) => l.link_type === "GITHUB")
            ?.url || "",
        youtube_url:
          editingSubmission?.links?.find((l) => l.link_type === "YOUTUBE")
            ?.url || "",
        other_url:
          editingSubmission?.links?.find((l) => l.link_type === "OTHER")?.url ||
          "",
        github_description:
          editingSubmission?.links?.find((l) => l.link_type === "GITHUB")
            ?.description || "",
        youtube_description:
          editingSubmission?.links?.find((l) => l.link_type === "YOUTUBE")
            ?.description || "",
        other_description:
          editingSubmission?.links?.find((l) => l.link_type === "OTHER")
            ?.description || "",
      };

      reset(newDefaultValues);
      clearErrors(); // Clear existing errors when resetting
    }
  }, [registration, editingSubmission, teamType, reset, clearErrors]);

  const teamName = watch("team_name");

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

    if (data.github_url) {
      links.push({
        link_type: "GITHUB",
        url: data.github_url,
        description: data.github_description || "Source code repository",
      });
    }

    if (data.youtube_url) {
      links.push({
        link_type: "YOUTUBE",
        url: data.youtube_url,
        description: data.youtube_description || "Project demo video",
      });
    }

    if (data.other_url) {
      links.push({
        link_type: "OTHER",
        url: data.other_url,
        description: data.other_description || "Live demo website",
      });
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
              {...register("project_name")}
              className={cn(
                "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                errors.project_name
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
          </div>
          {errors.project_name && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.project_name.message}
            </p>
          )}
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
            rows={4}
            {...register("description")}
            className={cn(
              "bg-input dark:bg-input/30 rounded-xl p-3.5 text-sm text-foreground placeholder:text-mia-muted-2 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
              errors.description
                ? "border-destructive focus-visible:ring-destructive"
                : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
            )}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
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
              rows={3}
              {...register("flow_application")}
              className={cn(
                "bg-input dark:bg-input/30 rounded-xl p-3.5 text-sm text-foreground placeholder:text-mia-muted-2 transition-colors focus-visible:ring-offset-0 focus-visible:outline-none",
                errors.flow_application
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
            {errors.flow_application && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.flow_application.message}
              </p>
            )}
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

        {/* GitHub Link */}
        <div className="space-y-2">
          <Label
            htmlFor="github_url"
            className="block text-sm font-semibold text-foreground"
          >
            Link GitHub
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <CodeIcon className="w-4 h-4" />
            </div>
            <Input
              id="github_url"
              placeholder="https://github.com/username/repository"
              {...register("github_url")}
              className={cn(
                "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                errors.github_url
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
          </div>
          {errors.github_url && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.github_url.message}
            </p>
          )}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <Pencil1Icon className="w-3.5 h-3.5" />
            </div>
            <Input
              id="github_description"
              placeholder="Repository source code"
              {...register("github_description")}
              className="h-10 bg-input/60 rounded-xl pl-9 pr-4 text-xs text-foreground placeholder:text-mia-muted-2 border-border/60 focus-visible:border-ring focus-visible:ring-ring/50"
            />
          </div>
        </div>

        {/* YouTube Link */}
        <div className="space-y-2">
          <Label
            htmlFor="youtube_url"
            className="block text-sm font-semibold text-foreground"
          >
            Link YouTube
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <VideoIcon className="w-4 h-4" />
            </div>
            <Input
              id="youtube_url"
              placeholder="https://youtube.com/watch?v=..."
              {...register("youtube_url")}
              className={cn(
                "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                errors.youtube_url
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
          </div>
          {errors.youtube_url && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.youtube_url.message}
            </p>
          )}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <Pencil1Icon className="w-3.5 h-3.5" />
            </div>
            <Input
              id="youtube_description"
              placeholder="Video demo project"
              {...register("youtube_description")}
              className="h-10 bg-input/60 rounded-xl pl-9 pr-4 text-xs text-foreground placeholder:text-mia-muted-2 border-border/60 focus-visible:border-ring focus-visible:ring-ring/50"
            />
          </div>
        </div>

        {/* Other Link */}
        <div className="space-y-2">
          <Label
            htmlFor="other_url"
            className="block text-sm font-semibold text-foreground"
          >
            Link Lainnya
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <Link2Icon className="w-4 h-4" />
            </div>
            <Input
              id="other_url"
              placeholder="https://example.com/live-demo"
              {...register("other_url")}
              className={cn(
                "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                errors.other_url
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
          </div>
          {errors.other_url && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.other_url.message}
            </p>
          )}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <Pencil1Icon className="w-3.5 h-3.5" />
            </div>
            <Input
              id="other_description"
              placeholder="Live demo website"
              {...register("other_description")}
              className="h-10 bg-input/60 rounded-xl pl-9 pr-4 text-xs text-foreground placeholder:text-mia-muted-2 border-border/60 focus-visible:border-ring focus-visible:ring-ring/50"
            />
          </div>
        </div>
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

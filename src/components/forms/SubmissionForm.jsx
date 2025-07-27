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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";

// Schema dinamis berdasarkan team type
const createSubmissionSchema = (teamType) => {
  return z.object({
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
        ? z.string().min(10, { message: "Flow aplikasi minimal 10 karakter." })
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
          : "Karya berhasil diunggah!"
      );
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error(
        `Gagal ${editingSubmission ? "memperbarui" : "mengunggah"}: ${
          error.response?.data?.message || error.message || "Terjadi kesalahan"
        }`
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informasi Project</h3>

          {/* Team Name - Hanya tampil untuk GROUP */}
          {teamType === "GROUP" && (
            <div className="space-y-2">
              <Label htmlFor="team_name">Nama Tim *</Label>
              <Input
                id="team_name"
                {...register("team_name")}
                placeholder="Nama tim Anda"
              />
              {errors.team_name && (
                <p className="text-xs text-red-500">
                  {errors.team_name.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="project_name">Nama Project *</Label>
            <Input
              id="project_name"
              placeholder="My Amazing Project"
              {...register("project_name")}
            />
            {errors.project_name && (
              <p className="text-xs text-red-500">
                {errors.project_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Project *</Label>
            <Textarea
              id="description"
              placeholder="Deskripsi detail tentang project Anda, apa yang dilakukan dan bagaimana cara kerjanya..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Flow Aplikasi - Hanya tampil untuk GROUP */}
          {teamType === "GROUP" && (
            <div className="space-y-2">
              <Label htmlFor="flow_application">Flow Aplikasi *</Label>
              <Textarea
                id="flow_application"
                placeholder="User buka app -> Login -> Dashboard -> Browse fitur -> Gunakan fitur spesifik..."
                rows={3}
                {...register("flow_application")}
              />
              {errors.flow_application && (
                <p className="text-xs text-red-500">
                  {errors.flow_application.message}
                </p>
              )}
            </div>
          )}

          {/* Untuk INDIVIDUAL, tampilkan info bahwa flow app tidak diperlukan */}
          {teamType === "INDIVIDUAL" && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ️ Untuk kategori Individual, Tim dan Flow Aplikasi tidak
                diperlukan.
              </p>
            </div>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Link Project</h3>
          <p className="text-sm text-muted-foreground">
            Isi minimal satu link. Semua link bersifat opsional.
          </p>

          {/* GitHub Link */}
          <div className="space-y-3 mb-8">
            <Label htmlFor="github_url">Link GitHub</Label>
            <Input
              id="github_url"
              placeholder="https://github.com/username/repository"
              {...register("github_url")}
            />
            {errors.github_url && (
              <p className="text-xs text-red-500">
                {errors.github_url.message}
              </p>
            )}
            <Label htmlFor="github_description">Description</Label>
            <Input
              id="github_description"
              placeholder="Source code repository"
              {...register("github_description")}
            />
          </div>

          {/* YouTube Link */}
          <div className="space-y-3 mb-8">
            <Label htmlFor="youtube_url">Link YouTube</Label>
            <Input
              id="youtube_url"
              placeholder="https://youtube.com/watch?v=..."
              {...register("youtube_url")}
            />
            {errors.youtube_url && (
              <p className="text-xs text-red-500">
                {errors.youtube_url.message}
              </p>
            )}
            <Label htmlFor="youtube_description">Description</Label>
            <Input
              id="youtube_description"
              placeholder="Project demo video"
              {...register("youtube_description")}
            />
          </div>

          {/* Other Link */}
          <div className="space-y-3 mb-5">
            <Label htmlFor="other_url">Link Lainnya</Label>
            <Input
              id="other_url"
              placeholder="https://example.com/live-demo"
              {...register("other_url")}
            />
            {errors.other_url && (
              <p className="text-xs text-red-500">{errors.other_url.message}</p>
            )}
            <Label htmlFor="other_description">Description</Label>
            <Input
              id="other_description"
              placeholder="Live demo website"
              {...register("other_description")}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? editingSubmission
                ? "Mengupdate..."
                : "Mengunggah..."
              : editingSubmission
              ? "Update Submission"
              : "Upload Karya"}
          </Button>

          {editingSubmission && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Batal
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

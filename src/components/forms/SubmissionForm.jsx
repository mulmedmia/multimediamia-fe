"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createSubmission,
  updateSubmission,
} from "@/services/submission.service.js";
import { getRegistrationById } from "@/services/competition.service.js"; // Import service untuk get registration
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect } from "react";

const submissionSchema = z.object({
  team_name: z.string().optional(),
  project_name: z.string().min(1, { message: "Nama project wajib diisi." }),
  description: z
    .string()
    .min(10, { message: "Deskripsi minimal 10 karakter." }),
  flow_application: z
    .string()
    .min(10, { message: "Flow aplikasi minimal 10 karakter." }),
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

export function SubmissionForm({
  registrationId,
  editingSubmission = null,
  onSuccess,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      team_name: editingSubmission?.team_name || "",
      project_name: editingSubmission?.project_name || "",
      description: editingSubmission?.description || "",
      flow_application: editingSubmission?.flow_application || "",
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
    },
  });

  // Query untuk mengambil data registrasi
  const { data: registration, isLoading: isLoadingRegistration } = useQuery({
    queryKey: ["registration", registrationId],
    queryFn: () => getRegistrationById(registrationId),
    enabled: !!registrationId,
  });

  // Effect untuk mengisi team_name ketika data registrasi tersedia
  useEffect(() => {
    if (registration) {
      setValue("team_name", registration.team_name || "");
    }
    // Pre-fill form jika sedang editing
    if (editingSubmission) {
      setValue("team_name", editingSubmission.team_name || "");
      setValue("project_name", editingSubmission.project_name || "");
      setValue("description", editingSubmission.description || "");
      setValue("flow_application", editingSubmission.flow_application || "");

      // Set links
      const githubLink = editingSubmission.links?.find(
        (l) => l.link_type === "GITHUB"
      );
      const youtubeLink = editingSubmission.links?.find(
        (l) => l.link_type === "YOUTUBE"
      );
      const otherLink = editingSubmission.links?.find(
        (l) => l.link_type === "OTHER"
      );

      if (githubLink) {
        setValue("github_url", githubLink.url);
        setValue("github_description", githubLink.description || "");
      }
      if (youtubeLink) {
        setValue("youtube_url", youtubeLink.url);
        setValue("youtube_description", youtubeLink.description || "");
      }
      if (otherLink) {
        setValue("other_url", otherLink.url);
        setValue("other_description", otherLink.description || "");
      }
    }
  }, [registration, setValue]);

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
      toast.error(
        `Gagal ${editingSubmission ? "memperbarui" : "mengunggah"}: ${
          error.message || "Terjadi kesalahan"
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
    const submissionPayload = {
      registration_id: registrationId,
      category_id:
        registration.category_id || registration.category?.category_id,
      team_name: data.team_name || null,
      project_name: data.project_name,
      description: data.description,
      flow_application: data.flow_application,
      links: links,
    };

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

          {/* Team Name - Show only if team_name exists */}
          {teamName && (
            <div className="space-y-2">
              <Label htmlFor="team_name">Nama Tim</Label>
              <Input
                id="team_name"
                value={teamName}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Nama tim sudah terdaftar dan tidak dapat diubah.
              </p>
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

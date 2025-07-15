"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createSubmission } from "@/services/submission.service.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const submissionSchema = z.object({
  file_url: z.string().url({ message: "Harap masukkan URL yang valid." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
});

export function SubmissionForm({ registrationId, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(submissionSchema),
  });

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      alert("Karya berhasil diunggah!");
      if (onSuccess) onSuccess(); 
    },
    onError: (error) => {
      alert(`Gagal mengunggah: ${error.message || "Terjadi kesalahan"}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, registration_id: registrationId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file_url">Link Karya (Google Drive, Figma, GitHub, dll.)</Label>
        <Input id="file_url" placeholder="https://..." {...register("file_url")} />
        {errors.file_url && <p className="text-xs text-red-500 mt-1">{errors.file_url.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Singkat</Label>
        <Textarea id="description" placeholder="Deskripsi singkat tentang karya Anda..." {...register("description")} />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Mengunggah..." : "Upload Karya"}
      </Button>
    </form>
  );
}
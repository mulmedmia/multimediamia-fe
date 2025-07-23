import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSubmissions,
  getSubmissionById,
  patchSubmissionStatus,
  deleteSubmission,
  patchSubmissionScore,
} from "@/services/admin-submission.service";
import { toast } from "sonner";

// Query: ambil semua submission
export function useAdminSubmissions(params) {
  return useQuery({
    queryKey: ["admin-submissions", params],
    queryFn: () => getAllSubmissions(params),
  });
}

// Query: detail submission by id
export function useSubmissionDetail(id) {
  return useQuery({
    queryKey: ["admin-submission-detail", id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
  });
}

// Mutation: update status
export function usePatchSubmissionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchSubmissionStatus,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success(data.message || "Status berhasil diupdate!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal update status!");
    },
  });
}

// Mutation: delete
export function useDeleteSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Submission berhasil dihapus!");
    },
    onError: () => {
      toast.error("Gagal menghapus submission!");
    },
  });
}

// Mutation: update score & feedback
export function usePatchSubmissionScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchSubmissionScore,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success(data.message || "Score berhasil diupdate!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal update score!");
    },
  });
}
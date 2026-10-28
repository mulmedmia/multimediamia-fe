import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getAllSubmissions,
  getSubmissionById,
  patchSubmissionStatus,
  deleteSubmission,
} from "@/services/admin-submission.service";
import { toast } from "sonner";

export function useAdminSubmissions({ limit = 10, page = 1, category_id = "", status = "", search = "", registration_id = "", sub_theme = "" } = {}) {
  return useQuery({
    queryKey: ["admin-submissions", { limit, page, category_id, status, search, registration_id, sub_theme }],
    queryFn: () => getAllSubmissions({ limit, page, category_id, status, search, registration_id, sub_theme }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
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


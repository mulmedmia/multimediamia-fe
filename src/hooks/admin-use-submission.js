import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getAllSubmissions,
  getSubmissionById,
  patchSubmissionStatus,
  patchSubmissionFinalist,
  deleteSubmission,
} from "@/services/admin-submission.service";
import { toast } from "sonner";

export function useAdminSubmissions({
  limit = 10,
  page = 1,
  category_id = "",
  status = "",
  is_finalist = "",
  search = "",
  registration_id = "",
  sub_theme = "",
  phase = "",
  sort_by = "",
  order = "",
} = {}) {
  return useQuery({
    queryKey: [
      "admin-submissions",
      {
        limit,
        page,
        category_id,
        status,
        is_finalist,
        search,
        registration_id,
        sub_theme,
        phase,
        sort_by,
        order,
      },
    ],
    queryFn: () =>
      getAllSubmissions({
        limit,
        page,
        category_id,
        status,
        is_finalist,
        search,
        registration_id,
        sub_theme,
        phase,
        sort_by,
        order,
      }),
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

// Mutation: update finalist status (Top 10 Finalist)
export function usePatchSubmissionFinalist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchSubmissionFinalist,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      qc.invalidateQueries({ queryKey: ["admin-finalist-stats"] });
      qc.invalidateQueries({ queryKey: ["admin-submissions-overall-stats"] });
      toast.success(data.message || "Status finalist berhasil diperbarui!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal memperbarui status finalist!");
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

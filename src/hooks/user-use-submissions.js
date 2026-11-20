import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getAllSubmissionsByCategory,
  getSubmissionsByCategoryId,
  getSubmissionById,
} from "@/services/submission.service.js";

// Hook untuk Think It page (semua submissions public)
export const useAllSubmissions = (
  categoryId,
  search = "",
  registrationId = null,
  page = 1,
  limit = 21,
  phase = "",
  isFinalist = "",
) => {
  return useQuery({
    queryKey: ["allSubmissions", categoryId, search, registrationId, page, limit, phase, isFinalist],
    queryFn: () =>
      getAllSubmissionsByCategory(
        categoryId,
        search,
        registrationId,
        page,
        limit,
        phase,
        isFinalist,
      ),
    enabled: !!categoryId, // Only fetch when category is selected
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
};

// Hook untuk user's own submissions
export const useMySubmissions = (categoryId, registrationId = null) => {
  return useQuery({
    queryKey: ["mySubmissions", categoryId, registrationId],
    queryFn: () => getSubmissionsByCategoryId(categoryId, registrationId),
    enabled: !!categoryId,
  });
};

// Hook untuk detail submission (Think It detail page)
export const useSubmissionDetail = (submissionId) => {
  return useQuery({
    queryKey: ["submissionDetail", submissionId],
    queryFn: () => getSubmissionById(submissionId),
    enabled: !!submissionId,
  });
};
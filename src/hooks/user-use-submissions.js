import { useQuery } from "@tanstack/react-query";
import {
  getAllSubmissionsByCategory,
  getSubmissionsByCategoryId,
  getSubmissionById,
} from "@/services/submission.service.js";

// Hook untuk Think It page (semua submissions public)
export const useAllSubmissions = (categoryId) => {
  return useQuery({
    queryKey: ["allSubmissions", categoryId],
    queryFn: () => getAllSubmissionsByCategory(categoryId),
    enabled: !!categoryId, // Only fetch when category is selected
  });
};

// Hook untuk user's own submissions
export const useMySubmissions = (categoryId) => {
  return useQuery({
    queryKey: ["mySubmissions", categoryId],
    queryFn: () => getSubmissionsByCategoryId(categoryId),
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
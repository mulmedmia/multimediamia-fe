import { useQuery } from "@tanstack/react-query";
import {
  getAllSubmissionsByCategory,
  getSubmissionsByCategoryId,
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

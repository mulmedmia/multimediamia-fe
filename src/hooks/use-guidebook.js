"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGuidebookSetting,
  updateGuidebookSetting,
  DEFAULT_GUIDEBOOK_URL,
} from "@/services/setting.service";
import { toast } from "sonner";

export const GUIDEBOOK_QUERY_KEY = ["guidebookUrl"];

/**
 * Hook untuk membaca link guidebook
 */
export function useGuidebook() {
  const query = useQuery({
    queryKey: GUIDEBOOK_QUERY_KEY,
    queryFn: getGuidebookSetting,
    staleTime: 1000 * 60 * 5, // 5 menit
    initialData: DEFAULT_GUIDEBOOK_URL,
  });

  return {
    guidebookUrl: query.data || DEFAULT_GUIDEBOOK_URL,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/**
 * Hook mutasi untuk admin mengupdate link guidebook
 */
export function useUpdateGuidebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUrl) => updateGuidebookSetting(newUrl),
    onSuccess: (data) => {
      queryClient.setQueryData(GUIDEBOOK_QUERY_KEY, data?.guidebook_url);
      queryClient.invalidateQueries({ queryKey: GUIDEBOOK_QUERY_KEY });
      toast.success("Link Guidebook berhasil disimpan dan diperbarui!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menyimpan link Guidebook";
      toast.error(msg);
    },
  });
}

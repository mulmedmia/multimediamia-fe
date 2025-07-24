import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, redeemProduct } from "@/services/product-gamification";

export function useProducts({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["products", { page, limit }],
    queryFn: () => getAllProducts({ page, limit }),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
  });
}

export function useRedeemProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: redeemProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

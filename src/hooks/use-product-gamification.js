import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, redeemProduct } from "@/services/product-gamification";

export function useProducts({ page = 1, limit = 10, category_id } = {}) {
  return useQuery({
    queryKey: ["products", { page, limit, category_id }],
    queryFn: () => getAllProducts({ page, limit, category_id }),
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
      qc.invalidateQueries({ queryKey: ["user-profile"] });
      qc.invalidateQueries({ queryKey: ["redemptions"] });
      qc.invalidateQueries({ queryKey: ["my-redemptions"] });
      qc.invalidateQueries({ queryKey: ["myRegistrations"] });
    },
  });
}

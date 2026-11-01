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
    onError: (error, variables) => {
      const errMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "";

      if (
        typeof errMsg === "string" &&
        errMsg.toLowerCase().includes("out of stock")
      ) {
        const targetProductId =
          typeof variables === "object" && variables !== null
            ? variables.productId || variables.product_id
            : variables;

        if (targetProductId) {
          qc.setQueriesData({ queryKey: ["products"] }, (oldData) => {
            if (!oldData) return oldData;
            if (Array.isArray(oldData)) {
              return oldData.map((p) =>
                p.product_id === targetProductId ? { ...p, stock: 0 } : p
              );
            }
            if (oldData.products && Array.isArray(oldData.products)) {
              return {
                ...oldData,
                products: oldData.products.map((p) =>
                  p.product_id === targetProductId ? { ...p, stock: 0 } : p
                ),
              };
            }
            return oldData;
          });
        }
      }
    },
  });
}

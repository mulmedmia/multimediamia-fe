import api from "@/lib/api";

// Ambil semua data redeem user (admin)
export const getAllRedemptions = async ({
  page = 1,
  limit = 10,
  search = "",
  product_id = "",
  category_id = "",
} = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search && search.trim()) params.append("search", search.trim());
  if (product_id && product_id !== "ALL") params.append("product_id", product_id);
  if (category_id && category_id !== "ALL") params.append("category_id", category_id);

  const res = await api.get(`/gamification/admin/redeem/all?${params.toString()}`);
  return {
    redemptions: res.data.data.redemptions,
    meta: res.data.data.meta,
  };
};
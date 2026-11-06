import api from "@/lib/api";

export const getAllProducts = async ({
  page = 1,
  limit = 10,
  category_id,
  is_active = undefined,
} = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (category_id) {
    params.append("category_id", category_id);
  }
  if (is_active) {
    params.append("is_active", is_active);
  }
  const response = await api.get(`/products?${params.toString()}`);
  return response.data.data;
};

export const redeemProduct = async (data) => {
  const payload =
    typeof data === "object" && data !== null
      ? data
      : { productId: data, quantity: 1 };
  const response = await api.post("/gamification/redeem", payload);
  return response.data.data;
};

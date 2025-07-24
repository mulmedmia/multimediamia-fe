import api from "@/lib/api";

export const getAllProducts = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  const response = await api.get(`/products?${params.toString()}`);
  return response.data.data;
};

export const redeemProduct = async (productId) => {
  const response = await api.post("/gamification/redeem", { productId });
  return response.data.data;
};

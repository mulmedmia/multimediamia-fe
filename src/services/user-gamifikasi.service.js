import api from "@/lib/api";

/**
 * Get user's redemption history.
 * @param {object} filters
 * @returns {Promise<{redemptions: Array, meta: object}>}
 */
export const getMyRedemptions = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.registration_id) params.append("registration_id", filters.registration_id);
  if (filters.product_id) params.append("product_id", filters.product_id);
  if (filters.search) params.append("search", filters.search);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/gamification/redeem/my${queryString}`);
  return res.data.data;
};

/**
 * Get leaderboard by category.
 * @param {string} categoryId
 * @param {object} options
 * @returns {Promise<{leaderboard: Array, meta: object}>}
 */
export const getLeaderboardByCategory = async (categoryId, { page = 1, limit = 10, search = "" } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search && search.trim()) params.append("search", search.trim());
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get(`/gamification/${categoryId}${queryString}`);
  return res.data.data;
};

/**
 * Get all categories.
 * @returns {Promise<Array>}
 */
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data.data.categories;
};
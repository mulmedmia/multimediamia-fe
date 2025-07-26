import api from "@/lib/api";

/**
 * Get user's redemption history.
 * @returns {Promise<{redemptions: Array, meta: object}>}
 */
export const getMyRedemptions = async () => {
  const res = await api.get("/gamification/redeem/my");
  return res.data.data;
};

/**
 * Get leaderboard by category.
 * @param {string} categoryId
 * @returns {Promise<Array>}
 */
export const getLeaderboardByCategory = async (categoryId) => {
  const res = await api.get(`/gamification/${categoryId}`);
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
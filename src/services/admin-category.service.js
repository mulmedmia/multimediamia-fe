import api from "@/lib/api";

// Get categories with pagination & search
export const getAdminCategories = async ({
  limit = 10,
  page = 1,
  search = "",
}) => {
  const params = { limit, page, search };
  const res = await api.get("/categories", { params });
  return res.data.data;
};

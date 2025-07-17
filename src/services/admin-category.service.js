import api from "@/lib/api";

export const getAdminCategories = async ({
  limit = 10,
  page = 1,
  search = "",
}) => {
  const params = { limit, page, search };
  const res = await api.get("/categories", { params });
  return res.data.data;
};

export const createAdminCategory = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.post("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateAdminCategory = async ({ id, ...data }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.patch(`/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteAdminCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

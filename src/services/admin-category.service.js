import api from "@/lib/api";

export const getAdminCategories = async ({
  limit = 10,
  page = 1,
  search = "",
  status = "",
}) => {
  const params = { limit, page, search };
  if (status && status !== "ALL") {
    params.status = status;
  }
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

export const toggleAdminCategorySubmission = async ({ id, is_submission_open, allow_revision }) => {
  const res = await api.patch(`/categories/${id}/toggle-submission`, {
    is_submission_open,
    allow_revision,
  });
  return res.data.data;
};

export const toggleAdminCategoryShowIt = async ({ id, is_show_it_open }) => {
  const res = await api.patch(`/categories/${id}/toggle-show-it`, {
    is_show_it_open,
  });
  return res.data.data;
};


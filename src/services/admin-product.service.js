import api from "@/lib/api";

// Get all products (with pagination & search)
export const getAdminProducts = async ({
  limit = 10,
  page = 1,
  search = "",
  is_active,
} = {}) => {
  const params = { limit, page };
  if (search && search.trim()) params.search = search.trim();
  if (is_active !== undefined && is_active !== "ALL" && is_active !== "") {
    params.is_active = is_active;
  }
  const res = await api.get("/products", { params });
  return res.data.data;
};

// Create product (form-data)
export const createAdminProduct = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Update product (form-data)
export const updateAdminProduct = async ({ id, ...data }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.patch(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Delete product
export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
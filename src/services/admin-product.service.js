import api from "@/lib/api";

// Get all products (with pagination & search)
export const getAdminProducts = async ({ limit = 10, page = 1, search = "" }) => {
  const params = { limit, page, search };
  const res = await api.get("/products", { params });
  return res.data.data;
};

// Create product (form-data)
export const createAdminProduct = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.post("/products", formData);
  return res.data.data;
};

// Update product (form-data)
export const updateAdminProduct = async ({ id, ...data }) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.patch(`/products/${id}`, formData);
  return res.data.data;
};

// Delete product
export const deleteAdminProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
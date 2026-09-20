import api from "@/lib/api";

// Ambil semua juri
export const getAllJuri = async () => {
  const res = await api.get("/auth/juri");
  return res.data.data;
};

// Tambah juri baru
export const createJuri = async ({ name, email, password, category_id }) => {
  const res = await api.post("/auth/juri", { name, email, password, category_id });
  return res.data;
};

// Hapus juri
export const deleteJuri = async (id) => {
  const res = await api.delete(`/auth/juri/${id}`);
  return res.data;
};

// Update kategori juri
export const updateJuriCategory = async ({ id, category_id }) => {
  const res = await api.patch(`/auth/juri/${id}/category`, { category_id });
  return res.data;
};
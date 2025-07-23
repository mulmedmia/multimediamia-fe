import api from "@/lib/api";

/**
 * Mengambil semua kategori dengan pagination dan filter
 * @param {Object} params - Parameter untuk query
 * @param {number} params.limit - Jumlah data per halaman
 * @param {number} params.page - Nomor halaman
 * @param {string} params.status - Status kategori (optional)
 * @param {string} params.search - Kata kunci pencarian (optional)
 * @returns {Promise<Object>}
 */
export const getUserCategories = async ({ 
  limit = 10, 
  page = 1, 
  status = "", 
  search = "" 
} = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('page', page.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await api.get(`/categories?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    throw error;
  }
};

/**
 * Mengambil kategori berdasarkan ID
 * @param {string} categoryId - ID kategori
 * @returns {Promise<Object>}
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil detail kategori:", error);
    throw error;
  }
};

/**
 * Mengambil semua kategori tanpa pagination (untuk dropdown, dll)
 * @returns {Promise<Array>}
 */
export const getAllUserCategories = async () => {
  try {
    const response = await api.get("/categories?limit=100&page=1");
    return response.data.data.categories;
  } catch (error) {
    console.error("Gagal mengambil semua kategori:", error);
    return [];
  }
};
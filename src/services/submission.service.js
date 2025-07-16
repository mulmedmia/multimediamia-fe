import api from '@/lib/api';

/**
 * Mengambil semua submission untuk sebuah registrasi.
 * Kita akan menggunakan endpoint `my/submissions` yang sudah ada
 * dan memfilternya berdasarkan category_id.
 * @param {string} categoryId - ID dari kategori lomba.
 * @returns {Promise<Array>}
 */
export const getSubmissionsByCategoryId = async (categoryId) => {
  try {
    const response = await api.get(`/submissions/my/submissions?category_id=${categoryId}`);
    return response.data.data.submissions;
  } catch (error) {
    console.error("Gagal mengambil data submission:", error);
    return [];
  }
};

/**
 * Membuat submission baru.
 * @param {FormData} formData - Data form yang berisi file, judul, dll.
 * @returns {Promise<object>}
 */
export const createSubmission = async (formData) => {
    try {
        const response = await api.post('/submissions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Gagal membuat submission:", error);
        throw error.response?.data || error;
    }
};

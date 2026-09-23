import api from "@/lib/api";

/**
 * Mengambil semua submission untuk sebuah registrasi.
 * Kita akan menggunakan endpoint `my/submissions` yang sudah ada
 * dan memfilternya berdasarkan category_id.
 * @param {string} categoryId - ID dari kategori lomba.
 * @returns {Promise<Array>}
 */
export const getSubmissionsByCategoryId = async (categoryId) => {
  try {
    const response = await api.get(
      `/submissions/my/submissions?category_id=${categoryId}`
    );
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
export const createSubmission = async (submissionData) => {
  try {
    const response = await api.post("/submissions", submissionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMySubmissions = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/submissions/my/submissions?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil submission user:", error);
    throw error;
  }
};

export const updateSubmission = async (submissionId, submissionData) => {
  try {
    const response = await api.patch(
      `/submissions/${submissionId}`,
      submissionData
    );
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengupdate submission:", error);
    throw error;
  }
};

/**
 * Mengambil semua submission untuk sebuah kategori (untuk Think It page)
 * @param {string} categoryId - ID dari kategori lomba.
 * @returns {Promise<Array>}
 */
export const getAllSubmissionsByCategory = async (categoryId) => {
  try {
    // Menggunakan endpoint submissions global (bukan my/submissions) khusus penayangan Show It
    const response = await api.get(`/submissions?category_id=${categoryId}&show_it=true`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil semua submission:", error);
    throw error;
  }
};

/**
 * Mengambil submission berdasarkan ID (untuk Think It detail page)
 * @param {string} submissionId - ID dari submission.
 * @returns {Promise<object>}
 */
export const getSubmissionById = async (submissionId) => {
  try {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil detail submission:", error);
    throw error;
  }
};

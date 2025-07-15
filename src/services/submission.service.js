import api from "@/lib/api";

export const createSubmission = async (submissionData) => {
  try {
    const response = await api.post("/submissions", submissionData);
    return response.data;
  } catch (error) {
    console.error("Gagal mengirim submission:", error);
    throw error.response?.data || error;
  }
};
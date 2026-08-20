import api from "@/lib/api";

// Get all submissions (with pagination, status, search)
export const getAllSubmissions = async ({
  limit = 10,
  page = 1,
  status = "",
  search = "",
}) => {
  const params = { limit, page, status, search };
  const res = await api.get("/submissions", { params });
  return res.data.data;
};

// Get submission by ID
export const getSubmissionById = async (id) => {
  const res = await api.get(`/submissions/${id}`);
  return res.data.data;
};

// Update submission status
export const patchSubmissionStatus = async ({ id, status, is_verified }) => {
  const res = await api.patch(`/submissions/${id}/status`, {
    status,
    is_verified,
  });
  return res.data;
};

// Delete submission
export const deleteSubmission = async (id) => {
  const res = await api.delete(`/submissions/${id}`);
  return res.data;
};

// Update score and feedback
export const patchSubmissionScore = async ({ id, score, feedback }) => {
  const res = await api.patch(`/submissions/${id}/score-feedback`, {
    score,
    feedback,
  });
  return res.data;
};

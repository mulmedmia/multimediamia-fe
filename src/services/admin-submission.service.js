import api from "@/lib/api";

// Get all submissions (with pagination, status, search)
export const getAllSubmissions = async ({
  limit = 10,
  page = 1,
  category_id = "",
  status = "",
  search = "",
  registration_id = "",
  sub_theme = "",
} = {}) => {
  const params = { limit, page };
  if (category_id && category_id !== "ALL") params.category_id = category_id;
  if (status && status !== "ALL" && status !== "all") params.status = status;
  if (search && search.trim()) params.search = search.trim();
  if (registration_id && registration_id.trim()) params.registration_id = registration_id.trim();
  if (sub_theme && sub_theme !== "ALL") params.sub_theme = sub_theme;

  const res = await api.get("/submissions", { params });
  return res.data.data;
};

// Get submission by ID
export const getSubmissionById = async (id) => {
  const res = await api.get(`/submissions/${id}`);
  return res.data.data;
};

// Update submission status
// Update submission status
export const patchSubmissionStatus = async ({ id, status, is_verified, admin_feedback }) => {
  const payload = { status, is_verified };
  if (admin_feedback !== undefined) {
    payload.admin_feedback = admin_feedback;
  }
  const res = await api.patch(`/submissions/${id}/status`, payload);
  return res.data;
};

// Delete submission
export const deleteSubmission = async (id) => {
  const res = await api.delete(`/submissions/${id}`);
  return res.data;
};

import api from "@/lib/api";

// Get all submissions (with pagination, status, search)
export const getAllSubmissions = async ({
  limit = 10,
  page = 1,
  category_id = "",
  status = "",
  is_finalist = "",
  search = "",
  registration_id = "",
  sub_theme = "",
  phase = "",
  sort_by = "",
  order = "",
} = {}) => {
  const params = { limit, page };
  if (category_id && category_id !== "ALL") params.category_id = category_id;
  if (status && status !== "ALL" && status !== "all") params.status = status;
  if (is_finalist !== undefined && is_finalist !== "" && is_finalist !== "ALL") {
    params.is_finalist = is_finalist;
  }
  if (search && search.trim()) params.search = search.trim();
  if (registration_id && registration_id.trim()) params.registration_id = registration_id.trim();
  if (sub_theme && sub_theme !== "ALL") params.sub_theme = sub_theme;
  if (phase && phase !== "ALL") params.phase = phase;
  if (sort_by && sort_by.trim()) params.sort_by = sort_by.trim();
  if (order && order.trim()) params.order = order.trim();

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

// Update submission finalist status (Top 10 Finalist)
export const patchSubmissionFinalist = async ({ id, is_finalist }) => {
  const res = await api.patch(`/submissions/${id}/finalist`, { is_finalist });
  return res.data;
};

// Delete submission
export const deleteSubmission = async (id) => {
  const res = await api.delete(`/submissions/${id}`);
  return res.data;
};

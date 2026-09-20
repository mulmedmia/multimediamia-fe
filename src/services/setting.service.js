import api from "@/lib/api";

export const DEFAULT_GUIDEBOOK_URL =
  "https://drive.google.com/drive/folders/1x34lDmoqSFdOfsxUpxpe2KiAaGT2zk5m?usp=sharing";

/**
 * Mengambil link guidebook publik
 */
export const getGuidebookSetting = async () => {
  try {
    const res = await api.get("/settings/guidebook");
    return res.data?.data?.guidebook_url || DEFAULT_GUIDEBOOK_URL;
  } catch (error) {
    console.error("Gagal mengambil setting guidebook:", error);
    return DEFAULT_GUIDEBOOK_URL;
  }
};

/**
 * Memperbarui link guidebook (khusus Admin)
 */
export const updateGuidebookSetting = async (guidebookUrl) => {
  const res = await api.put("/settings/guidebook", {
    guidebook_url: guidebookUrl,
  });
  return res.data?.data;
};

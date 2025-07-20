import api from '@/lib/api';

/**
 * Mengambil semua data gamifikasi untuk sebuah registrasi.
 * CATATAN: Backend belum memiliki endpoint ini.
 * Kita kembalikan data default untuk mencegah error.
 * @param {string} registrationId - ID dari registrasi peserta.
 * @returns {Promise<object>}
 */
export const getGamificationData = async (registrationId) => {
  console.warn("API for getGamificationData is not yet implemented on the backend.");
  return Promise.resolve({ points: 0, missions: [], redeemItems: [] });
};

/**
 * Mengirim request untuk menukar poin dengan item.
 * @param {string} itemId - ID dari item yang ingin di-redeem.
 * @returns {Promise<object>}
 */
export const redeemPoints = async (itemId) => {
  try {
    const response = await api.post('/gamification/redeem', { productId: itemId });
    return response.data;
  } catch (error) {
    console.error('Failed to redeem points:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────
// API Yapılandırma Sabitleri
// YEMEKİMNEREDE — Kullanıcı ve Adres Yönetimi
// ─────────────────────────────────────────────

const API_CONFIG = {
  // Production API sunucusu
  BASE_URL: 'https://yemekimnerde-production.up.railway.app',

  // API versiyon prefix'i
  API_PREFIX: '/v1',

  // Timeout süreleri (milisaniye)
  TIMEOUT: {
    REQUEST: 30000,  // 30 saniye — istek zaman aşımı
    CONNECT: 10000,  // 10 saniye — bağlantı zaman aşımı
  },

  // Varsayılan HTTP header'ları
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Endpoint tanımları
  ENDPOINTS: {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',

    // Users
    USER: (kullaniciId) => `/users/${kullaniciId}`,
    USER_PASSWORD: (kullaniciId) => `/users/${kullaniciId}/password`,

    // Addresses
    USER_ADDRESS: (kullaniciId, adresId) =>
      `/users/${kullaniciId}/addresses/${adresId}`,
    USER_ADDRESSES: (kullaniciId) => `/users/${kullaniciId}/addresses`,
  },
};

export default API_CONFIG;

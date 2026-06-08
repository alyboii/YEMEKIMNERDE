// ─────────────────────────────────────────────
// API Yapılandırma Sabitleri
// YEMEKİMNEREDE — Kullanıcı ve Adres Yönetimi
// ─────────────────────────────────────────────

const API_CONFIG = {
  // API Base URL - Lokal test için (Docker'daki sunucuya bağlanır)
  BASE_URL: 'http://localhost:3000',

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

    // Restaurants (Restoranlar)
    RESTAURANTS: '/restaurants',
    RESTAURANT: (restoranId) => `/restaurants/${restoranId}`,
    RESTAURANT_REVIEWS: (restoranId) => `/restaurants/${restoranId}/reviews`,
    RESTAURANTS_ONERI: '/restaurants/oneri',

    // Cart
    CART: '/cart',
    CART_ITEMS: '/cart/items',
    CART_ITEM: (itemId) => `/cart/items/${itemId}`,

    // Orders
    ORDERS: '/orders',
    ORDER: (orderId) => `/orders/${orderId}`,
  },
};

export default API_CONFIG;

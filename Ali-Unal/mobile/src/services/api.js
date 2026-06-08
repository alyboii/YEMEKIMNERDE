import axios from 'axios';
import SecureStorage from './secureStorage';

// API Base URL - Backend ekibinin hazırladığı canlı Railway sunucusu
const BASE_URL = 'https://yemekimnerde-production.up.railway.app/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// İstek çıkmadan önce araya girip, eğer token varsa başlığa (Header) ekle
api.interceptors.request.use(
  async (config) => {
    try {
      // Token, AuthService/SecureStorage ile kaydedildiği yerden okunur
      // (httpClient ile aynı kaynak — tutarlılık için)
      const token = await SecureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token okunamadı:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gelen yanıtlarda araya girip hata fırlatıldığında konsola daha net yazdır
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn('API Hatası:', error.response.status, error.response.data);
    } else {
      console.warn('Ağ Hatası:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

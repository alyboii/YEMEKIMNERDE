// ─────────────────────────────────────────────
// HTTP Client — Axios Instance + Network Interceptor
// Tüm API istek/yanıtlarını renkli konsol logları ile yazdırır
// ─────────────────────────────────────────────

import axios from 'axios';
import API_CONFIG from '../config/api.config';
import SecureStorage from './secureStorage';

// ─── Axios Instance Oluşturma ───
const httpClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`,
  timeout: API_CONFIG.TIMEOUT.REQUEST,
  headers: API_CONFIG.HEADERS,
});

// ─── Yardımcı: Şifre Alanlarını Maskele ───
const maskSensitiveData = (data) => {
  if (!data || typeof data !== 'object') return data;

  const masked = { ...data };
  const sensitiveKeys = ['sifre', 'mevcutSifre', 'yeniSifre', 'password', 'token'];

  sensitiveKeys.forEach((key) => {
    if (masked[key]) {
      masked[key] = '***';
    }
  });

  return masked;
};

// ─── Yardımcı: Yanıt Verisini Maskele ───
const maskResponseData = (data) => {
  if (!data || typeof data !== 'object') return data;

  const masked = { ...data };

  // Token'ı kısalt
  if (masked.token && typeof masked.token === 'string') {
    masked.token = masked.token.substring(0, 20) + '...';
  }

  return masked;
};

// ─── Yardımcı: Süre Hesapla ───
const formatDuration = (startTime) => {
  const duration = Date.now() - startTime;
  if (duration < 1000) return `${duration}ms`;
  return `${(duration / 1000).toFixed(2)}s`;
};

// ─── Ayraç Çizgisi ───
const SEPARATOR = '─'.repeat(60);

// ════════════════════════════════════════════════
// REQUEST INTERCEPTOR
// Her istekten önce çalışır:
//   1. JWT token'ı header'a ekler
//   2. İsteği konsola loglar
// ════════════════════════════════════════════════
httpClient.interceptors.request.use(
  async (config) => {
    // JWT token'ı Secure Storage'dan oku ve header'a ekle
    try {
      const token = await SecureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('⚠️ [Auth] Token okunamadı:', error.message);
    }

    // İstek başlangıç zamanını kaydet (süre ölçümü için)
    config.metadata = { startTime: Date.now() };

    // ─── Konsol Logu: REQUEST ───
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const fullUrl = `${config.baseURL}${config.url}`;

    console.log(`\n${SEPARATOR}`);
    console.log(`📤 REQUEST [${method}] ${fullUrl}`);
    console.log(`${SEPARATOR}`);

    // Header'ları logla (Authorization varsa kısalt)
    const logHeaders = { ...config.headers };
    if (logHeaders.Authorization) {
      logHeaders.Authorization = logHeaders.Authorization.substring(0, 30) + '...';
    }
    console.log('   📋 Headers:', JSON.stringify(logHeaders, null, 2));

    // Body varsa logla (hassas veriler maskelenir)
    if (config.data) {
      const maskedBody = maskSensitiveData(
        typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      );
      console.log('   📦 Body:', JSON.stringify(maskedBody, null, 2));
    }

    // Query parametreleri varsa logla
    if (config.params) {
      console.log('   🔍 Params:', JSON.stringify(config.params, null, 2));
    }

    console.log(`${SEPARATOR}\n`);

    return config;
  },
  (error) => {
    console.error('\n❌ REQUEST INTERCEPTOR HATASI:', error.message);
    return Promise.reject(error);
  }
);

// ════════════════════════════════════════════════
// RESPONSE INTERCEPTOR
// Her yanıt geldiğinde çalışır:
//   1. Başarılı yanıtları loglar
//   2. Hata yanıtlarını detaylı loglar
// ════════════════════════════════════════════════
httpClient.interceptors.response.use(
  // ─── Başarılı Yanıt (2xx) ───
  (response) => {
    const { config } = response;
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const duration = formatDuration(config.metadata?.startTime);
    const status = response.status;
    const statusText = response.statusText || '';

    console.log(`\n${SEPARATOR}`);
    console.log(`📥 RESPONSE [${status} ${statusText}] ${method} ${config.url} (${duration})`);
    console.log(`${SEPARATOR}`);

    // Yanıt verisini logla
    if (response.data) {
      const maskedData = maskResponseData(response.data);
      console.log('   ✅ Data:', JSON.stringify(maskedData, null, 2));
    }

    console.log(`${SEPARATOR}\n`);

    return response;
  },

  // ─── Hata Yanıtı (4xx, 5xx, Network Error) ───
  (error) => {
    const { config, response } = error;
    const method = config?.method?.toUpperCase() || 'UNKNOWN';
    const duration = formatDuration(config?.metadata?.startTime);

    console.log(`\n${'═'.repeat(60)}`);

    if (response) {
      // ─── Sunucu Hatası (HTTP Status Code var) ───
      const status = response.status;
      const statusText = response.statusText || '';

      console.log(`❌ ERROR [${status} ${statusText}] ${method} ${config.url} (${duration})`);
      console.log(`${'═'.repeat(60)}`);

      // Hata detaylarını logla
      if (response.data) {
        console.log('   🚫 Error Data:', JSON.stringify(response.data, null, 2));
      }

      // HTTP Status Code açıklamaları
      const statusMessages = {
        400: '📝 Geçersiz istek — Gönderilen veri hatalı',
        401: '🔒 Yetkisiz — Token geçersiz veya süresi dolmuş',
        403: '🚷 Yasaklı — Bu işlem için yetkiniz yok',
        404: '🔍 Bulunamadı — İstenen kaynak mevcut değil',
        409: '⚡ Çakışma — Bu kayıt zaten mevcut (örn. email kullanımda)',
        422: '📋 İşlenemedi — Doğrulama hatası',
        429: '⏳ Çok fazla istek — Rate limit aşıldı',
        500: '💥 Sunucu hatası — Sunucuda beklenmeyen bir hata oluştu',
        502: '🌐 Bad Gateway — Sunucuya ulaşılamıyor',
        503: '🔧 Servis kullanılamıyor — Sunucu bakımda',
      };

      if (statusMessages[status]) {
        console.log(`   ℹ️  ${statusMessages[status]}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      // ─── Timeout Hatası ───
      console.log(`⏰ TIMEOUT ERROR — ${method} ${config?.url} (${API_CONFIG.TIMEOUT.REQUEST / 1000}s aşıldı)`);
      console.log(`${'═'.repeat(60)}`);
      console.log('   ℹ️  İstek zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.');
    } else if (error.message === 'Network Error') {
      // ─── Network Hatası ───
      console.log(`🌐 NETWORK ERROR — ${method} ${config?.url}`);
      console.log(`${'═'.repeat(60)}`);
      console.log('   ℹ️  Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    } else {
      // ─── Bilinmeyen Hata ───
      console.log(`🔥 UNKNOWN ERROR — ${method} ${config?.url}`);
      console.log(`${'═'.repeat(60)}`);
      console.log('   ℹ️  Hata:', error.message);
    }

    console.log(`${'═'.repeat(60)}\n`);

    // Hatayı standart bir formata dönüştür
    const formattedError = {
      status: response?.status || 0,
      message: response?.data?.mesaj
        || response?.data?.message
        || getDefaultErrorMessage(response?.status, error),
      data: response?.data || null,
      isNetworkError: !response,
      isTimeout: error.code === 'ECONNABORTED',
    };

    return Promise.reject(formattedError);
  }
);

// ─── Yardımcı: Varsayılan Hata Mesajları ───
const getDefaultErrorMessage = (status, error) => {
  const messages = {
    400: 'Gönderilen bilgilerde hata var. Lütfen kontrol edin.',
    401: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
    403: 'Bu işlem için yetkiniz bulunmuyor.',
    404: 'İstenen kaynak bulunamadı.',
    409: 'Bu bilgilerle zaten bir kayıt mevcut.',
    422: 'Girilen bilgileri kontrol edin.',
    429: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.',
    500: 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  };

  if (status && messages[status]) return messages[status];
  if (error?.code === 'ECONNABORTED') return 'İstek zaman aşımına uğradı.';
  if (error?.message === 'Network Error') return 'İnternet bağlantınızı kontrol edin.';
  return 'Beklenmeyen bir hata oluştu.';
};

export default httpClient;

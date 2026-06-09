// ─────────────────────────────────────────────
// Secure Storage — JWT Token Yönetimi
// react-native-keychain (gerçek cihaz)
// in-memory fallback (simülatör / keychain yok)
// ─────────────────────────────────────────────

import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'yemekimnerede_auth';

// Keychain çalışmadığında bellek içi yedek (simülatör için)
let _memoryStore = null;

const SecureStorage = {
  async saveAuthData(token, user) {
    const authData = { token, user };
    // Her iki yere de yaz (keychain + memory)
    _memoryStore = authData;
    try {
      await Keychain.setGenericPassword('auth_token', JSON.stringify(authData), {
        service: SERVICE_NAME,
      });
      console.log('🔐 [SecureStorage] Keychain\'e kaydedildi');
    } catch (error) {
      console.warn('🔐 [SecureStorage] Keychain hatası, memory store kullanılıyor:', error.message);
    }
    return true;
  },

  async getAuthData() {
    // Önce Keychain'i dene
    try {
      const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
      if (credentials?.password) {
        const authData = JSON.parse(credentials.password);
        _memoryStore = authData; // memory'yi de senkronize et
        console.log('🔐 [SecureStorage] Keychain\'den okundu');
        return authData;
      }
    } catch (error) {
      console.warn('🔐 [SecureStorage] Keychain okunamadı:', error.message);
    }

    // Memory store'a bak
    if (_memoryStore) {
      console.log('🔐 [SecureStorage] Memory store\'dan okundu');
      return _memoryStore;
    }

    console.log('🔐 [SecureStorage] Kayıtlı auth verisi bulunamadı');
    return null;
  },

  async getToken() {
    const authData = await this.getAuthData();
    return authData?.token || null;
  },

  async getUser() {
    const authData = await this.getAuthData();
    return authData?.user || null;
  },

  async updateUser(updatedUser) {
    try {
      const authData = await this.getAuthData();
      if (authData) {
        await this.saveAuthData(authData.token, updatedUser);
        console.log('🔐 [SecureStorage] Kullanıcı bilgisi güncellendi');
        return true;
      }
      return false;
    } catch (error) {
      console.error('🔐 [SecureStorage] Güncelleme hatası:', error.message);
      return false;
    }
  },

  async clearAuthData() {
    _memoryStore = null;
    try {
      await Keychain.resetGenericPassword({ service: SERVICE_NAME });
    } catch (error) {
      console.warn('🔐 [SecureStorage] Keychain temizlenemedi:', error.message);
    }
    console.log('🔐 [SecureStorage] Auth verisi temizlendi (logout)');
    return true;
  },

  async hasAuthData() {
    const authData = await this.getAuthData();
    return authData !== null && authData.token !== undefined;
  },
};

export default SecureStorage;

// ─────────────────────────────────────────────
// Secure Storage — JWT Token Yönetimi
// react-native-keychain (gerçek cihaz) +
// AsyncStorage fallback (simülatör/keychain hatası)
// ─────────────────────────────────────────────

import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_NAME = 'yemekimnerede_auth';
const ASYNC_KEY = '@yemekimnerede_auth';

const saveToAsync = async (data) => {
  await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(data));
};

const getFromAsync = async () => {
  const raw = await AsyncStorage.getItem(ASYNC_KEY);
  return raw ? JSON.parse(raw) : null;
};

const clearFromAsync = async () => {
  await AsyncStorage.removeItem(ASYNC_KEY);
};

const SecureStorage = {
  async saveAuthData(token, user) {
    const authData = { token, user };
    try {
      await Keychain.setGenericPassword('auth_token', JSON.stringify(authData), {
        service: SERVICE_NAME,
      });
      await saveToAsync(authData);
      console.log('🔐 [SecureStorage] Keychain\'e kaydedildi');
      return true;
    } catch (error) {
      console.warn('🔐 [SecureStorage] Keychain hatası, AsyncStorage kullanılıyor:', error.message);
      try {
        await saveToAsync(authData);
        console.log('🔐 [SecureStorage] AsyncStorage\'a kaydedildi');
        return true;
      } catch (asyncError) {
        console.error('🔐 [SecureStorage] Kaydetme hatası:', asyncError.message);
        return false;
      }
    }
  },

  async getAuthData() {
    try {
      const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
      if (credentials?.password) {
        console.log('🔐 [SecureStorage] Keychain\'den okundu');
        return JSON.parse(credentials.password);
      }
    } catch (error) {
      console.warn('🔐 [SecureStorage] Keychain okunamadı, AsyncStorage\'a düşülüyor:', error.message);
    }
    try {
      const authData = await getFromAsync();
      if (authData) {
        console.log('🔐 [SecureStorage] AsyncStorage\'dan okundu');
        return authData;
      }
    } catch (error) {
      console.error('🔐 [SecureStorage] Okuma hatası:', error.message);
    }
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
    try {
      await Keychain.resetGenericPassword({ service: SERVICE_NAME });
    } catch (error) {
      console.warn('🔐 [SecureStorage] Keychain temizlenemedi:', error.message);
    }
    try {
      await clearFromAsync();
    } catch (error) {
      console.error('🔐 [SecureStorage] Temizleme hatası:', error.message);
    }
    console.log('🔐 [SecureStorage] Auth verisi temizlendi');
    return true;
  },

  async hasAuthData() {
    const authData = await this.getAuthData();
    return authData !== null && authData.token !== undefined;
  },
};

export default SecureStorage;

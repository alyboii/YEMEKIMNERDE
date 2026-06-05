// ─────────────────────────────────────────────
// Secure Storage — JWT Token Yönetimi
// react-native-keychain ile güvenli depolama
// ─────────────────────────────────────────────

import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'yemekimnerede_auth';

const SecureStorage = {
  /**
   * JWT token'ı cihazın güvenli deposuna kaydeder.
   * @param {string} token - JWT access token
   * @param {object} user  - Kullanıcı objesi (JSON olarak saklanır)
   */
  async saveAuthData(token, user) {
    try {
      const authData = JSON.stringify({ token, user });
      await Keychain.setGenericPassword('auth_token', authData, {
        service: SERVICE_NAME,
      });
      console.log('🔐 [SecureStorage] Auth verisi güvenli depoya kaydedildi');
      return true;
    } catch (error) {
      console.error('🔐 [SecureStorage] Kaydetme hatası:', error.message);
      return false;
    }
  },

  /**
   * Güvenli depodan JWT token ve kullanıcı bilgisini okur.
   * @returns {{ token: string, user: object } | null}
   */
  async getAuthData() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: SERVICE_NAME,
      });

      if (credentials && credentials.password) {
        const authData = JSON.parse(credentials.password);
        console.log('🔐 [SecureStorage] Auth verisi okundu');
        return authData;
      }

      console.log('🔐 [SecureStorage] Kayıtlı auth verisi bulunamadı');
      return null;
    } catch (error) {
      console.error('🔐 [SecureStorage] Okuma hatası:', error.message);
      return null;
    }
  },

  /**
   * Sadece JWT token'ı döndürür.
   * @returns {string | null}
   */
  async getToken() {
    const authData = await this.getAuthData();
    return authData?.token || null;
  },

  /**
   * Sadece kullanıcı objesini döndürür.
   * @returns {object | null}
   */
  async getUser() {
    const authData = await this.getAuthData();
    return authData?.user || null;
  },

  /**
   * Kullanıcı objesini günceller (token değişmeden).
   * @param {object} updatedUser - Güncellenmiş kullanıcı objesi
   */
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

  /**
   * Tüm auth verilerini güvenli depodan temizler (logout).
   */
  async clearAuthData() {
    try {
      await Keychain.resetGenericPassword({ service: SERVICE_NAME });
      console.log('🔐 [SecureStorage] Auth verisi temizlendi (logout)');
      return true;
    } catch (error) {
      console.error('🔐 [SecureStorage] Temizleme hatası:', error.message);
      return false;
    }
  },

  /**
   * Auth verisi var mı kontrol eder.
   * @returns {boolean}
   */
  async hasAuthData() {
    const authData = await this.getAuthData();
    return authData !== null && authData.token !== undefined;
  },
};

export default SecureStorage;

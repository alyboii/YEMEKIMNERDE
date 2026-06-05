// ─────────────────────────────────────────────
// User Service — Kullanıcı ve Adres API İstekleri
// GET    /v1/users/{kullaniciId}
// PUT    /v1/users/{kullaniciId}
// PUT    /v1/users/{kullaniciId}/password
// DELETE /v1/users/{kullaniciId}
// DELETE /v1/users/{kullaniciId}/addresses/{adresId}
// POST   /v1/users/{kullaniciId}/addresses
// ─────────────────────────────────────────────

import httpClient from './httpClient';
import SecureStorage from './secureStorage';
import API_CONFIG from '../config/api.config';

const UserService = {
  /**
   * Kullanıcı profil bilgilerini getirir.
   *
   * @param {string} kullaniciId - Kullanıcının benzersiz kimliği (_id)
   *
   * @returns {Promise<object>} Kullanıcı objesi
   *   { _id, ad, soyad, email, telefon, adresler, olusturmaTarihi }
   *
   * Hata yanıtları:
   *   401 — Yetkisiz erişim
   *   404 — Kullanıcı bulunamadı
   */
  async getUser(kullaniciId) {
    console.log('\n👤 [UserService] Profil bilgileri getiriliyor...');
    console.log(`   🆔 Kullanıcı ID: ${kullaniciId}`);

    const response = await httpClient.get(
      API_CONFIG.ENDPOINTS.USER(kullaniciId)
    );

    console.log('👤 [UserService] Profil bilgileri başarıyla alındı');
    return response.data;
  },

  /**
   * Kullanıcı profil bilgilerini günceller.
   *
   * @param {string} kullaniciId - Kullanıcının benzersiz kimliği
   * @param {object} updateData
   * @param {string} [updateData.ad]      - Güncel ad
   * @param {string} [updateData.soyad]   - Güncel soyad
   * @param {string} [updateData.telefon] - Güncel telefon
   *
   * @returns {Promise<object>} Güncellenmiş kullanıcı objesi
   *
   * Hata yanıtları:
   *   400 — Geçersiz veri
   *   401 — Yetkisiz erişim
   *   404 — Kullanıcı bulunamadı
   */
  async updateUser(kullaniciId, updateData) {
    console.log('\n👤 [UserService] Profil güncelleniyor...');
    console.log(`   🆔 Kullanıcı ID: ${kullaniciId}`);
    console.log(`   📝 Güncellenen alanlar: ${Object.keys(updateData).join(', ')}`);

    const response = await httpClient.put(
      API_CONFIG.ENDPOINTS.USER(kullaniciId),
      updateData
    );

    // Secure Storage'daki kullanıcı bilgisini de güncelle
    const updatedUser = response.data?.kullanici || response.data;
    if (updatedUser) {
      await SecureStorage.updateUser(updatedUser);
    }

    console.log('👤 [UserService] Profil başarıyla güncellendi');
    return response.data;
  },

  /**
   * Kullanıcı şifresini değiştirir.
   *
   * @param {string} kullaniciId   - Kullanıcının benzersiz kimliği
   * @param {string} mevcutSifre   - Mevcut şifre
   * @param {string} yeniSifre     - Yeni şifre (min 8 karakter)
   *
   * @returns {Promise<{ mesaj: string }>}
   *
   * Hata yanıtları:
   *   400 — Geçersiz şifre formatı
   *   401 — Mevcut şifre yanlış
   */
  async changePassword(kullaniciId, mevcutSifre, yeniSifre) {
    console.log('\n🔒 [UserService] Şifre değiştirme işlemi başlatılıyor...');
    console.log(`   🆔 Kullanıcı ID: ${kullaniciId}`);

    const response = await httpClient.put(
      API_CONFIG.ENDPOINTS.USER_PASSWORD(kullaniciId),
      { mevcutSifre, yeniSifre }
    );

    console.log('🔒 [UserService] Şifre başarıyla değiştirildi');
    return response.data;
  },

  /**
   * Kullanıcı hesabını kalıcı olarak siler.
   *
   * @param {string} kullaniciId - Kullanıcının benzersiz kimliği
   *
   * @returns {Promise<void>}
   *
   * Hata yanıtları:
   *   401 — Yetkisiz erişim
   *   404 — Kullanıcı bulunamadı
   */
  async deleteUser(kullaniciId) {
    console.log('\n🗑️ [UserService] Hesap silme işlemi başlatılıyor...');
    console.log(`   🆔 Kullanıcı ID: ${kullaniciId}`);

    await httpClient.delete(API_CONFIG.ENDPOINTS.USER(kullaniciId));

    // Secure Storage'ı temizle
    await SecureStorage.clearAuthData();

    console.log('🗑️ [UserService] Hesap başarıyla silindi — Tüm veriler temizlendi');
    return true;
  },

  /**
   * Kullanıcının belirli bir adresini siler.
   *
   * @param {string} kullaniciId - Kullanıcının benzersiz kimliği
   * @param {string} adresId     - Silinecek adresin kimliği
   *
   * @returns {Promise<void>}
   *
   * Hata yanıtları:
   *   401 — Yetkisiz erişim
   *   404 — Adres bulunamadı
   */
  async deleteAddress(kullaniciId, adresId) {
    console.log('\n📍 [UserService] Adres silme işlemi başlatılıyor...');
    console.log(`   🆔 Kullanıcı ID: ${kullaniciId}`);
    console.log(`   📍 Adres ID: ${adresId}`);

    await httpClient.delete(
      API_CONFIG.ENDPOINTS.USER_ADDRESS(kullaniciId, adresId)
    );

    console.log('📍 [UserService] Adres başarıyla silindi');
    return true;
  },

  /**
   * Kullanıcının tüm adreslerini getirir.
   * Not: Bu bilgi genelde getUser yanıtında adresler[] dizisinde gelir.
   * Eğer ayrı bir endpoint varsa burada kullanılır.
   *
   * @param {string} kullaniciId - Kullanıcının benzersiz kimliği
   * @returns {Promise<Array>} Adresler dizisi
   */
  async getAddresses(kullaniciId) {
    console.log('\n📍 [UserService] Adresler getiriliyor...');
    console.log(`   🆔 Kullanıcı ID: ${kullaniciId}`);

    // Adresler kullanıcı objesinin içinde dönüyor
    const response = await httpClient.get(
      API_CONFIG.ENDPOINTS.USER(kullaniciId)
    );

    const adresler = response.data?.adresler || [];
    console.log(`📍 [UserService] ${adresler.length} adres bulundu`);

    return adresler;
  },
};

export default UserService;

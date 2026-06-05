// ─────────────────────────────────────────────
// Auth Service — Kimlik Doğrulama API İstekleri
// POST /v1/auth/register
// POST /v1/auth/login
// ─────────────────────────────────────────────

import httpClient from './httpClient';
import SecureStorage from './secureStorage';
import API_CONFIG from '../config/api.config';

const AuthService = {
  /**
   * Yeni kullanıcı kaydı oluşturur.
   *
   * @param {object} userData
   * @param {string} userData.ad       - Kullanıcının adı (min 2 karakter)
   * @param {string} userData.soyad    - Kullanıcının soyadı (min 2 karakter)
   * @param {string} userData.email    - Geçerli e-posta adresi
   * @param {string} userData.sifre    - Şifre (min 8 karakter)
   * @param {string} [userData.telefon] - Telefon numarası (opsiyonel)
   *
   * @returns {Promise<{ token: string, kullanici: object }>}
   *
   * Başarılı yanıt (201):
   *   { token: "eyJ...", kullanici: { _id, ad, soyad, email, telefon } }
   *
   * Hata yanıtları:
   *   400 — Geçersiz istek (eksik/hatalı alan)
   *   409 — E-posta zaten kullanımda
   */
  async register({ ad, soyad, email, sifre, telefon }) {
    console.log('\n🔑 [AuthService] Kayıt işlemi başlatılıyor...');
    console.log(`   📧 Email: ${email}`);
    console.log(`   👤 Ad Soyad: ${ad} ${soyad}`);

    const response = await httpClient.post(API_CONFIG.ENDPOINTS.REGISTER, {
      ad,
      soyad,
      email,
      sifre,
      telefon: telefon || undefined,
    });

    const { token, kullanici } = response.data;

    // Token ve kullanıcı bilgisini Secure Storage'a kaydet
    if (token && kullanici) {
      await SecureStorage.saveAuthData(token, kullanici);
      console.log('🔑 [AuthService] Kayıt başarılı — Token kaydedildi');
    }

    return response.data;
  },

  /**
   * Kullanıcı girişi yapar ve JWT token alır.
   *
   * @param {object} credentials
   * @param {string} credentials.email - E-posta adresi
   * @param {string} credentials.sifre - Şifre
   *
   * @returns {Promise<{ token: string, kullanici: object }>}
   *
   * Başarılı yanıt (200):
   *   { token: "eyJ...", kullanici: { _id, ad, soyad, email, telefon } }
   *
   * Hata yanıtları:
   *   401 — Geçersiz e-posta veya şifre
   */
  async login({ email, sifre }) {
    console.log('\n🔑 [AuthService] Giriş işlemi başlatılıyor...');
    console.log(`   📧 Email: ${email}`);

    const response = await httpClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email,
      sifre,
    });

    const { token, kullanici } = response.data;

    // Token ve kullanıcı bilgisini Secure Storage'a kaydet
    if (token && kullanici) {
      await SecureStorage.saveAuthData(token, kullanici);
      console.log('🔑 [AuthService] Giriş başarılı — Token kaydedildi');
      console.log(`   👤 Kullanıcı ID: ${kullanici._id}`);
    }

    return response.data;
  },

  /**
   * Kullanıcı çıkış yapar (token temizlenir).
   */
  async logout() {
    console.log('\n🔑 [AuthService] Çıkış işlemi başlatılıyor...');

    await SecureStorage.clearAuthData();
    console.log('🔑 [AuthService] Çıkış başarılı — Token temizlendi');

    return true;
  },

  /**
   * Kayıtlı auth verisi var mı kontrol eder (app açılışında).
   * @returns {Promise<{ token: string, user: object } | null>}
   */
  async checkAuthState() {
    console.log('\n🔑 [AuthService] Auth durumu kontrol ediliyor...');

    const authData = await SecureStorage.getAuthData();

    if (authData?.token) {
      console.log('🔑 [AuthService] Mevcut oturum bulundu');
      return authData;
    }

    console.log('🔑 [AuthService] Aktif oturum bulunamadı');
    return null;
  },
};

export default AuthService;

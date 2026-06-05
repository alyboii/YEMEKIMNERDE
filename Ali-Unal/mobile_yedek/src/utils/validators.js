// ─────────────────────────────────────────────
// Validasyon Fonksiyonları
// Real-time form doğrulama kuralları
// ─────────────────────────────────────────────

const Validators = {
  /**
   * E-posta format kontrolü
   * @param {string} email
   * @returns {string|null} Hata mesajı veya null
   */
  email(email) {
    if (!email || email.trim().length === 0) {
      return 'E-posta adresi zorunludur';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return 'Geçerli bir e-posta adresi girin';
    }

    return null;
  },

  /**
   * Şifre güçlülük kontrolü
   * @param {string} sifre
   * @returns {string|null} Hata mesajı veya null
   */
  password(sifre) {
    if (!sifre || sifre.length === 0) {
      return 'Şifre zorunludur';
    }

    if (sifre.length < 8) {
      return 'Şifre en az 8 karakter olmalıdır';
    }

    // En az bir büyük harf
    if (!/[A-Z]/.test(sifre)) {
      return 'Şifre en az bir büyük harf içermelidir';
    }

    // En az bir küçük harf
    if (!/[a-z]/.test(sifre)) {
      return 'Şifre en az bir küçük harf içermelidir';
    }

    // En az bir rakam
    if (!/[0-9]/.test(sifre)) {
      return 'Şifre en az bir rakam içermelidir';
    }

    return null;
  },

  /**
   * Yeni şifre kontrolü (şifre değiştirme formu için)
   * Mevcut şifre ile aynı olmamalı
   * @param {string} yeniSifre
   * @param {string} mevcutSifre
   * @returns {string|null}
   */
  newPassword(yeniSifre, mevcutSifre) {
    const baseError = Validators.password(yeniSifre);
    if (baseError) return baseError;

    if (yeniSifre === mevcutSifre) {
      return 'Yeni şifre mevcut şifreden farklı olmalıdır';
    }

    return null;
  },

  /**
   * İsim kontrolü (ad veya soyad)
   * @param {string} name
   * @param {string} fieldName - Alan adı (hata mesajı için)
   * @returns {string|null}
   */
  name(name, fieldName = 'Bu alan') {
    if (!name || name.trim().length === 0) {
      return `${fieldName} zorunludur`;
    }

    if (name.trim().length < 2) {
      return `${fieldName} en az 2 karakter olmalıdır`;
    }

    if (name.trim().length > 50) {
      return `${fieldName} en fazla 50 karakter olabilir`;
    }

    // Sadece harf ve boşluk içermeli
    if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(name.trim())) {
      return `${fieldName} sadece harf içermelidir`;
    }

    return null;
  },

  /**
   * Telefon numarası kontrolü
   * @param {string} telefon
   * @returns {string|null}
   */
  phone(telefon) {
    // Telefon opsiyonel
    if (!telefon || telefon.trim().length === 0) {
      return null;
    }

    // +90 ile başlamalı, toplam 13 karakter
    const phoneRegex = /^\+90[0-9]{10}$/;
    // Veya başında + olmadan 10-11 haneli
    const phoneRegexAlt = /^0?[0-9]{10}$/;

    if (!phoneRegex.test(telefon.trim()) && !phoneRegexAlt.test(telefon.trim())) {
      return 'Geçerli bir telefon numarası girin (örn: +905551234567)';
    }

    return null;
  },

  /**
   * Zorunlu alan kontrolü
   * @param {string} value
   * @param {string} fieldName
   * @returns {string|null}
   */
  required(value, fieldName = 'Bu alan') {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return `${fieldName} zorunludur`;
    }
    return null;
  },

  /**
   * Birden fazla validasyon kuralını sırayla çalıştırır.
   * İlk hata bulunduğunda durur.
   * @param {string} value - Kontrol edilecek değer
   * @param {Array<Function>} rules - Validasyon fonksiyonları dizisi
   * @returns {string|null}
   */
  compose(value, rules) {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  },
};

// ─── Kayıt formu validasyon şeması ───
export const registerValidationRules = {
  ad: (value) => Validators.name(value, 'Ad'),
  soyad: (value) => Validators.name(value, 'Soyad'),
  email: (value) => Validators.email(value),
  sifre: (value) => Validators.password(value),
  telefon: (value) => Validators.phone(value),
};

// ─── Giriş formu validasyon şeması ───
export const loginValidationRules = {
  email: (value) => Validators.email(value),
  sifre: (value) => Validators.required(value, 'Şifre'),
};

// ─── Profil güncelleme validasyon şeması ───
export const profileValidationRules = {
  ad: (value) => Validators.name(value, 'Ad'),
  soyad: (value) => Validators.name(value, 'Soyad'),
  telefon: (value) => Validators.phone(value),
};

// ─── Şifre değiştirme validasyon şeması ───
export const passwordValidationRules = {
  mevcutSifre: (value) => Validators.required(value, 'Mevcut şifre'),
  yeniSifre: (value) => Validators.password(value),
};

export default Validators;

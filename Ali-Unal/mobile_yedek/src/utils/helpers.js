// ─────────────────────────────────────────────
// Yardımcı Fonksiyonlar
// Uygulama genelinde kullanılan ortak utility'ler
// ─────────────────────────────────────────────

/**
 * Telefon numarasını görüntüleme formatına çevirir.
 * +905551234567 → +90 555 123 45 67
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 12 && cleaned.startsWith('90')) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }

  if (cleaned.length === 10) {
    return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
};

/**
 * Tarihi Türkçe formata çevirir.
 * 2026-01-15T10:00:00Z → 15 Ocak 2026
 * @param {string} dateString - ISO 8601 tarih string'i
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * İlk harfleri büyük yazar.
 * ahmet yılmaz → Ahmet Yılmaz
 * @param {string} text
 * @returns {string}
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Kullanıcının baş harflerini döndürür (Avatar için).
 * { ad: 'Ali', soyad: 'Ünal' } → 'AÜ'
 * @param {object} user
 * @returns {string}
 */
export const getUserInitials = (user) => {
  if (!user) return '?';
  const first = user.ad?.charAt(0)?.toUpperCase() || '';
  const last = user.soyad?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}` || '?';
};

/**
 * Adres objesini tek satır string'e çevirir.
 * { baslik: 'Ev', adres: 'Atatürk Cad.', sehir: 'İstanbul' } → 'Atatürk Cad., İstanbul'
 * @param {object} address
 * @returns {string}
 */
export const formatAddress = (address) => {
  if (!address) return '';

  const parts = [address.adres, address.ilce, address.sehir].filter(Boolean);
  return parts.join(', ');
};

/**
 * Kısa bir gecikme oluşturur (async).
 * @param {number} ms - Milisaniye
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

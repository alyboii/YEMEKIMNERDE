// ─────────────────────────────────────────────
// Restaurant Service — Restoran ve Menü API İstekleri
// GET /v1/restaurants            → tüm aktif restoranlar (puana göre sıralı)
// GET /v1/restaurants/{id}       → restoran detayı + menüsü
// ─────────────────────────────────────────────

import httpClient from './httpClient';
import API_CONFIG from '../config/api.config';

// ════════════════════════════════════════════════
// MAPPING (Çevirmen) Katmanı
// Backend Türkçe alan adları döndürür (ad, puan, gorselUrl...).
// Ekranlar İngilizce alan adları bekler (title, rating, image...).
// Aşağıdaki fonksiyonlar gelen veriyi ekranların anladığı formata çevirir.
// ════════════════════════════════════════════════

/**
 * Tek bir restoran objesini ekran formatına çevirir.
 *
 * API formatı:   { _id, ad, mutfakTuru, puan, gorselUrl, konum: { sehir, adres } }
 * Ekran formatı: { id, title, category, rating, image, location, ...ham }
 */
export const normalizeRestaurant = (r) => {
  if (!r) return null;

  return {
    // ─── Ekranların kullandığı alanlar ───
    id: r._id,
    title: r.ad,
    category: r.mutfakTuru,                       // "Türk", "İtalyan"...
    rating: r.puan != null ? r.puan.toFixed(1) : '0.0',
    image: r.gorselUrl || '',
    location: r.konum ? `${r.konum.sehir}` : '',
    address: r.konum ? r.konum.adres : '',
    desc: r.mutfakTuru ? `${r.mutfakTuru} mutfağı` : '',

    // ─── İleride lazım olabilecek ham alanlar ───
    calismaSaatleri: r.calismaSaatleri || [],
    konum: r.konum || null,
    raw: r, // gerektiğinde orijinal veriye erişmek için
  };
};

/**
 * Tek bir menü öğesini ekran formatına çevirir.
 *
 * API formatı:   { _id, ad, aciklama, fiyat, gorselUrl, etiketler, kategori }
 * Ekran formatı: { id, title, desc, price, image, tags, category }
 */
export const normalizeMenuItem = (m) => {
  if (!m) return null;

  return {
    id: m._id,
    title: m.ad,
    desc: m.aciklama || '',
    price: m.fiyat,                               // sayı (örn 180)
    priceLabel: m.fiyat != null ? `${m.fiyat} ₺` : '',
    image: m.gorselUrl || '',
    tags: m.etiketler || [],
    category: m.kategori || 'Diğer',
    raw: m,
  };
};

/**
 * Tek bir yorumu ekran formatına çevirir.
 * API: { _id, ad, puan, yorum, createdAt }
 */
export const normalizeReview = (y) => {
  if (!y) return null;
  return {
    id: y._id,
    ad: y.ad || 'Anonim',
    puan: y.puan,
    yorum: y.yorum || '',
    tarih: y.createdAt,
  };
};

const RestaurantService = {
  /**
   * Tüm aktif restoranları getirir (backend zaten puana göre sıralı döndürür).
   *
   * @returns {Promise<Array>} Ekran formatına çevrilmiş restoran dizisi
   */
  async getRestaurants() {
    console.log('\n🍽️ [RestaurantService] Restoranlar getiriliyor...');

    const response = await httpClient.get(API_CONFIG.ENDPOINTS.RESTAURANTS);
    const liste = Array.isArray(response.data) ? response.data : [];

    console.log(`🍽️ [RestaurantService] ${liste.length} restoran alındı`);
    return liste.map(normalizeRestaurant);
  },

  /**
   * Belirli bir restoranın detayını ve menüsünü getirir.
   *
   * @param {string} restoranId - Restoranın _id'si
   * @returns {Promise<{ restoran: object, menu: Array }>}
   *          restoran ve menu ekran formatına çevrilmiş olarak döner
   */
  async getRestaurantDetail(restoranId) {
    console.log('\n🍽️ [RestaurantService] Restoran detayı getiriliyor...');
    console.log(`   🆔 Restoran ID: ${restoranId}`);

    const response = await httpClient.get(
      API_CONFIG.ENDPOINTS.RESTAURANT(restoranId)
    );

    // API yanıtı: { restoran: {...}, menu: [...], yorumlar: [...] }
    const restoran = normalizeRestaurant(response.data?.restoran);
    const menu = (response.data?.menu || []).map(normalizeMenuItem);
    const yorumlar = (response.data?.yorumlar || []).map(normalizeReview);

    console.log(`🍽️ [RestaurantService] Detay alındı — ${menu.length} menü, ${yorumlar.length} yorum`);
    return { restoran, menu, yorumlar };
  },

  /**
   * Restorana yeni yorum / puan ekler (giriş gerekli).
   *
   * @param {string} restoranId
   * @param {number} puan - 1-5
   * @param {string} [yorum]
   * @returns {Promise<object>} Eklenen yorum
   */
  async addReview(restoranId, puan, yorum = '') {
    console.log(`\n⭐ [RestaurantService] Yorum ekleniyor (puan ${puan})...`);
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.RESTAURANT_REVIEWS(restoranId),
      { puan, yorum }
    );
    console.log('⭐ [RestaurantService] Yorum eklendi');
    return normalizeReview(response.data);
  },

  /**
   * "Sana Özel" sıralamayı SUNUCUDAN alır.
   * Tercihler (mutfak türü ilgisi) sunucuya gönderilir, sıralama sunucuda yapılır.
   *
   * @param {object} tercihler - { 'Türk': 2, 'Japon': 1 }
   * @returns {Promise<Array>} Sıralı, normalize edilmiş restoran listesi
   */
  async getRecommendedRestaurants(tercihler = {}) {
    console.log('\n✨ [RestaurantService] Sunucu önerisi isteniyor...');
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.RESTAURANTS_ONERI,
      { tercihler }
    );
    const liste = Array.isArray(response.data) ? response.data : [];
    console.log(`✨ [RestaurantService] Sunucudan ${liste.length} öneri alındı`);
    return liste.map(normalizeRestaurant);
  },
};

export default RestaurantService;

// ─────────────────────────────────────────────
// Cart Service — Sepet API İstekleri
// GET    /v1/cart — Sepeti görüntüle
// POST   /v1/cart/items — Sepete ürün ekle
// PUT    /v1/cart/items/{itemId} — Miktar güncelle
// DELETE /v1/cart/items/{itemId} — Sepetten çıkar
// ─────────────────────────────────────────────

import httpClient from './httpClient';
import API_CONFIG from '../config/api.config';

const CartService = {
  /**
   * Sepetteki tüm ürünleri getirir.
   * @returns {Promise<Array>} Sepet ürün dizisi [{ _id, name, price, quantity }]
   */
  async getCart() {
    console.log('\n🛒 [CartService] Sepet bilgileri getiriliyor...');
    const response = await httpClient.get(API_CONFIG.ENDPOINTS.CART);
    return response.data;
  },

  /**
   * Sepete yeni ürün ekler veya varsa adetini artırır.
   * @param {string} name - Ürün adı
   * @param {number} price - Ürün fiyatı
   * @param {number} quantity - Eklenecek adet (varsayılan 1)
   * @returns {Promise<object>} Yanıt objesi { message, item }
   */
  async addToCart(name, price, quantity = 1) {
    console.log('\n🛒 [CartService] Sepete ürün ekleniyor...');
    console.log(`   📝 Ürün: ${name} | Fiyat: ₺${price} | Adet: ${quantity}`);
    
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.CART_ITEMS, {
      name,
      price,
      quantity,
    });
    
    console.log('🛒 [CartService] Ürün başarıyla sepete eklendi');
    return response.data;
  },

  /**
   * Sepetteki ürün adetini günceller.
   * @param {string} itemId - Sepetteki ürünün benzersiz Mongo ID'si (_id)
   * @param {number} quantity - Yeni adet
   * @returns {Promise<object>} Yanıt objesi { message, item }
   */
  async updateCartItem(itemId, quantity) {
    console.log('\n🛒 [CartService] Sepet ürün adeti güncelleniyor...');
    console.log(`   🆔 Item ID: ${itemId} | Yeni Adet: ${quantity}`);
    
    const response = await httpClient.put(
      API_CONFIG.ENDPOINTS.CART_ITEM(itemId),
      { quantity }
    );
    
    console.log('🛒 [CartService] Ürün adeti başarıyla güncellendi');
    return response.data;
  },

  /**
   * Ürünü sepetten tamamen çıkartır.
   * @param {string} itemId - Sepetteki ürünün benzersiz ID'si (_id)
   * @returns {Promise<object>} Yanıt objesi { message }
   */
  async removeFromCart(itemId) {
    console.log('\n🛒 [CartService] Ürün sepetten çıkarılıyor...');
    console.log(`   🆔 Item ID: ${itemId}`);
    
    const response = await httpClient.delete(
      API_CONFIG.ENDPOINTS.CART_ITEM(itemId)
    );
    
    console.log('🛒 [CartService] Ürün başarıyla sepetten çıkarıldı');
    return response.data;
  },
};

export default CartService;

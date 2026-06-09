// ─────────────────────────────────────────────
// Order Service — Sipariş API İstekleri
// GET    /v1/orders — Sipariş geçmişini çek
// POST   /v1/orders — Yeni sipariş oluştur
// DELETE /v1/orders/{orderId} — Siparişi iptal et/sil
// ─────────────────────────────────────────────

import httpClient from './httpClient';
import API_CONFIG from '../config/api.config';

const OrderService = {
  /**
   * Kullanıcının geçmiş ve aktif siparişlerini listeler.
   * @returns {Promise<Array>} Sipariş listesi array'i [{ _id, items, totalAmount, status, createdAt }]
   */
  async getOrders() {
    console.log('\n📦 [OrderService] Siparişler getiriliyor...');
    const response = await httpClient.get(API_CONFIG.ENDPOINTS.ORDERS);
    // Backend sayfalama (pagination) eklediği için siparişler data.data içinde gelir
    return response.data?.data || response.data || [];
  },

  /**
   * Yeni bir sipariş oluşturur.
   * @param {object} orderData
   * @param {Array} orderData.items - Sepetteki ürünler dizisi [{ name, price, quantity }]
   * @param {number} orderData.totalAmount - Toplam tutar
   * @returns {Promise<object>} Yanıt objesi { message, order }
   */
  async createOrder(orderData) {
    console.log('\n📦 [OrderService] Yeni sipariş oluşturuluyor...');
    console.log(`   💰 Toplam Tutar: ₺${orderData.totalAmount} | Ürün Sayısı: ${orderData.items?.length}`);
    
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.ORDERS,
      orderData
    );
    
    console.log('📦 [OrderService] Sipariş başarıyla alındı');
    return response.data;
  },

  /**
   * Siparişi iptal eder (Veritabanından siler).
   * @param {string} orderId - İptal edilecek siparişin ID'si (_id)
   * @returns {Promise<object>} Yanıt objesi { message }
   */
  async cancelOrder(orderId) {
    console.log('\n📦 [OrderService] Sipariş iptal ediliyor...');
    console.log(`   🆔 Sipariş ID: ${orderId}`);
    
    const response = await httpClient.delete(
      API_CONFIG.ENDPOINTS.ORDER(orderId)
    );
    
    console.log('📦 [OrderService] Sipariş başarıyla iptal edildi');
    return response.data;
  },
};

export default OrderService;

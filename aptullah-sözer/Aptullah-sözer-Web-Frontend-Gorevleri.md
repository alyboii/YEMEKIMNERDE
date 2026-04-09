# Abdullah Sözer — Web Frontend Görevleri

**Video:** *(https://youtu.be/1zJpyWvb4qc)*

**Konu:** Sepet ve Sipariş yönetimi sayfaları

---

## 1. Sepet Sayfası (`/cart.html`)

**API Bağlantıları:**
- `GET /v1/cart` — Sepeti görüntüle
- `PUT /v1/cart/items/{itemId}` — Miktar güncelle
- `DELETE /v1/cart/items/{itemId}` — Sepetten çıkar
- `POST /v1/orders` — Siparişi tamamla (Sipariş oluştur)

**İçerik:**
- Sepete eklenen ürünlerin, adet ve fiyatlarıyla birlikte listelendiği tablo/kart yapısı
- Ürün miktarını artırma/azaltma (+ / -) ve ürünü sepetten tamamen çıkarma (sil) butonları
- Sepet toplam tutarının dinamik olarak hesaplanıp gösterilmesi
- "Siparişi Tamamla" butonu (Tıklandığında siparişi oluşturur ve başarılı olursa siparişler sayfasına yönlendirir)
- Sepet boşsa "Sepetinizde ürün bulunmamaktadır" mesajı gösterimi

---

## 2. Sipariş Geçmişi Sayfası (`/orders.html`)

**API Bağlantıları:**
- `GET /v1/orders` — Sipariş geçmişini çek
- `DELETE /v1/orders/{orderId}` — Sipariş iptal et

**İçerik:**
- Kullanıcının geçmiş ve aktif siparişlerinin listelenmesi (Sipariş No, Tarih, Durum ve Toplam Tutar bilgileriyle)
- İptal edilebilir (Henüz yola çıkmamış) siparişler için "Siparişi İptal Et" butonu (Onay diyaloğu ile)
- Başarılı iptal işleminde listenin otomatik olarak güncellenmesi
- Daha önce hiç sipariş verilmediyse ekranda "Henüz geçmiş bir siparişiniz bulunmuyor" bilgisinin gösterilmesi

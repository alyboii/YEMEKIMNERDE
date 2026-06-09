# 📱 Mobil Backend - Gereksinimler

Bu bölüm, mobil uygulamayı besleyen REST API uçlarının teknik gereksinimlerini içerir. Tüm uçlar `/v1` ön eki altında çalışır ve JSON formatında veri alışverişi yapar.

---

### 1. Kullanıcı Kaydı
**API Metodu:** `POST /v1/auth/register`
**Açıklama:** Yeni kullanıcının sisteme kaydını sağlar. Ad, soyad, e-posta, şifre ve telefon bilgileri alınır. Şifre veritabanına `bcrypt` ile hash'lenerek yazılır. Başarılı kayıtta kullanıcıya 7 gün geçerli bir JWT token döner.

---

### 2. Kullanıcı Girişi
**API Metodu:** `POST /v1/auth/login`
**Açıklama:** E-posta ve şifre ile kimlik doğrulaması yapar. Bilgiler doğruysa JWT token üretilir ve mobil uygulama bu token'ı sonraki isteklerde `Authorization: Bearer <token>` başlığında kullanır.

---

### 3. Restoran Listeleme (Cache'li)
**API Metodu:** `GET /v1/restaurants`
**Açıklama:** Aktif tüm restoranları döner. Performans için sonuç Redis'te 60 saniye önbelleğe alınır: ilk istek veritabanına gider (MISS), sonraki istekler Redis'ten karşılanır (HIT). Mobil ana ekrandaki restoran listesini besler.

---

### 4. Restoran Detayı
**API Metodu:** `GET /v1/restaurants/{restaurantId}`
**Açıklama:** Seçilen restoranın bilgilerini, menü öğelerini ve kullanıcı yorumlarını tek yanıtta döner (`restoran`, `menu`, `yorumlar`). Mobil detay ekranını besler.

---

### 5. Sana Özel Öneri
**API Metodu:** `POST /v1/restaurants/oneri`
**Açıklama:** Kullanıcının mutfak tercihlerine (örn. `{"tercihler":{"Japon":3}}`) göre restoranları puanlayıp sıralayarak döner. Mobil ana ekrandaki "✨ Sana Özel" bölümünü besler.

---

### 6. Yorum ve Puan Ekleme
**API Metodu:** `POST /v1/restaurants/{restaurantId}/yorum`
**Açıklama:** Giriş yapmış kullanıcının bir restorana yıldız (puan) ve metin yorumu eklemesini sağlar. Yeni yorum eklendiğinde restoranın ortalama puanı yeniden hesaplanır ve restoran listesi cache'i temizlenir.

---

### 7. Sipariş Oluşturma (Mesaj Kuyruğu)
**API Metodu:** `POST /v1/orders`
**Açıklama:** Sipariş doğrudan veritabanına yazılmaz; RabbitMQ üzerinden `orders_queue` kuyruğuna gönderilir ve istek hızlıca `202 Kuyrukta` yanıtı alır. Arka plandaki Order Worker mesajı kuyruktan okuyup siparişi veritabanına kaydeder (asenkron işleme). Kimlik doğrulama (JWT) zorunludur.

---

### 8. Siparişleri Listeleme
**API Metodu:** `GET /v1/orders`
**Açıklama:** Giriş yapmış kullanıcının kendi siparişlerini, sayfalama (`page`, `limit`) destekli olarak en yeniden eskiye sıralı döner.

---

### 9. Sipariş İptali
**API Metodu:** `DELETE /v1/orders/{orderId}`
**Açıklama:** Kullanıcının yalnızca kendi siparişinin durumunu "İptal Edildi" olarak günceller. Başka kullanıcının siparişine erişim engellenir.

---

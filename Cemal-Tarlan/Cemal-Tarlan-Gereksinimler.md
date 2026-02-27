# 🍴 Restoran & Menü Yönetimi - Gereksinimler

Bu bölüm, uygulamanın restoran kayıt, menü listeleme sistemlerini kapsayan teknik gereksinimlerini içerir.

---

### 1. Restoran Ekleme
**API Metodu:** `POST /api/restaurants`  
**Açıklama:** Yeni bir restoranın sisteme dahil edilmesini sağlar. İsim, mutfak türü, lokasyon koordinatları ve çalışma saatleri veritabanına kaydedilir.

---

### 2. Restoran Listeleme
**API Metodu:** `GET /api/restaurants`  
**Açıklama:** Restoranlar sadece alfabetik veya puana göre dizilmez. AI, kullanıcının geçmiş sipariş hızını, sevdiği mutfakları ve o anki konumunu analiz ederek kullanıcıya en uygun "Sana Özel" sıralamasını saniyeler içinde oluşturur.

---

### 3. Restoran Detay Getirme
**API Metodu:** `GET /api/restaurants/{restaurantId}`  
**Açıklama:** Belirli bir restoranın tüm bilgilerini, menüsünü ve kullanıcı yorumlarını detaylı olarak görüntüler.

---

### 4. Restoran Güncelleme
**API Metodu:** `PUT /api/restaurants/{restaurantId}`  
**Açıklama:** Mevcut bir restoranın ad, kategori veya çalışma saatleri gibi dinamik bilgilerinin güncellenmesini sağlar.

---

### 5. Restoran Silme
**API Metodu:** `DELETE /api/restaurants/{restaurantId}`  
**Açıklama:** Restoranın sistemden kaldırılmasını sağlar (Veritabanında "pasif" duruma getirilir).

---

### 6. Menüye Yemek Ekleme
**API Metodu:** `POST /api/restaurants/{restaurantId}/menu`  
**Açıklama:** İlgili restorana yeni bir yemek veya içecek ekler. Görsel URL'si, fiyat ve içerik etiketleri (Örn: Vegan, Acılı) burada tanımlanır.

---

### 7. Menüden Yemek Silme
**API Metodu:** `DELETE /api/menu-items/{itemId}`  
**Açıklama:** Bir yemeğin restorana ait menüden kalıcı olarak kaldırılmasını sağlar.

---



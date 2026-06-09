# 📲 Mobil Frontend - Gereksinimler

Bu bölüm, restoran ve menü yönetimi gereksinimlerinin React Native mobil uygulamasındaki ekran ve kullanıcı deneyimi karşılıklarını içerir. Her özellik ilgili backend API ucuna bağlanır.

---

### 1. Restoran Ekleme (Ekran)
**Bağlı API:** `POST /api/restaurants`
**Açıklama:** Admin kullanıcısı için restoran ekleme formu sunulur. İsim, mutfak türü, konum ve çalışma saatleri girilir; "Kaydet" ile API'ye gönderilip yeni restoran oluşturulur.

---

### 2. Restoran Listeleme (Ana Ekran)
**Bağlı API:** `GET /api/restaurants`
**Açıklama:** Ana ekranda restoranlar kart şeklinde listelenir. AI destekli "✨ Sana Özel" sıralaması üstte gösterilir; kullanıcının tercihlerine göre en uygun restoranlar öne çıkar. Mutfak türüne göre kategori filtreleri ve aşağı çekerek yenileme desteklenir.

---

### 3. Restoran Detay Getirme (Detay Ekranı)
**Bağlı API:** `GET /api/restaurants/{restaurantId}`
**Açıklama:** Bir restorana dokunulduğunda detay ekranı açılır; restoran bilgileri, kategorilere ayrılmış menü, çalışma saatleri ve kullanıcı yorumları gösterilir.

---

### 4. Restoran Güncelleme (Ekran)
**Bağlı API:** `PUT /api/restaurants/{restaurantId}`
**Açıklama:** Admin, mevcut bir restoranın ad, kategori veya çalışma saatleri gibi bilgilerini düzenleme formu üzerinden günceller; değişiklikler API'ye kaydedilir.

---

### 5. Restoran Silme (Ekran)
**Bağlı API:** `DELETE /api/restaurants/{restaurantId}`
**Açıklama:** Admin, bir restoranı "Sil" aksiyonuyla pasife alır. Pasif restoran listeden kaldırılır ve kullanıcılara gösterilmez.

---

### 6. Menüye Yemek Ekleme (Ekran)
**Bağlı API:** `POST /api/restaurants/{restaurantId}/menu`
**Açıklama:** Restoran detayında menü yönetimi ekranından yeni yemek/içecek eklenir. Görsel URL'si, fiyat ve içerik etiketleri (Vegan, Acılı vb.) girilerek menüye işlenir.

---

### 7. Menüden Yemek Silme (Ekran)
**Bağlı API:** `DELETE /api/menu-items/{itemId}`
**Açıklama:** Menü yönetimi ekranından bir yemek "Sil" aksiyonuyla kaldırılır; menü listesi anında güncellenir.

---

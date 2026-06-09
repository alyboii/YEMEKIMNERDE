# 📲 Mobil Frontend - Gereksinimler

Bu bölüm, React Native ile geliştirilen Android mobil uygulamasının ekran ve kullanıcı deneyimi gereksinimlerini içerir. Uygulama, backend REST API'sinden (`/v1`) beslenir.

---

### 1. Giriş Ekranı
**Ekran:** `LoginScreen`
**Açıklama:** Kullanıcı e-posta ve şifresiyle giriş yapar. Başarılı girişte API'den dönen JWT token cihazda saklanır ve sonraki tüm isteklerde kullanılır. Hatalı girişte kullanıcıya uyarı gösterilir.

---

### 2. Ana Ekran - Restoran Listesi
**Ekran:** `HomeScreen`
**Açıklama:** `GET /v1/restaurants` ile gelen gerçek restoranlar (örn. Kebapçı Memo, Pizza Palace) kart şeklinde listelenir. Her kartta restoran adı, mutfak türü, puanı ve görseli yer alır.

---

### 3. Sana Özel Bölümü
**Ekran:** `HomeScreen`
**Açıklama:** Ana ekranın üst kısmında "✨ Sana Özel" bölümü bulunur. Kullanıcının tercihlerine göre `POST /v1/restaurants/oneri` ucundan dönen sıralı öneri listesini gösterir.

---

### 4. Kategori Filtreleri
**Ekran:** `HomeScreen`
**Açıklama:** Mutfak türüne göre (Türk, İtalyan, Japon, Amerikan, Çin...) filtre butonları yer alır. Bir kategoriye dokunulduğunda restoran listesi anlık olarak o mutfak türüne göre filtrelenir.

---

### 5. Restoran Detay Ekranı
**Ekran:** `DetailScreen`
**Açıklama:** Bir restorana dokunulduğunda `GET /v1/restaurants/{id}` ile detay yüklenir. Ekranda kategorilere ayrılmış menü, çalışma saatleri ve kullanıcı yorumları gösterilir.

---

### 6. Yorum ve Puanlama
**Ekran:** `DetailScreen`
**Açıklama:** Kullanıcı yıldız vererek (1-5) ve metin yazarak "Değerlendir" butonuyla yorum gönderir. Yorum `POST /v1/restaurants/{id}/yorum` ile kaydedilir; yorum listesi ve ortalama puan anında güncellenir.

---

### 7. Aşağı Çekerek Yenileme
**Ekran:** `HomeScreen`
**Açıklama:** Liste ekranı aşağı çekildiğinde (pull-to-refresh) restoran verileri API'den yeniden çekilir ve güncel liste gösterilir.

---

### 8. Oturum Yönetimi
**Ekran:** Genel
**Açıklama:** Saklanan JWT token tüm yetkili isteklere otomatik eklenir. Token süresi dolduğunda veya çıkış yapıldığında kullanıcı tekrar giriş ekranına yönlendirilir.

---

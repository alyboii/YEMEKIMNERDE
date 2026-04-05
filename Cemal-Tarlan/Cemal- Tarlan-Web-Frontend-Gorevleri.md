# 🖥️ Web Frontend Görevleri — Cemal & Tarlan

> **Proje:** YEMEKİMNEREDE  
> **Teknoloji Stack:** HTML5 · Tailwind CSS (CDN) · Vanilla JavaScript · localStorage API  
> **Tasarım Dili:** Dark Theme · Glassmorphism · Unsplash Görseller · Material Symbols  
> **Repo:** `frontend/` klasörü

---

## ✅ Tamamlanan Sayfalar

---

### 1. Ana Sayfa — `index.html`

- [X] **Tamamlandı**

**Açıklama:** Uygulamanın karşılama ve yönlendirme sayfasıdır.

#### Bölümler

| Bölüm | İçerik |
|-------|--------|
| **TopNavBar** | Sabit üst menü — logo, sayfa linkleri, Giriş Yap / Kayıt Ol butonları |
| **Hero Section** | Büyük başlık, açıklama, "Siparişe Başla" ve "Restoranları Gör" CTA butonları, sağda gurme burger görseli |
| **Stats Section** | 500+ Restoran · 10K+ Mutlu Kullanıcı · 30dk Teslimat istatistikleri |
| **Features Bento Grid** | 6 özellik kartı (Yakınındaki Restoranlar, Hızlı Sipariş, Anlık Takip, Güvenli Ödeme, Değerlendirmeler, Kişisel Öneriler) |
| **AI Öneri Bölümü** | `localStorage` analizi ile kişiselleştirilmiş 2 restoran önerisi *(detay aşağıda)* |
| **CTA Section** | "%20 indirim" promosyon bandı ve sipariş yönlendirme butonu |
| **Footer** | Logo, linkler, sosyal medya ikonları |

#### Teknik Özellikler

- [X] Tailwind CSS koyu tema (`darkMode: "class"`, özel renk paleti `#ff9153` primary turuncu)
- [X] Glassmorphism — `backdrop-filter: blur(20px)` + `rgba(38,38,38,0.4)` arka plan
- [X] Hero görsel — yüksek kaliteli gurme burger fotoğrafı (Google AIDA CDN)
- [X] **Yapay Zeka Destekli Kişisel Öneri Sistemi:**
  - `localStorage`'daki sepet geçmişini okur
  - `restaurantId → category` eşlemesiyle favori mutfak kategorisi tespit edilir
  - En çok eklenen kategoriden en yüksek puanlı 2 restoran önerilir
  - Veri yoksa en popüler 2 restoran gösterilir
  - "Aktif" rozeti, nabız animasyonu, AI notu (`psychology` ikonu) ile görsel dokunuş
- [X] Kişisel Öneriler feature kartı tıklanınca ilgili bölüme smooth scroll yapar

---

### 2. Restoranlar Listesi — `restaurants.html`

- [X] **Tamamlandı**

**Açıklama:** Platformdaki tüm restoranları kartlar halinde listeleyen keşif sayfasıdır.

#### Bölümler

| Bölüm | İçerik |
|-------|--------|
| **Sayfa Başlığı** | "Restoranları Keşfet" başlığı ve açıklama metni |
| **Kategori Filtreleri** | Tümü · Burger · Sushi · Pizza · Kebap · Asya · Meksika · Akdeniz |
| **Restoran Grid** | Responsive 3 sütunlu kart ızgarası (lg:3, md:2, sm:1) |

#### Restoran Kartı Yapısı

```
┌─────────────────────────┐
│  [Yemek Fotoğrafı]      │  ← Unsplash görsel, object-cover
│  [Rozet]    [★ Puan]    │  ← Absolut konumlu badge'ler
├─────────────────────────┤
│  🍔 Burger House         │
│  [Burger] [Sandviç]     │  ← Kategori etiketleri
│  Açıklama metni...      │
│  ⏱ 20-30 dk  💳 Min.80 │  ← Meta bilgiler
│  🚚 15₺ teslimat        │
├─────────────────────────┤
│   [ Menüyü Görüntüle → ]│  ← restaurant.html?id= yönlendirmesi
└─────────────────────────┘
```

#### Teknik Özellikler

- [X] 7 restoran — her biri farklı mutfak kategorisinde (Burger, Sushi, Pizza, Kebap, Asya, Meksika, Akdeniz)
- [X] **Profesyonel Unsplash Görselleri** — her restorana özel, yüksek çözünürlüklü kapak fotoğrafı (`w=600&q=80`)
- [X] Gradient overlay (`from-black/60`) görsel üzerine — metin okunurluğu korunur
- [X] Kategori filtresi aktif/pasif durum rengi anlık güncellenir (turuncu aktif border)
- [X] `translateY(-4px)` hover efekti + `box-shadow` geçişi
- [X] Tıklama → `restaurant.html?id={id}` yönlendirmesi

---

### 3. Restoran Detay & Menü — `restaurant.html`

- [X] **Tamamlandı**

**Açıklama:** Seçilen restoranın tüm menüsünü sergileyen ve sepete eklemeyi sağlayan sayfadır. URL: `restaurant.html?id=1..7`

#### Bölümler

| Bölüm | İçerik |
|-------|--------|
| **Geri Butonu** | "Restoranlara Dön" linki |
| **Restoran Başlığı** | Kapak fotoğrafı, ad, badge, puan/yorum, teslimat bilgileri |
| **Kategori Sekmeleri** | Menü kategorileri arasında smooth scroll |
| **Menü Kartları** | 2 sütunlu grid — görsel, ad, açıklama, fiyat, Ekle butonu |
| **Sepet Sidebar** | Sağda sabit panel (lg+) — ürün listesi, ara toplam, teslimat, minimum sipariş uyarısı |
| **Mobil Sepet Çubuğu** | Ekranın altında sabit — ürün adedi ve toplam |

#### 7 Restoran ve Menüleri

| Restoran | Kategori | Menü Grupları |
|----------|----------|---------------|
| Burger House | Burger | Burgerler (5) · Yanlar (3) · İçecekler (3) |
| Sushi Palace | Sushi | Maki & Nigiri (5) · Ramen & Soup (3) · İçecekler (2) |
| Pizza Roma | Pizza | Pizzalar (6) · Makarnalar (3) · Tatlılar (2) |
| Kebap Dünyası | Kebap | Kebaplar (6) · Mezeler (3) · İçecekler & Tatlılar (3) |
| Wok Express | Asya | Wok Yemekleri (5) · Dim Sum (3) · İçecekler (3) |
| Taco Loco | Meksika | Tacos (4) · Burrito & Nachos (3) · Yanlar (3) |
| Akdeniz Sofrası | Akdeniz | Ana Yemekler (4) · Salatalar (4) · Tatlılar (4) |

#### Teknik Özellikler

- [X] URL parametresi `?id=` ile hangi restoran olduğu belirlenir, veri `restaurantData` objesinden okunur
- [X] **Profesyonel Unsplash Görselleri** — tüm menü öğelerinde (70+ ürün) `w=400&q=80` fotoğraf, `object-cover rounded-xl`
- [X] Restoran başlık kutusu: cover fotoğrafı `w=800&q=85` yüksek kalite
- [X] `addToCart()` — `localStorage` 'a `{id, name, price, image, qty, restaurantId}` yazar
- [X] `cartDeliveryFee` ve `cartRestaurantName` localStorage'a kaydedilir (sepet sayfası için)
- [X] Sepet sidebar anlık güncelleme — ara toplam, teslimat ücreti, minimum sipariş uyarısı
- [X] "Siparişi Tamamla" butonu min. sipariş tutarı dolmadan devre dışı
- [X] Toast bildirimi — "✓ Sepete eklendi!" animasyonu

---

### 4. Sepet Sayfası — `cart.html`

- [X] **Tamamlandı**

**Açıklama:** Kullanıcının sepetini yönettiği ve siparişi onayladığı sayfadır.

#### Bölümler

| Bölüm | İçerik |
|-------|--------|
| **Sayfa Başlığı** | "Sepetim" + dinamik ürün adedi rozeti |
| **Ürün Kartları** | Sol kolon — görsel, ad, restoran adı, birim fiyat, miktar kontrolü, satır toplamı, sil butonu |
| **Sipariş Özeti** | Sağ kolon (sticky) — ara toplam, teslimat ücreti, toplam, "Siparişi Onayla" butonu |
| **Boş Sepet** | Sepet boşsa özel ekran + "Restoranlara Git" butonu |

#### Teknik Özellikler

- [X] `localStorage.getItem('cart')` ile sayfa açıldığında gerçek ürünler yüklenir
- [X] **Dinamik görsel** — `item.image` varsa `<img object-cover>`, yoksa fallback ikon
- [X] **Miktar Kontrolü:**
  - `(+)` butonu — miktarı artırır, localStorage günceller, toplam anlık hesaplanır
  - `(-)` butonu — miktar 1'e düşünce ürünü sepetten çıkarır
- [X] **Çöp kutusu ikonu** — ürünü tamamen kaldırır
- [X] **Otomatik Hesaplama** — `subtotal`, `deliveryFee`, `total` anlık güncellenir
- [X] **Siparişi Onayla:**
  1. `localStorage.removeItem('cart')` + `cartDeliveryFee` + `cartRestaurantName` temizlenir
  2. Başarı modalı gösterilir: "✅ Siparişiniz Alındı!"
  3. 2.8 saniye sonra `index.html`'e yönlendirilir
- [X] Nav'daki sepet ikonu rozeti gerçek ürün adedini gösterir
- [X] Sepet boşken "Siparişi Onayla" butonu `disabled` duruma geçer

---

## 🎨 Ortak Tasarım Sistemi

### Renk Paleti

| Token | Hex | Kullanım |
|-------|-----|----------|
| `primary` | `#ff9153` | Butonlar, ikonlar, vurgu rengi |
| `primary-container` | `#ff7a23` | Gradient bitiş rengi |
| `surface` | `#0e0e0e` | Ana arka plan |
| `surface-container` | `#1a1919` | Kart arka planı |
| `surface-container-highest` | `#262626` | Girdi alanları |
| `on-surface-variant` | `#adaaaa` | İkincil metin |

### Glassmorphism Stili
```css
.glass-card {
  background: rgba(38, 38, 38, 0.4);
  backdrop-filter: blur(20px);
}
```

### Görsel Sistemi

| Kaynak | Format | Boyut |
|--------|--------|-------|
| Unsplash (menü öğeleri) | `?auto=format&fit=crop&w=400&q=80` | 400px |
| Unsplash (liste kapakları) | `?auto=format&fit=crop&w=600&q=80` | 600px |
| Unsplash (restoran başlığı) | `?auto=format&fit=crop&w=800&q=85` | 800px |

---

## 📊 Genel Proje İlerlemesi

| Görev | Durum |
|-------|-------|
| Ana sayfa tasarımı ve hero bölümü | ✅ Tamamlandı |
| Restoran listesi ve kategori filtreleri | ✅ Tamamlandı |
| Restoran detay sayfası + menü (70+ ürün) | ✅ Tamamlandı |
| Sepet sayfası — dinamik localStorage entegrasyonu | ✅ Tamamlandı |
| Miktar artırma / azaltma / silme | ✅ Tamamlandı |
| Sipariş onaylama akışı (modal + yönlendirme) | ✅ Tamamlandı |
| Tüm görsellerin Unsplash ile değiştirilmesi | ✅ Tamamlandı |
| AI destekli kişisel öneri sistemi (index.html) | ✅ Tamamlandı |
| Mobil uyumlu sepet çubuğu | ✅ Tamamlandı |
| Postman koleksiyonu (REST API dokümantasyonu) | ✅ Tamamlandı |

---

*Son güncelleme: 2026-04-05 | Geliştirici: Cemal & Tarlan*

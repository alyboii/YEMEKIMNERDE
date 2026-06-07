# Abdullah Sözer — Mobil Frontend Görevleri

Bu dokümanda mobil uygulamada Sepet ve Sipariş yönetimi sayfalarının tasarım ve entegrasyon ayrıntıları yer almaktadır.

---

## 1. Sepet Ekranı (`CartScreen.js`)

**Dosya Konumu:** [CartScreen.js](file:///c:/Users/USER/Desktop/YEMEKIMNERDE-main/Ali-Unal/mobile/src/screens/CartScreen.js)

### Yapılan İşler:
- **Tasarım:** Stitch Design Token'ları (Neon Yeşil ve Karanlık Tema) ile tam uyumlu Premium Arayüz.
- **Liste Görünümü:** Sepetteki ürünlerin adet, resim ve birim fiyat bilgisiyle listelenmesi.
- **Miktar Güncelleme:** `+` ve `-` butonlarıyla dinamik miktar kontrolü ve `CartService.updateCartItem` entegrasyonu.
- **Ürün Kaldırma:** `🗑️` ikonuna basıldığında onay kutusu ile sepetten ürün silme ve `CartService.removeFromCart` entegrasyonu.
- **Özet Bilgisi:** Ara Toplam, Kurye Ücreti ve Genel Toplamın anlık hesabı.
- **Boş Sepet Durumu (Empty State):** Sepet boşken kullanıcıyı bilgilendiren ve "Restoranlara Git" butonu ile ana sayfaya yönlendiren şık bir ekran.
- **Siparişi Onaylama:** "SİPARİŞİ TAMAMLA" butonu ile sepet verisini `OrderService.createOrder` API'sine gönderme ve sonrasında sepeti temizleyip sipariş geçmişine yönlendirme.

---

## 2. Siparişlerim Ekranı (`OrdersScreen.js`)

**Dosya Konumu:** [OrdersScreen.js](file:///c:/Users/USER/Desktop/YEMEKIMNERDE-main/Ali-Unal/mobile/src/screens/OrdersScreen.js)

### Yapılan İşler:
- **Liste Görünümü:** Geçmiş ve aktif siparişlerin tarih sırasına göre sıralı listelenmesi.
- **Sipariş Kartları:** Sipariş numarası, tarih, sipariş durum rozeti, sipariş edilen ürünlerin kırılımı (miktar ve fiyat) ve toplam sipariş tutarı.
- **Durum Rozetleri:** Sipariş durumuna göre renklenen tasarımlar:
  - `Hazırlanıyor`: Turuncu (`COLORS.warning`)
  - `Yolda`: Mavi (`COLORS.info`)
  - `Teslim Edildi`: Yeşil (`COLORS.success`)
  - `Iptal Edildi`: Kırmızı (`COLORS.error`)
- **İptal Desteği:** Yola çıkmamış (örn: *Hazırlanıyor* durumundaki) aktif siparişleri onay kutusuyla iptal etme ve `OrderService.cancelOrder` entegrasyonu.
- **Boş Sipariş Durumu:** Sipariş geçmişi yoksa kullanıcıyı "Alışverişe Başla" butonuyla ana sayfaya yönlendiren bilgilendirici görünüm.

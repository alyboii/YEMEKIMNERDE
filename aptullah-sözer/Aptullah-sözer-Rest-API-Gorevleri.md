# Abdullah Sözer — REST API Görevleri

**Video:** *(YouTube linki buraya eklenecek)*

**Konu:** Sepet (Cart) ve Sipariş (Orders) Yönetimi

---

## 1. Sepete Ürün Ekleme

**Metot:** `POST /v1/cart/items`

**Header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "urunId": "prod-987",
  "miktar": 2,
  "ozelIstek": "Lütfen acı sos eklemeyin."
}
```

**Başarılı Yanıt (201):**
```json
{
  "mesaj": "Ürün sepete eklendi",
  "sepet": {
    "toplamUrun": 2,
    "toplamFiyat": 180.50
  }
}
```

---

## 2. Sepeti Görüntüleme

**Metot:** `GET /v1/cart`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (200):**
```json
{
  "sepetId": "cart-456",
  "urunler": [
    {
      "itemId": "item-1",
      "urunAd": "Karışık Pizza",
      "miktar": 2,
      "fiyat": 180.50
    }
  ],
  "toplamTutar": 180.50
}
```

---

## 3. Sepetteki Ürün Miktarını Güncelleme

**Metot:** `PUT /v1/cart/items/{itemId}`

**Header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "miktar": 3
}
```

**Başarılı Yanıt (200):**
```json
{
  "mesaj": "Ürün (item-1) miktarı güncellendi",
  "yeniToplamTutar": 270.75
}
```

---

## 4. Sepetten Ürün Çıkarma

**Metot:** `DELETE /v1/cart/items/{itemId}`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (200):**
```json
{
  "mesaj": "Ürün (item-1) sepetten çıkarıldı"
}
```

---

## 5. Sipariş Oluşturma

**Metot:** `POST /v1/orders`

**Header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "teslimatAdresiId": "addr-123",
  "odemeYontemi": "Kredi Kartı",
  "siparisNotu": "Zili çalmayın, bebek uyuyor."
}
```

**Başarılı Yanıt (201):**
```json
{
  "mesaj": "Sipariş oluşturuldu",
  "siparisId": "ord-789",
  "tahminiTeslimat": "30-45 Dakika",
  "durum": "Hazırlanıyor"
}
```

---

## 6. Sipariş Geçmişini Görüntüleme

**Metot:** `GET /v1/orders`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (200):**
```json
{
  "siparisler": [
    {
      "siparisId": "ord-789",
      "tarih": "2026-04-03T19:30:00Z",
      "toplamTutar": 270.75,
      "durum": "Teslim Edildi"
    }
  ]
}
```

---

## 7. Sipariş İptal Etme

**Metot:** `DELETE /v1/orders/{orderId}`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (200):**
```json
{
  "mesaj": "Sipariş (ord-789) iptal edildi",
  "iadeDurumu": "Tutar kartınıza iade edilecektir."
}
```
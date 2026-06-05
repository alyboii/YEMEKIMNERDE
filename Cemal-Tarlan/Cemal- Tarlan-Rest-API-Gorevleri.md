# 🍴 REST API Görevleri — Cemal & Tarlan

Youtube Linki--> https://youtu.be/FBxb5CC2xIU

---

## ✅ Tamamlanan Görevler

### 1. Restoran Listeleme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `GET` |
| **Endpoint** | `/v1/restaurants` |
| **Yetki** | Bearer Token |

**Query Parametreleri (opsiyonel):**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `sort` | string | Sıralama kriteri: `rating` \| `az` \| `distance` |
| `category` | string | Mutfak filtresi: `Burger` \| `Sushi` \| `Pizza` \| `Kebap` \| `Asya` \| `Meksika` \| `Akdeniz` |
| `page` | number | Sayfa numarası (varsayılan: 1) |
| `limit` | number | Sayfa başına kayıt (varsayılan: 10) |

**Örnek İstek:**
```
GET /v1/restaurants?sort=rating&category=Burger&page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Başarılı Cevap (200 OK):**
```json
{
  "toplam": 7,
  "sayfa": 1,
  "restoranlar": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "name": "Burger House",
      "category": "Burger",
      "rating": 4.8,
      "deliveryTime": "20-30 dk",
      "minOrder": 80,
      "deliveryFee": 15,
      "isActive": true
    }
  ]
}
```

---

### 2. Restoran Detay Getirme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `GET` |
| **Endpoint** | `/v1/restaurants/:restaurantId` |
| **Yetki** | Bearer Token |

**Path Parametresi:**

| Parametre | Açıklama |
|-----------|----------|
| `restaurantId` | MongoDB ObjectId formatında restoran kimliği |

**Örnek İstek:**
```
GET /v1/restaurants/664f1a2b3c4d5e6f7a8b9c0d
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Başarılı Cevap (200 OK):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Burger House",
  "category": "Burger",
  "description": "Özenle seçilmiş malzemelerle hazırlanan gurme burgerler.",
  "rating": 4.8,
  "reviewCount": 1240,
  "deliveryTime": "20-30 dk",
  "minOrder": 80,
  "deliveryFee": 15,
  "workingHours": { "open": "10:00", "close": "23:00" },
  "location": {
    "address": "Bağcılar Mah. Lezzet Sk. No:5, İstanbul",
    "lat": 41.0082,
    "lng": 28.9784
  },
  "menu": [
    {
      "_id": "664f2a3b4c5d6e7f8a9b0c1d",
      "name": "Classic Smash Burger",
      "price": 185,
      "category": "Burgerler",
      "tags": ["Popüler"]
    }
  ],
  "yorumlar": [
    { "kullanici": "Ahmet Y.", "puan": 5, "yorum": "Harika lezzet!", "tarih": "2026-03-20" }
  ]
}
```

**Hata Cevabı (404 Not Found):**
```json
{ "hata": "Restoran bulunamadı" }
```

---

### 3. Restoran Ekleme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **Endpoint** | `/v1/restaurants` |
| **Yetki** | Bearer Token (Admin) |
| **Content-Type** | `application/json` |

**Zorunlu Alanlar:** `name`, `category`, `location`, `workingHours`

**Örnek İstek Body:**
```json
{
  "name": "Burger House",
  "category": "Burger",
  "description": "Özenle seçilmiş malzemelerle hazırlanan gurme burgerler.",
  "location": {
    "address": "Bağcılar Mah. Lezzet Sk. No:5, İstanbul",
    "lat": 41.0082,
    "lng": 28.9784
  },
  "workingHours": { "open": "10:00", "close": "23:00" },
  "minOrder": 80,
  "deliveryFee": 15
}
```

**Başarılı Cevap (201 Created):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Burger House",
  "category": "Burger",
  "isActive": true,
  "rating": 0,
  "menu": [],
  "createdAt": "2026-04-05T10:00:00.000Z"
}
```

**Hata Cevabı (400 Bad Request):**
```json
{ "hata": "name, category ve location alanları zorunludur" }
```

---

### 4. Restoran Güncelleme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `PUT` |
| **Endpoint** | `/v1/restaurants/:restaurantId` |
| **Yetki** | Bearer Token (Admin / Restoran Sahibi) |
| **Content-Type** | `application/json` |

> Sadece gönderilen alanlar güncellenir **(Partial Update)**. Tüm nesneyi göndermek zorunlu değildir.

**Örnek İstek Body:**
```json
{
  "name": "Burger House Premium",
  "workingHours": { "open": "09:00", "close": "24:00" },
  "deliveryFee": 12,
  "minOrder": 90
}
```

**Başarılı Cevap (200 OK):**
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Burger House Premium",
  "deliveryFee": 12,
  "minOrder": 90,
  "updatedAt": "2026-04-05T12:30:00.000Z"
}
```

---

### 5. Restoran Silme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `DELETE` |
| **Endpoint** | `/v1/restaurants/:restaurantId` |
| **Yetki** | Bearer Token (Admin) |

> Fiziksel silme yapılmaz. Kayıt `isActive: false` olarak işaretlenir **(Soft Delete)**.

**Başarılı Cevap (200 OK):**
```json
{ "mesaj": "Restoran (664f1a2b3c4d5e6f7a8b9c0d) pasife alındı" }
```

**Hata Cevabı (404 Not Found):**
```json
{ "hata": "Restoran bulunamadı" }
```

---

### 6. Menüye Yemek Ekleme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `POST` |
| **Endpoint** | `/v1/restaurants/:restaurantId/menu` |
| **Yetki** | Bearer Token (Admin / Restoran Sahibi) |
| **Content-Type** | `application/json` |

**Zorunlu Alanlar:** `name`, `price`, `category`

**Örnek İstek Body:**
```json
{
  "name": "Classic Smash Burger",
  "description": "200gr dana eti, çedar peyniri, özel sos, turşu, domates, marul",
  "price": 185,
  "category": "Burgerler",
  "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  "tags": ["Popüler", "Et"],
  "isAvailable": true
}
```

**Başarılı Cevap (201 Created):**
```json
{
  "_id": "664f2a3b4c5d6e7f8a9b0c1d",
  "restaurantId": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Classic Smash Burger",
  "price": 185,
  "category": "Burgerler",
  "tags": ["Popüler", "Et"],
  "isAvailable": true,
  "createdAt": "2026-04-05T11:00:00.000Z"
}
```

---

### 7. Menüden Yemek Silme

- [X] **Tamamlandı**

| Alan | Değer |
|------|-------|
| **Method** | `DELETE` |
| **Endpoint** | `/v1/menu-items/:itemId` |
| **Yetki** | Bearer Token (Admin / Restoran Sahibi) |

**Başarılı Cevap (200 OK):**
```json
{ "mesaj": "Menü öğesi (664f2a3b4c5d6e7f8a9b0c1d) silindi" }
```

**Hata Cevabı (404 Not Found):**
```json
{ "hata": "Menü öğesi bulunamadı" }
```

---

## 📋 Uç Nokta Özet Tablosu

| # | Method | Endpoint | Açıklama | Yetki | Durum |
|---|--------|----------|----------|-------|-------|
| 1 | `GET` | `/v1/restaurants` | Tüm restoranları listele | Bearer Token | ✅ Tamamlandı |
| 2 | `GET` | `/v1/restaurants/:id` | Restoran detayı + menü | Bearer Token | ✅ Tamamlandı |
| 3 | `POST` | `/v1/restaurants` | Yeni restoran ekle | Admin | ✅ Tamamlandı |
| 4 | `PUT` | `/v1/restaurants/:id` | Restoran güncelle | Admin/Sahip | ✅ Tamamlandı |
| 5 | `DELETE` | `/v1/restaurants/:id` | Restoranı pasife al | Admin | ✅ Tamamlandı |
| 6 | `POST` | `/v1/restaurants/:id/menu` | Menüye yemek ekle | Admin/Sahip | ✅ Tamamlandı |
| 7 | `DELETE` | `/v1/menu-items/:itemId` | Menüden yemek sil | Admin/Sahip | ✅ Tamamlandı |

---

## 🗂️ Postman Koleksiyonu

**Dosya:** `Cemal-Tarlan/YEMEKİMNEREDE_Restaurants_API.postman_collection.json`

| Koleksiyon Değişkeni | Açıklama |
|----------------------|----------|
| `{{baseUrl}}` | `http://localhost:3000/v1` |
| `{{token}}` | Giriş sonrası alınan JWT token |
| `{{restaurantId}}` | Test edilecek restoran ObjectId |
| `{{itemId}}` | Test edilecek menü öğesi ObjectId |

> Her isteğe örnek istek gövdesi ve 200 / 201 / 400 / 404 yanıtlar eklenmiştir.

---

*Son güncelleme: 2026-04-05 | Geliştirici: Cemal & Tarlan*

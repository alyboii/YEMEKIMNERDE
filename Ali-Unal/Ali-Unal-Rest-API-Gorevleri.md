# Ali Ünal — REST API Görevleri

**Video:** *(YouTube linki buraya eklenecek)*

**API Base URL:** `https://yemekimnerde-production.up.railway.app`

**Konu:** Kullanıcı kaydı, girişi ve profil yönetimi

---

## 1. Kayıt Olma

**Metot:** `POST /v1/auth/register`

**Request Body:**
```json
{
  "ad": "Ali",
  "soyad": "Ünal",
  "email": "ali@ornek.com",
  "sifre": "Gizli123!",
  "telefon": "+905551234567"
}
```

**Başarılı Yanıt (201):**
```json
{
  "id": "usr-123",
  "ad": "Ali",
  "soyad": "Ünal",
  "email": "ali@ornek.com",
  "telefon": "+905551234567"
}
```

---

## 2. Giriş Yapma

**Metot:** `POST /v1/auth/login`

**Request Body:**
```json
{
  "email": "ali@ornek.com",
  "sifre": "Gizli123!"
}
```

**Başarılı Yanıt (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "kullanici": {
    "id": "usr-123",
    "ad": "Ali",
    "email": "ali@ornek.com"
  }
}
```

---

## 3. Profil Görüntüleme

**Metot:** `GET /v1/users/{kullaniciId}`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (200):**
```json
{
  "id": "usr-123",
  "ad": "Ali",
  "soyad": "Ünal",
  "email": "ali@ornek.com",
  "telefon": "+905551234567"
}
```

---

## 4. Profil Güncelleme

**Metot:** `PUT /v1/users/{kullaniciId}`

**Header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "ad": "Ali",
  "soyad": "Ünal",
  "telefon": "+905559876543"
}
```

**Başarılı Yanıt (200):** Güncellenmiş kullanıcı objesi

---

## 5. Şifre Güncelleme

**Metot:** `PUT /v1/users/{kullaniciId}/password`

**Header:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "mevcutSifre": "Gizli123!",
  "yeniSifre": "YeniGizli456!"
}
```

**Başarılı Yanıt (200):**
```json
{ "mesaj": "Şifre başarıyla güncellendi" }
```

---

## 6. Hesap Silme

**Metot:** `DELETE /v1/users/{kullaniciId}`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (204):** Boş yanıt

---

## 7. Adres Silme

**Metot:** `DELETE /v1/users/{kullaniciId}/addresses/{addressId}`

**Header:** `Authorization: Bearer <token>`

**Başarılı Yanıt (204):** Boş yanıt

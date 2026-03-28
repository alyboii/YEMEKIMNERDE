# Ali Ünal — Web Frontend Görevleri

**Video:** *(YouTube linki buraya eklenecek)*

**Konu:** Kayıt, giriş ve profil yönetimi sayfaları

---

## 1. Kayıt Sayfası (`/register`)

**API Bağlantısı:** `POST /v1/auth/register`

- Ad, soyad, e-posta, telefon ve şifre alanlarından oluşan form
- Başarılı kayıtta kullanıcı giriş sayfasına yönlendirilir
- Hata durumunda (e-posta zaten kullanımda vb.) kullanıcıya mesaj gösterilir

---

## 2. Giriş Sayfası (`/login`)

**API Bağlantısı:** `POST /v1/auth/login`

- E-posta ve şifre alanları
- Başarılı girişte JWT token `localStorage`'a kaydedilir
- Kullanıcı ana sayfaya yönlendirilir

---

## 3. Profil Sayfası (`/profile`)

**API Bağlantıları:**
- `GET /v1/users/{kullaniciId}` — Profil bilgilerini çek
- `PUT /v1/users/{kullaniciId}` — Profili güncelle
- `PUT /v1/users/{kullaniciId}/password` — Şifre güncelle
- `DELETE /v1/users/{kullaniciId}` — Hesabı sil

**İçerik:**
- Kullanıcı bilgilerini gösteren profil kartı
- Bilgileri düzenlemek için güncelleme formu
- Şifre değiştirme bölümü
- Hesap silme butonu (onay diyaloğu ile)

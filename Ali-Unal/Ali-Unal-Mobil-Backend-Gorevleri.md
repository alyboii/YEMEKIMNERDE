# Ali Ünal - Mobil Backend Görevleri

## Kullanıcı ve Adres Yönetimi

### 1. Kayıt Olma (Register)
- **API Metodu:** `POST /v1/auth/register`
- **Açıklama:** Yeni kullanıcıların sisteme üye olmasını sağlar. Kullanıcı e-posta adresi ve şifre belirleyerek hesap oluşturur. Sistem kullanıcı bilgilerini kaydeder ve kullanıcıya hesap oluşturulduğunu bildirir.

### 2. Giriş Yapma (Login)
- **API Metodu:** `POST /v1/auth/login`
- **Açıklama:** Kullanıcıların e-posta ve şifre bilgileri ile sisteme giriş yapmasını sağlar. Bilgiler doğru ise JWT token üretilerek kullanıcı hesabına erişim sağlanır.

### 3. Profil Görüntüleme
- **API Metodu:** `GET /v1/users/{userId}`
- **Açıklama:** Kullanıcının kendi profil bilgilerini görmesini sağlar. Kullanıcı adı, e-posta ve telefon gibi bilgiler döner.

### 4. Profil Güncelleme
- **API Metodu:** `PUT /v1/users/{userId}`
- **Açıklama:** Kullanıcının profil bilgilerini değiştirmesini sağlar. Kullanıcı adını, soyadını veya telefon numarasını günceller.

### 5. Şifre Güncelleme
- **API Metodu:** `PUT /v1/users/{userId}/password`
- **Açıklama:** Kullanıcının mevcut şifresini girerek yeni bir şifre belirlemesini sağlar. Şifreler hashlenerek veritabanında güncellenir.

### 6. Hesap Silme
- **API Metodu:** `DELETE /v1/users/{userId}`
- **Açıklama:** Kullanıcının kendi hesabını sistemden kaldırmasını sağlar.

### 7. Adres Silme
- **API Metodu:** `DELETE /v1/users/{userId}/addresses/{addressId}`
- **Açıklama:** Kullanıcının kayıtlı teslimat adreslerinden birini silmesini sağlar.

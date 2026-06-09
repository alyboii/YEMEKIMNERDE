# Ali Ünal - Mobil Frontend Görevleri

## Kullanıcı ve Adres Yönetimi Arayüzleri

### 1. Kayıt Olma Ekranı (Register Screen)
- **Bağlantı:** `POST /v1/auth/register`
- **Açıklama:** Kullanıcıdan ad, soyad, e-posta ve şifre bilgilerini alacak arayüzün tasarlanması ve API entegrasyonu. Sistem kullanıcı bilgilerini kaydeder ve kullanıcıya hesap oluşturulduğunu bildirir.

### 2. Giriş Yapma Ekranı (Login Screen)
- **Bağlantı:** `POST /v1/auth/login`
- **Açıklama:** Kullanıcıdan e-posta ve şifre alarak giriş işlemlerinin yapılması. Bilgiler doğru ise kullanıcı hesabına erişebilir.

### 3. Profil Görüntüleme Ekranı (Profile Screen)
- **Bağlantı:** `GET /v1/users/{userId}`
- **Açıklama:** Kullanıcının kendi profil bilgilerini görmesini sağlayan arayüz. Kullanıcı adı, e-posta ve telefon gibi bilgiler görüntülenir.

### 4. Profil Düzenleme Ekranı (Edit Profile)
- **Bağlantı:** `PUT /v1/users/{userId}`
- **Açıklama:** Kullanıcının profil bilgilerini form aracılığıyla değiştirmesini sağlar. Kullanıcı adını, e-posta adresini veya telefon numarasını güncelleyebilir.

### 5. Şifre Değiştirme
- **Bağlantı:** `PUT /v1/users/{userId}/password`
- **Açıklama:** Ayarlar ekranından kullanıcının mevcut şifresini girerek yeni bir şifre belirlemesini sağlayan modal/ekran yapısı. İşlem sonrası kullanıcıyı giriş ekranına yönlendirir.

### 6. Hesap Silme
- **Bağlantı:** `DELETE /v1/users/{userId}`
- **Açıklama:** Kullanıcının kendi hesabını sistemden kaldırmasını sağlayan buton ve uyarı mekanizmasının (Alert) uygulanması.

### 7. Adres Silme
- **Bağlantı:** `DELETE /v1/users/{userId}/addresses/{addressId}`
- **Açıklama:** Kullanıcının kayıtlı teslimat adreslerinden birini arayüz üzerinden silmesini sağlar.

# Ali Ünal Gereksinimleri

## Kullanıcı ve Adres Yönetimi

### Kayıt Olma
API Metodu: POST /auth/register
Açıklama: Yeni kullanıcıların sisteme üye olmasını sağlar. Kullanıcı e-posta adresi ve şifre belirleyerek hesap oluşturur. Sistem kullanıcı bilgilerini kaydeder ve kullanıcıya hesap oluşturulduğunu bildirir.

### Giriş Yapma
API Metodu: POST /auth/login
Açıklama: Kullanıcıların e-posta ve şifre bilgileri ile sisteme giriş yapmasını sağlar. Bilgiler doğru ise kullanıcı hesabına erişebilir.

### Profil Görüntüleme
API Metodu: GET /users/{userId}
Açıklama: Kullanıcının kendi profil bilgilerini görmesini sağlar. Kullanıcı adı, e-posta ve telefon gibi bilgiler görüntülenir.

### Profil Güncelleme
API Metodu: PUT /users/{userId}
Açıklama: Kullanıcının profil bilgilerini değiştirmesini sağlar. Kullanıcı adını, e-posta adresini veya telefon numarasını güncelleyebilir.

### Şifre Güncelleme
API Metodu: PUT /users/{userId}/password
Açıklama: Kullanıcının mevcut şifresini girerek yeni bir şifre belirlemesini sağlar.

### Hesap Silme
API Metodu: DELETE /users/{userId}
Açıklama: Kullanıcının kendi hesabını sistemden kaldırmasını sağlar.

### Adres Silme
API Metodu: DELETE /users/{userId}/addresses/{addressId}
Açıklama: Kullanıcının kayıtlı teslimat adreslerinden birini silmesini sağlar.

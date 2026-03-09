                                                 APTULLAH BURAK SÖZER GEREKSİNİMLERİ
									 
    1.SEPETE ÜRÜN EKLEME 
API Metodu: POST /auth/register
açıklama:Kullanıcının ürünü sepete eklemesi
----------------------------------------------------------------------------------------------
    2. SEPETİ GÖRÜNTÜLEME 
API Metodu: GET /users/{userId}
açıklama: Kullanıcının mevcut sepetini listeleme
----------------------------------------------------------------------------------------------
    3. SEPETTE ÜRÜN MİKTARI İNCELEME 
API Metodu: PUT /users/{userId}
açıklama: Sepetteki ürün adetini değiştirme
----------------------------------------------------------------------------------------------
     4. SEPETTEN ÜRÜN ÇIKARMA 
API Metodu: DELETE /users/{userId}
açıklama: Sepetteki ürünü kaldırma
----------------------------------------------------------------------------------------------
     5. SİPARİŞ OLUŞTURMA 
API Metodu: POST /auth/register
açıklama: Sepetten sipariş oluşturma
-----------------------------------------------------------------------------------------------
     6. SİPARİŞ GEÇMİŞİ GÖRÜNTÜLEME 
API Metodu: GET /users/{userId}
açıklama: Kullanıcının geçmiş siparişlerini görüntüleme
-----------------------------------------------------------------------------------------------
     7. SİPARİŞ İPTAL ETME 
API Metodu: DELETE /users/{userId}
açıklama: Hazırlanmamış siparişi iptal etme

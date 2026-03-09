# APTULLAH BURAK SÖZER GEREKSİNİMLERİ
									 
###    1.SEPETE ÜRÜN EKLEME 
API Metodu: POST /auth/register
açıklama:Kullanıcının ürününü sepete eklemesini sağlar
---
 ###   2. SEPETİ GÖRÜNTÜLEME 
API Metodu: GET /users/{userId}
açıklama: Kullanıcının mevcut sepetini listelemesini sağlar
----------------------------------------------------------------------------------------------
  ###  3. SEPETTE ÜRÜN MİKTARI İNCELEME 
API Metodu: PUT /users/{userId}
açıklama: Sepetteki ürün adetini değiştirmesini sağlar
----------------------------------------------------------------------------------------------
  ###   4. SEPETTEN ÜRÜN ÇIKARMA 
API Metodu: DELETE /users/{userId}
açıklama: Sepetteki seçili ürünü kaldırmayı sağlar
----------------------------------------------------------------------------------------------
  ###   5. SİPARİŞ OLUŞTURMA 
API Metodu: POST /auth/register
açıklama: Sepetten sipariş oluşturmayı sağlar
-----------------------------------------------------------------------------------------------
### 6. SİPARİŞ GEÇMİŞİ GÖRÜNTÜLEME 
API Metodu: GET /users/{userId}
açıklama: Kullanıcının geçmiş siparişlerini görüntülemesini sağlar
-----------------------------------------------------------------------------------------------
  ###   7. SİPARİŞ İPTAL ETME 
API Metodu: DELETE /users/{userId}
açıklama: Hazırlanmamış siparişi iptal etmeyi sağlar
--

# Abdullah Sözer — Mobil Backend & REST API Görevleri

Bu dokümanda, mobil backend tarafında sepet ve sipariş veritabanı şemalarının ve REST API uç noktalarının (endpoints) teknik ayrıntıları yer almaktadır.

---

## 1. Veri Modelleri (Mongoose Schemas)

### Sepet Modeli (`Cart.js`)
- **Şema:**
  ```javascript
  const cartSchema = new mongoose.Schema({
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 }
  }, { timestamps: true });
  ```

### Sipariş Modeli (`Order.js`)
- **Şema:**
  ```javascript
  const orderSchema = new mongoose.Schema({
      items: { type: Array, required: true },
      totalAmount: { type: Number, required: true },
      status: { type: String, default: 'Hazırlanıyor' }
  }, { timestamps: true });
  ```

---

## 2. API Yönlendirmeleri (API Routes)

Tüm endpoints `server.js` dosyasında `/v1/cart` ve `/v1/orders` altına bağlanmıştır.

### Sepet API (`/v1/cart`)
- **POST `/items`** — Sepete yeni ürün ekler.
- **GET `/`** — Sepetteki tüm ürünleri listeler.
- **PUT `/items/:itemId`** — Sepetteki ürünün miktarını günceller.
- **DELETE `/items/:itemId`** — Ürünü sepetten tamamen çıkartır.

### Sipariş API (`/v1/orders`)
- **POST `/`** — Yeni bir sipariş kaydı oluşturur.
- **GET `/`** — Kullanıcıya ait tüm sipariş geçmişini listeler.
- **DELETE `/:orderId`** — Siparişi iptal eder (veritabanından kaldırır).

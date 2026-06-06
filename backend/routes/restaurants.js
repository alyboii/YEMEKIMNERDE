const express = require('express');
const router = express.Router();
const Restoran = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');
const redis = require('redis');

// Redis Client Başlatma (Sadece URL varsa çalışır, yoksa hata fırlatmaz)
let redisClient;
(async () => {
  if (process.env.REDIS_URL) {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.log('Redis Client Hatası', err));
    await redisClient.connect();
    console.log('Redis Cache sistemine bağlanıldı.');
  } else {
    console.log('Uyarı: REDIS_URL bulunamadı, cache devre dışı.');
  }
})();

// ─────────────────────────────────────────────
// 1. RESTORAN EKLEME
// POST /v1/restaurants
// ─────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ad, mutfakTuru, konum, calismaSaatleri, gorselUrl } = req.body;

    if (!ad || !mutfakTuru || !konum) {
      return res.status(400).json({ hata: 'Ad, mutfak türü ve konum zorunludur' });
    }

    const restoran = await Restoran.create({
      ad,
      mutfakTuru,
      konum,
      calismaSaatleri: calismaSaatleri || [],
      gorselUrl: gorselUrl || '',
    });

    res.status(201).json(restoran);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 2. RESTORAN LİSTELEME
// GET /v1/restaurants
// Aktif restoranlar puana göre sıralı gelir (Redis Cache Destekli)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // 1. Önce Redis Cache'e (Önbelleğe) bak
    if (redisClient) {
      const cachedData = await redisClient.get('restoranlar_listesi');
      if (cachedData) {
        console.log('Veri Redis Cache\'den (Önbellekten) saniyeler içinde getirildi!');
        return res.json(JSON.parse(cachedData));
      }
    }

    // 2. Cache'de yoksa veya Redis kapalıysa MongoDB'ye git
    console.log('Veri MongoDB\'den alınıyor...');
    const restoranlar = await Restoran.find({ aktif: true }).sort({ puan: -1 });

    // 3. Veriyi MongoDB'den aldıktan sonra bir dahaki sefere hızlı olması için Redis'e kaydet (1 saatliğine)
    if (redisClient) {
      await redisClient.setEx('restoranlar_listesi', 3600, JSON.stringify(restoranlar));
    }

    res.json(restoranlar);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 3. RESTORAN DETAY GETİRME
// GET /v1/restaurants/:restaurantId
// Restoran bilgileri + menü öğeleri birlikte gelir
// ─────────────────────────────────────────────
router.get('/:restaurantId', async (req, res) => {
  try {
    const restoran = await Restoran.findById(req.params.restaurantId);

    if (!restoran || !restoran.aktif) {
      return res.status(404).json({ hata: 'Restoran bulunamadı' });
    }

    // O restorana ait aktif menü öğelerini de getir
    const menu = await MenuItem.find({
      restoran: req.params.restaurantId,
      aktif: true,
    });

    res.json({ restoran, menu });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 4. RESTORAN GÜNCELLEME
// PUT /v1/restaurants/:restaurantId
// ─────────────────────────────────────────────
router.put('/:restaurantId', authMiddleware, async (req, res) => {
  try {
    const { ad, mutfakTuru, konum, calismaSaatleri, gorselUrl } = req.body;

    const restoran = await Restoran.findByIdAndUpdate(
      req.params.restaurantId,
      { ad, mutfakTuru, konum, calismaSaatleri, gorselUrl },
      { new: true, runValidators: true }
    );

    if (!restoran) {
      return res.status(404).json({ hata: 'Restoran bulunamadı' });
    }

    res.json(restoran);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 5. RESTORAN SİLME (soft delete — pasif yapılır)
// DELETE /v1/restaurants/:restaurantId
// ─────────────────────────────────────────────
router.delete('/:restaurantId', authMiddleware, async (req, res) => {
  try {
    const restoran = await Restoran.findByIdAndUpdate(
      req.params.restaurantId,
      { aktif: false },
      { new: true }
    );

    if (!restoran) {
      return res.status(404).json({ hata: 'Restoran bulunamadı' });
    }

    res.json({ mesaj: 'Restoran pasif duruma getirildi' });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 6. MENÜYE YEMEK EKLEME
// POST /v1/restaurants/:restaurantId/menu
// ─────────────────────────────────────────────
router.post('/:restaurantId/menu', authMiddleware, async (req, res) => {
  try {
    const restoran = await Restoran.findById(req.params.restaurantId);

    if (!restoran || !restoran.aktif) {
      return res.status(404).json({ hata: 'Restoran bulunamadı' });
    }

    const { ad, aciklama, fiyat, gorselUrl, etiketler, kategori } = req.body;

    if (!ad || fiyat === undefined) {
      return res.status(400).json({ hata: 'Ad ve fiyat zorunludur' });
    }

    const menuItem = await MenuItem.create({
      restoran: req.params.restaurantId,
      ad,
      aciklama: aciklama || '',
      fiyat,
      gorselUrl: gorselUrl || '',
      etiketler: etiketler || [],
      kategori: kategori || 'Ana Yemek',
    });

    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 7. MENÜDEN YEMEK SİLME (soft delete — pasif yapılır)
// DELETE /v1/menu-items/:itemId
// ─────────────────────────────────────────────
router.delete('/menu-items/:itemId', authMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      { aktif: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ hata: 'Menü öğesi bulunamadı' });
    }

    res.json({ mesaj: 'Menü öğesi pasif duruma getirildi' });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

module.exports = router;

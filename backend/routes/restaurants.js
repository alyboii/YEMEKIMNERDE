const express = require('express');
const router = express.Router();
const Restoran = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Yorum = require('../models/Yorum');
const authMiddleware = require('../middleware/auth');

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
// Aktif restoranlar puana göre sıralı gelir
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [restoranlar, total] = await Promise.all([
      Restoran.find({ aktif: true }).sort({ puan: -1 }).skip(skip).limit(limit),
      Restoran.countDocuments({ aktif: true })
    ]);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: restoranlar
    });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 2b. "SANA ÖZEL" SUNUCU TARAFI SIRALAMA
// POST /v1/restaurants/oneri
// Body: { tercihler: { "Türk": 2, "Japon": 1 } }  (mutfak türü → ilgi)
// Sıralama hesabı SUNUCUDA yapılır: skor = puan + (mutfak ilgisi)
// ─────────────────────────────────────────────
router.post('/oneri', async (req, res) => {
  try {
    const prefs = req.body && typeof req.body.tercihler === 'object' && req.body.tercihler ? req.body.tercihler : {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const RATING_W = 1.0;
    const CUISINE_W = 1.5;

    // Convert preferences object to an array of conditions for MongoDB $switch
    const cuisineBranches = Object.entries(prefs).map(([cuisine, weight]) => ({
      case: { $eq: ["$mutfakTuru", cuisine] },
      then: weight * CUISINE_W
    }));

    const pipeline = [
      { $match: { aktif: true } },
      {
        $addFields: {
          cuisineScore: cuisineBranches.length > 0 ? {
            $switch: { branches: cuisineBranches, default: 0 }
          } : 0
        }
      },
      {
        $addFields: {
          totalScore: { $add: [{ $multiply: [{ $ifNull: ["$puan", 0] }, RATING_W] }, "$cuisineScore"] }
        }
      },
      { $sort: { totalScore: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { cuisineScore: 0, totalScore: 0 } } // Remove calculated scores before sending
    ];

    const sirali = await Restoran.aggregate(pipeline);
    
    // Aggregation doesnt easily give total count without a facet, but for recommendations, a simple array is often fine
    res.json(sirali);
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

    // Promise.all kullanarak sorguları paralel çalıştırıyoruz (API yanıt süresini çok hızlandırır)
    const [menu, yorumlar] = await Promise.all([
      MenuItem.find({ restoran: req.params.restaurantId, aktif: true }),
      Yorum.find({ restoran: req.params.restaurantId }).sort({ createdAt: -1 })
    ]);

    res.json({ restoran, menu, yorumlar });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 3b. RESTORAN YORUMLARINI LİSTELEME
// GET /v1/restaurants/:restaurantId/reviews
// ─────────────────────────────────────────────
router.get('/:restaurantId/reviews', async (req, res) => {
  try {
    const yorumlar = await Yorum.find({ restoran: req.params.restaurantId }).sort({
      createdAt: -1,
    });
    res.json(yorumlar);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

// ─────────────────────────────────────────────
// 3c. RESTORANA YORUM EKLEME (giriş gerekli)
// POST /v1/restaurants/:restaurantId/reviews
// Body: { puan: 1-5, yorum: "..." }
// Yeni yorum sonrası restoranın ortalama puanı güncellenir.
// ─────────────────────────────────────────────
router.post('/:restaurantId/reviews', authMiddleware, async (req, res) => {
  try {
    const { puan, yorum } = req.body;

    if (puan === undefined || puan < 1 || puan > 5) {
      return res.status(400).json({ hata: 'Puan 1 ile 5 arasında olmalıdır' });
    }

    const restoran = await Restoran.findById(req.params.restaurantId);
    if (!restoran || !restoran.aktif) {
      return res.status(404).json({ hata: 'Restoran bulunamadı' });
    }

    const ad = req.kullanici
      ? `${req.kullanici.ad} ${req.kullanici.soyad}`.trim()
      : 'Anonim';

    const yeniYorum = await Yorum.create({
      restoran: restoran._id,
      kullanici: req.kullanici?._id,
      ad,
      puan,
      yorum: yorum || '',
    });

    // Ortalama puanı yeniden hesapla ve restorana yaz
    const hepsi = await Yorum.find({ restoran: restoran._id });
    const ortalama = hepsi.reduce((s, y) => s + y.puan, 0) / hepsi.length;
    restoran.puan = Math.round(ortalama * 10) / 10;
    await restoran.save();

    res.status(201).json(yeniYorum);
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

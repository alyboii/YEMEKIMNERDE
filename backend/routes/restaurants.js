const express = require('express');
const router = express.Router();
const Restoran = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Yorum = require('../models/Yorum');
const authMiddleware = require('../middleware/auth');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

// Restoran listesi cache anahtarı
const CACHE_KEY_LIST = 'restaurants:all';

// ============================================
// MOCK API - /api/restaurants
// ============================================

// Örnek restoran veritabanı (10 adet)
const mockRestaurants = [
  { id: '1', ad: 'Kebapçı Celal', mutfakTuru: 'Türk', puan: 4.8, teslimatSuresi: 30, lat: 41.01, lng: 28.98, gorselUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '2', ad: 'Mario Pizza', mutfakTuru: 'İtalyan', puan: 4.5, teslimatSuresi: 40, lat: 41.015, lng: 28.985, gorselUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '3', ad: 'Burger Station', mutfakTuru: 'Fast Food', puan: 4.2, teslimatSuresi: 20, lat: 41.005, lng: 28.975, gorselUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '4', ad: 'Dragon Sushi', mutfakTuru: 'Çin', puan: 4.7, teslimatSuresi: 45, lat: 41.02, lng: 28.99, gorselUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '5', ad: 'Izgara Dünyası', mutfakTuru: 'Izgara', puan: 4.4, teslimatSuresi: 35, lat: 41.008, lng: 28.97, gorselUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '6', ad: 'Green Life', mutfakTuru: 'Vegan', puan: 4.6, teslimatSuresi: 25, lat: 41.012, lng: 28.982, gorselUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '7', ad: 'Tarihi Pideci', mutfakTuru: 'Türk', puan: 4.3, teslimatSuresi: 35, lat: 41.002, lng: 28.96, gorselUrl: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '8', ad: 'Pasta Bella', mutfakTuru: 'İtalyan', puan: 4.1, teslimatSuresi: 45, lat: 41.018, lng: 28.988, gorselUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=60', aktif: false },
  { id: '9', ad: 'Wok Master', mutfakTuru: 'Çin', puan: 4.0, teslimatSuresi: 50, lat: 41.025, lng: 28.995, gorselUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '10', ad: 'Vegan Bites', mutfakTuru: 'Vegan', puan: 4.9, teslimatSuresi: 20, lat: 41.007, lng: 28.977, gorselUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=60', aktif: true }
];

// Basit mesafe hesaplama (haversine yerine taslak yaklasim)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const dx = lat1 - lat2;
  const dy = lng1 - lng2;
  return Math.sqrt(dx * dx + dy * dy) * 111; // yaklaşık km
};

router.get('/api/restaurants', (req, res) => {
  try {
    const { userId, lat, lng, limit } = req.query;
    const userLat = parseFloat(lat) || 41.0082;
    const userLng = parseFloat(lng) || 28.9784;
    const parsedLimit = parseInt(limit, 10) || 10;

    // Örnek kullanıcı tercihleri (userId bazlı veritabanı okuması simülasyonu)
    const userPref = { sevilenMutfak: 'Türk' };

    let results = mockRestaurants.map(rest => {
      const distance = calculateDistance(userLat, userLng, rest.lat, rest.lng);
      
      // PersonalScore hesaplama
      let personalScore = 0;
      if (rest.mutfakTuru === userPref.sevilenMutfak) personalScore += 10; // Mutfak uyumu
      if (distance < 2) personalScore += 10;
      else if (distance < 5) personalScore += 5; // Mesafe
      
      personalScore += rest.puan * 2; // Puan ağırlığı
      
      if (rest.teslimatSuresi <= 30) personalScore += 5; // Teslimat süresi
      
      return {
        ...rest,
        distance: distance.toFixed(1),
        personalScore
      };
    });

    results.sort((a, b) => b.personalScore - a.personalScore);
    results = results.slice(0, parsedLimit);

    res.json(results);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

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

    await cacheDel(CACHE_KEY_LIST); // liste değişti → cache'i temizle
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
    // 1) Önce Redis cache'e bak
    const cached = await cacheGet(CACHE_KEY_LIST);
    if (cached) {
      console.log('⚡ [Cache] restaurants:all → Redis HIT');
      return res.json(cached);
    }

    // 2) Cache yoksa DB'den çek ve cache'e yaz (60 sn)
    const restoranlar = await Restoran.find({ aktif: true }).sort({ puan: -1 });
    await cacheSet(CACHE_KEY_LIST, restoranlar, 60);
    console.log('🐢 [Cache] restaurants:all → DB MISS (Redis\'e yazıldı)');
    res.json(restoranlar);
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
    const prefs =
      req.body && typeof req.body.tercihler === 'object' && req.body.tercihler
        ? req.body.tercihler
        : {};

    const RATING_W = 1.0;
    const CUISINE_W = 1.5;
    const skor = (r) => (r.puan || 0) * RATING_W + (prefs[r.mutfakTuru] || 0) * CUISINE_W;

    const restoranlar = await Restoran.find({ aktif: true });
    const sirali = restoranlar
      .map((r) => ({ r, s: skor(r) }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.r);

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

    // O restorana ait aktif menü öğelerini de getir
    const menu = await MenuItem.find({
      restoran: req.params.restaurantId,
      aktif: true,
    });

    // Restorana ait kullanıcı yorumları (en yeni önce)
    const yorumlar = await Yorum.find({ restoran: req.params.restaurantId }).sort({
      createdAt: -1,
    });

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

    await cacheDel(CACHE_KEY_LIST); // puan değişti → cache'i temizle
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

    await cacheDel(CACHE_KEY_LIST); // güncellendi → cache'i temizle
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

    await cacheDel(CACHE_KEY_LIST); // silindi → cache'i temizle
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

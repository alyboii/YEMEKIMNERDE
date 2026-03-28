const express = require('express');
const Kullanici = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /v1/users/:kullaniciId — Profil Görüntüleme (Ali Ünal)
router.get('/:kullaniciId', authMiddleware, async (req, res) => {
  if (req.kullanici._id.toString() !== req.params.kullaniciId) {
    return res.status(403).json({ hata: 'Bu işlem için yetkiniz yok' });
  }
  res.json(req.kullanici);
});

// PUT /v1/users/:kullaniciId — Profil Güncelleme (Ali Ünal)
router.put('/:kullaniciId', authMiddleware, async (req, res) => {
  if (req.kullanici._id.toString() !== req.params.kullaniciId) {
    return res.status(403).json({ hata: 'Bu işlem için yetkiniz yok' });
  }

  const { ad, soyad, telefon } = req.body;
  const guncelKullanici = await Kullanici.findByIdAndUpdate(
    req.params.kullaniciId,
    { ad, soyad, telefon },
    { new: true, runValidators: true }
  );
  res.json(guncelKullanici);
});

// PUT /v1/users/:kullaniciId/password — Şifre Güncelleme (Ali Ünal)
router.put('/:kullaniciId/password', authMiddleware, async (req, res) => {
  if (req.kullanici._id.toString() !== req.params.kullaniciId) {
    return res.status(403).json({ hata: 'Bu işlem için yetkiniz yok' });
  }

  const { mevcutSifre, yeniSifre } = req.body;
  if (!mevcutSifre || !yeniSifre) {
    return res.status(400).json({ hata: 'Mevcut şifre ve yeni şifre zorunludur' });
  }

  const kullanici = await Kullanici.findById(req.params.kullaniciId).select('+sifre');
  if (!(await kullanici.sifreKontrol(mevcutSifre))) {
    return res.status(401).json({ hata: 'Mevcut şifre hatalı' });
  }

  kullanici.sifre = yeniSifre;
  await kullanici.save();
  res.json({ mesaj: 'Şifre başarıyla güncellendi' });
});

// DELETE /v1/users/:kullaniciId — Hesap Silme (Ali Ünal)
router.delete('/:kullaniciId', authMiddleware, async (req, res) => {
  if (req.kullanici._id.toString() !== req.params.kullaniciId) {
    return res.status(403).json({ hata: 'Bu işlem için yetkiniz yok' });
  }
  await Kullanici.findByIdAndDelete(req.params.kullaniciId);
  res.status(204).send();
});

// DELETE /v1/users/:kullaniciId/addresses/:addressId — Adres Silme (Ali Ünal)
router.delete('/:kullaniciId/addresses/:addressId', authMiddleware, async (req, res) => {
  if (req.kullanici._id.toString() !== req.params.kullaniciId) {
    return res.status(403).json({ hata: 'Bu işlem için yetkiniz yok' });
  }

  const kullanici = await Kullanici.findByIdAndUpdate(
    req.params.kullaniciId,
    { $pull: { adresler: { _id: req.params.addressId } } },
    { new: true }
  );
  res.json(kullanici);
});

module.exports = router;

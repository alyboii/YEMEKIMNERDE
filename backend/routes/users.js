const express = require('express');
const Kullanici = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /v1/users/:kullaniciId — Profil Görüntüleme (Ali Ünal)
router.get('/:kullaniciId', authMiddleware, async (req, res) => {
  res.json(req.kullanici);
});

// PUT /v1/users/:kullaniciId — Profil Güncelleme (Ali Ünal)
router.put('/:kullaniciId', authMiddleware, async (req, res) => {
  const { ad, soyad, telefon } = req.body;
  const guncelKullanici = await Kullanici.findByIdAndUpdate(
    req.kullanici._id,
    { ad, soyad, telefon },
    { new: true, runValidators: true }
  );
  res.json(guncelKullanici);
});

// PUT /v1/users/:kullaniciId/password — Şifre Güncelleme (Ali Ünal)
router.put('/:kullaniciId/password', authMiddleware, async (req, res) => {

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
  await Kullanici.findByIdAndDelete(req.kullanici._id);
  res.status(204).send();
});

// POST /v1/users/:kullaniciId/addresses — Adres Ekleme (Ali Ünal)
router.post('/:kullaniciId/addresses', authMiddleware, async (req, res) => {
  const { baslik, adres, sehir } = req.body;
  if (!baslik || !adres || !sehir) {
    return res.status(400).json({ hata: 'Başlık, adres ve şehir zorunludur' });
  }
  const kullanici = await Kullanici.findByIdAndUpdate(
    req.params.kullaniciId,
    { $push: { adresler: { baslik, adres, sehir } } },
    { new: true }
  );
  res.status(201).json(kullanici);
});

// DELETE /v1/users/:kullaniciId/addresses/:addressId — Adres Silme (Ali Ünal)
router.delete('/:kullaniciId/addresses/:addressId', authMiddleware, async (req, res) => {
  const kullanici = await Kullanici.findByIdAndUpdate(
    req.kullanici._id,
    { $pull: { adresler: { _id: req.params.addressId } } },
    { new: true }
  );
  res.json(kullanici);
});

module.exports = router;

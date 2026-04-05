const express = require('express');
const jwt = require('jsonwebtoken');
const Kullanici = require('../models/User');

const router = express.Router();

const tokenUret = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /v1/auth/register — Kayıt Olma (Ali Ünal)
router.post('/register', async (req, res) => {
  const { ad, soyad, email, sifre, telefon } = req.body;

  if (!ad || !soyad || !email || !sifre) {
    return res.status(400).json({ hata: 'Ad, soyad, e-posta ve şifre zorunludur' });
  }

  const mevcutKullanici = await Kullanici.findOne({ email });
  if (mevcutKullanici) {
    return res.status(409).json({ hata: 'Bu e-posta adresi zaten kullanımda' });
  }

  const kullanici = await Kullanici.create({ ad, soyad, email, sifre, telefon });
  res.status(201).json({
    token: tokenUret(kullanici._id),
    kullanici,
  });
});

// POST /v1/auth/login — Giriş Yapma (Ali Ünal)
router.post('/login', async (req, res) => {
  const { email, sifre } = req.body;

  if (!email || !sifre) {
    return res.status(400).json({ hata: 'E-posta ve şifre zorunludur' });
  }

  const kullanici = await Kullanici.findOne({ email }).select('+sifre');
  if (!kullanici || !(await kullanici.sifreKontrol(sifre))) {
    return res.status(401).json({ hata: 'E-posta veya şifre hatalı' });
  }

  res.json({
    token: tokenUret(kullanici._id),
    kullanici,
  });
});

module.exports = router;

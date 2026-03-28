const jwt = require('jsonwebtoken');
const Kullanici = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ hata: 'Yetkilendirme token\'ı gerekli' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.kullanici = await Kullanici.findById(decoded.id);
    if (!req.kullanici) {
      return res.status(401).json({ hata: 'Geçersiz token' });
    }
    next();
  } catch {
    res.status(401).json({ hata: 'Geçersiz veya süresi dolmuş token' });
  }
};

const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');

// ─────────────────────────────────────────────
// MENÜDEN YEMEK SİLME (soft delete — pasif yapılır)
// DELETE /v1/menu-items/:itemId
// ─────────────────────────────────────────────
router.delete('/:itemId', authMiddleware, async (req, res) => {
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

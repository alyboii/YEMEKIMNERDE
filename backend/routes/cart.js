const express = require('express');
const router = express.Router();

// POST /v1/cart/items — Sepete ekle
router.post('/items', (req, res) => {
    res.status(201).json({ message: "Ürün sepete eklendi" });
});

// GET /v1/cart — Sepeti görüntüle
router.get('/', (req, res) => {
    res.status(200).json({ message: "Sepet detayları getirildi" });
});

// PUT /v1/cart/items/:itemId — Miktar güncelle
router.put('/items/:itemId', (req, res) => {
    const { itemId } = req.params;
    res.status(200).json({ message: `Ürün (${itemId}) miktarı güncellendi` });
});

// DELETE /v1/cart/items/:itemId — Sepetten çıkar
router.delete('/items/:itemId', (req, res) => {
    const { itemId } = req.params;
    res.status(200).json({ message: `Ürün (${itemId}) sepetten çıkarıldı` });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Az önce oluşturduğun modeli çağırıyoruz

// POST /v1/cart/items — Sepete ürün ekle
router.post('/items', async (req, res) => {
    try {
        const newCartItem = new Cart(req.body);
        const savedItem = await newCartItem.save();
        res.status(201).json({ message: "Ürün sepete eklendi", item: savedItem });
    } catch (err) {
        res.status(500).json({ error: "Sepete eklenirken hata", details: err.message });
    }
});

// GET /v1/cart — Sepeti görüntüle
router.get('/', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ error: "Sepet getirilemedi", details: err.message });
    }
});

// PUT /v1/cart/items/:itemId — Ürün miktarını güncelle
router.put('/items/:itemId', async (req, res) => {
    try {
        const updatedItem = await Cart.findByIdAndUpdate(
            req.params.itemId,
            { quantity: req.body.quantity },
            { new: true }
        );
        if (!updatedItem) return res.status(404).json({ error: "Ürün bulunamadı" });
        res.status(200).json({ message: "Miktar güncellendi", item: updatedItem });
    } catch (err) {
        res.status(500).json({ error: "Güncelleme hatası", details: err.message });
    }
});

// DELETE /v1/cart/items/:itemId — Sepetten ürün çıkar
router.delete('/items/:itemId', async (req, res) => {
    try {
        const deleted = await Cart.findByIdAndDelete(req.params.itemId);
        if (!deleted) return res.status(404).json({ error: "Ürün bulunamadı" });
        res.status(200).json({ message: "Ürün sepetten çıkarıldı" });
    } catch (err) {
        res.status(500).json({ error: "Silme hatası", details: err.message });
    }
});

module.exports = router;
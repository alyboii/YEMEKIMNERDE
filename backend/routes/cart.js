const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Az önce oluşturduğun modeli çağırıyoruz

// Sepete ürün ekle (Veritabanına yazar)
router.post('/', async (req, res) => {
    try {
        const newCartItem = new Cart(req.body);
        const savedItem = await newCartItem.save();
        res.status(201).json({ message: "Ürün sepete eklendi", item: savedItem });
    } catch (err) {
        res.status(500).json({ error: "Sepete eklenirken hata", details: err.message });
    }
});

// Sepetteki ürünleri getir (Veritabanından okur)
router.get('/', async (req, res) => {
    try {
        const cartItems = await Cart.find();
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ error: "Sepet getirilemedi", details: err.message });
    }
});

module.exports = router;
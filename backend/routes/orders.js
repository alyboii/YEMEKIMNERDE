const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Az önce oluşturduğun sipariş modeli

// Yeni sipariş oluştur (Veritabanına yazar)
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Sipariş başarıyla alındı", order: savedOrder });
    } catch (err) {
        res.status(500).json({ error: "Sipariş oluşturulamadı", details: err.message });
    }
});

// Siparişleri getir (Veritabanından okur)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: "Siparişler getirilemedi", details: err.message });
    }
});

module.exports = router;
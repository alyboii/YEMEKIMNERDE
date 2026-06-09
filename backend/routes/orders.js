const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Az önce oluşturduğun sipariş modeli
const { sendToQueue } = require('../config/rabbitmq');

// Yeni sipariş oluştur (Veritabanına yazar)
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        
        // Sipariş başarıyla kaydedildikten sonra RabbitMQ kuyruğuna at
        await sendToQueue('new_orders_queue', { orderId: savedOrder._id, status: 'CREATED', timestamp: new Date() });
        
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

// DELETE /v1/orders/:orderId — Siparişi iptal et (Veritabanından silmek yerine durumunu 'İptal Edildi' olarak günceller)
router.delete('/:orderId', async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status: 'İptal Edildi' },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Sipariş bulunamadı" });
        res.status(200).json({ message: "Sipariş iptal edildi", order: updated });
    } catch (err) {
        res.status(500).json({ error: "İptal etme hatası", details: err.message });
    }
});

module.exports = router;
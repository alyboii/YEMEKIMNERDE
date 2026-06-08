const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const { sendToQueue } = require('../utils/rabbitmq');

// Yeni sipariş oluştur (RabbitMQ Kuyruğuna Gönderir)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            kullaniciId: req.kullanici._id // Güvenlik için token'dan alıyoruz
        };

        // Veritabanına doğrudan yazmak yerine kuyruğa atıyoruz
        const sent = await sendToQueue('orders_queue', orderData);
        
        if (sent) {
            res.status(202).json({ message: "Sipariş işleme alındı", status: "Kuyrukta" });
        } else {
            res.status(503).json({ error: "Sipariş kuyruğa eklenemedi, sistem meşgul" });
        }
    } catch (err) {
        res.status(500).json({ error: "Sipariş oluşturulamadı", details: err.message });
    }
});

// Siparişleri getir (Veritabanından okur - Sayfalama eklendi)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Sadece giriş yapan kullanıcının siparişleri getirilir
        const orders = await Order.find({ kullaniciId: req.kullanici._id })
                                  .sort({ createdAt: -1 })
                                  .skip(skip)
                                  .limit(limit);
                                  
        const total = await Order.countDocuments({ kullaniciId: req.kullanici._id });

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            data: orders
        });
    } catch (err) {
        res.status(500).json({ error: "Siparişler getirilemedi", details: err.message });
    }
});

// DELETE /v1/orders/:orderId — Siparişi iptal et
router.delete('/:orderId', authMiddleware, async (req, res) => {
    try {
        const updated = await Order.findOneAndUpdate(
            { _id: req.params.orderId, kullaniciId: req.kullanici._id },
            { status: 'İptal Edildi' },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Sipariş bulunamadı veya yetkiniz yok" });
        res.status(200).json({ message: "Sipariş iptal edildi", order: updated });
    } catch (err) {
        res.status(500).json({ error: "İptal etme hatası", details: err.message });
    }
});

module.exports = router;
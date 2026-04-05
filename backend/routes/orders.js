const express = require('express');
const router = express.Router();

// POST /v1/orders — Sipariş oluştur
router.post('/', (req, res) => {
    res.status(201).json({ message: "Sipariş oluşturuldu" });
});

// GET /v1/orders — Sipariş geçmişi
router.get('/', (req, res) => {
    res.status(200).json({ message: "Sipariş geçmişi getirildi" });
});

// DELETE /v1/orders/:orderId — Sipariş iptal
router.delete('/:orderId', (req, res) => {
    const { orderId } = req.params;
    res.status(200).json({ message: `Sipariş (${orderId}) iptal edildi` });
});

module.exports = router;
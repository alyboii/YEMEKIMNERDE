const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: { type: Array, required: true }, // Sepetteki ürünler buraya gelecek
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Hazırlanıyor' } // Sipariş durumu
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
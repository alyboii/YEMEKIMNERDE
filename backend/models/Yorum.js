const mongoose = require('mongoose');

// Restoran yorumu / değerlendirmesi
const yorumSchema = new mongoose.Schema(
  {
    restoran: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restoran',
      required: true,
      index: true,
    },

    // Yorumu yapan kullanıcı (auth'tan gelir)
    kullanici: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici',
    },

    // Görünen ad (kullanıcı silinse bile yorumda kalsın diye denormalize)
    ad: { type: String, trim: true, default: 'Anonim' },

    // 1-5 yıldız
    puan: { type: Number, required: true, min: 1, max: 5 },

    // Yorum metni (opsiyonel)
    yorum: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Yorum', yorumSchema);

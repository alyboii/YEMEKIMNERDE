const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    // Hangi restorana ait olduğu
    restoran: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restoran',
      required: true,
    },

    ad: { type: String, required: true, trim: true },

    aciklama: { type: String, trim: true, default: '' },

    fiyat: { type: Number, required: true, min: 0 },

    gorselUrl: { type: String, trim: true, default: '' },

    // İçerik etiketleri (Vegan, Vejeteryan, Acılı, Glutensiz vb.)
    etiketler: { type: [String], default: [] },

    // Kategori: "Ana Yemek", "Başlangıç", "Tatlı", "İçecek" vb.
    kategori: { type: String, trim: true, default: 'Ana Yemek' },

    // Menüden kaldırmak yerine pasif yapılır (soft delete)
    aktif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);

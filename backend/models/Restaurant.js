const mongoose = require('mongoose');

// Çalışma saatleri alt şeması (örn: { gun: 'Pazartesi', acilis: '09:00', kapanis: '22:00' })
const calismaSchema = new mongoose.Schema(
  {
    gun: {
      type: String,
      required: true,
      enum: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    },
    acilis: { type: String, required: true },   // "09:00"
    kapanis: { type: String, required: true },  // "22:00"
  },
  { _id: false }
);

// Konum alt şeması
const konumSchema = new mongoose.Schema(
  {
    enlem: { type: Number, required: true },   // latitude
    boylam: { type: Number, required: true },  // longitude
    adres: { type: String, required: true, trim: true },
    sehir: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const restoranSchema = new mongoose.Schema(
  {
    ad: { type: String, required: true, trim: true },

    mutfakTuru: { type: String, required: true, trim: true }, // "Türk", "İtalyan", vb.

    konum: { type: konumSchema, required: true },

    calismaSaatleri: { type: [calismaSchema], default: [] },

    // Ortalama puan (yorumlardan hesaplanır, varsayılan 0)
    puan: { type: Number, default: 0, min: 0, max: 5 },

    // Silinme yerine pasif yapılır (soft delete)
    aktif: { type: Boolean, default: true },

    // Kapak görseli URL'si
    gorselUrl: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restoran', restoranSchema);

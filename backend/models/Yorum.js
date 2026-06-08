const mongoose = require('mongoose');

const yorumSchema = new mongoose.Schema(
  {
    restoran: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restoran',
      required: true,
      index: true,
    },
    kullanici: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ad: { type: String, default: 'Anonim', trim: true },
    puan: { type: Number, required: true, min: 1, max: 5 },
    yorum: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Yorum', yorumSchema);

const mongoose = require('mongoose');

const yorumSchema = new mongoose.Schema(
  {
    restoran: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restoran',
      required: true,
    },
    kullanici: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici',
    },
    ad: {
      type: String,
      required: true,
      trim: true,
    },
    puan: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    yorum: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Yorum', yorumSchema);

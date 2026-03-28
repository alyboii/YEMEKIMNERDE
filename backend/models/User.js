const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adresSchema = new mongoose.Schema({
  baslik: { type: String, required: true },
  adres: { type: String, required: true },
  sehir: { type: String, required: true },
});

const kullaniciSchema = new mongoose.Schema(
  {
    ad: { type: String, required: true, trim: true },
    soyad: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sifre: { type: String, required: true, minlength: 6 },
    telefon: { type: String, trim: true },
    adresler: [adresSchema],
  },
  { timestamps: true }
);

kullaniciSchema.pre('save', async function (next) {
  if (!this.isModified('sifre')) return next();
  this.sifre = await bcrypt.hash(this.sifre, 10);
  next();
});

kullaniciSchema.methods.sifreKontrol = function (sifre) {
  return bcrypt.compare(sifre, this.sifre);
};

kullaniciSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.sifre;
  return obj;
};

module.exports = mongoose.model('Kullanici', kullaniciSchema);

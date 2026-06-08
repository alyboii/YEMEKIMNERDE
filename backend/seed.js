const mongoose = require('mongoose');
const Restoran = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/yemekimnerede';

async function seedData() {
  try {
    console.log('MongoDB bağlanıyor...');
    await mongoose.connect(MONGO_URI);
    console.log('Bağlantı başarılı. Mevcut veriler siliniyor...');

    await Restoran.deleteMany({});
    await MenuItem.deleteMany({});

    console.log('Dummy restoran ekleniyor...');
    const rest = await Restoran.create({
      ad: 'Burger King',
      mutfakTuru: 'Fast Food',
      konum: {
        enlem: 41.0082,
        boylam: 28.9784,
        adres: 'İstiklal Cad. No: 1',
        sehir: 'İstanbul'
      },
      calismaSaatleri: [
        { gun: 'Pazartesi', acilis: '09:00', kapanis: '23:00' },
        { gun: 'Salı', acilis: '09:00', kapanis: '23:00' },
        { gun: 'Çarşamba', acilis: '09:00', kapanis: '23:00' },
        { gun: 'Perşembe', acilis: '09:00', kapanis: '23:00' },
        { gun: 'Cuma', acilis: '09:00', kapanis: '23:00' },
        { gun: 'Cumartesi', acilis: '09:00', kapanis: '23:00' },
        { gun: 'Pazar', acilis: '09:00', kapanis: '23:00' }
      ],
      puan: 4.5,
      gorselUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
      aktif: true
    });

    console.log('Menü ürünleri ekleniyor...');
    await MenuItem.create([
      {
        restoran: rest._id,
        ad: 'Whopper Menü',
        aciklama: 'Patates kızartması ve içecek ile',
        fiyat: 150,
        kategori: 'Ana Yemek',
        gorselUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'
      },
      {
        restoran: rest._id,
        ad: 'Tavuk Burger',
        aciklama: 'Çıtır tavuk',
        fiyat: 100,
        kategori: 'Ana Yemek',
        gorselUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80'
      }
    ]);

    console.log('Seed tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('Seed sırasında hata:', error);
    process.exit(1);
  }
}

seedData();

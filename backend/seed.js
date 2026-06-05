require('dotenv').config();
const mongoose = require('mongoose');
const Restoran = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

const restoranlar = [
  {
    ad: 'Kebapçı Memo',
    mutfakTuru: 'Türk',
    puan: 4.7,
    gorselUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600',
    konum: { enlem: 41.015, boylam: 28.979, adres: 'Taksim Meydanı No:1', sehir: 'İstanbul' },
    calismaSaatleri: [
      { gun: 'Pazartesi', acilis: '10:00', kapanis: '23:00' },
      { gun: 'Salı', acilis: '10:00', kapanis: '23:00' },
      { gun: 'Çarşamba', acilis: '10:00', kapanis: '23:00' },
      { gun: 'Perşembe', acilis: '10:00', kapanis: '23:00' },
      { gun: 'Cuma', acilis: '10:00', kapanis: '00:00' },
      { gun: 'Cumartesi', acilis: '10:00', kapanis: '00:00' },
      { gun: 'Pazar', acilis: '11:00', kapanis: '22:00' },
    ],
  },
  {
    ad: 'Pizza Palace',
    mutfakTuru: 'İtalyan',
    puan: 4.5,
    gorselUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',
    konum: { enlem: 41.019, boylam: 28.981, adres: 'Beyoğlu Cad. No:22', sehir: 'İstanbul' },
    calismaSaatleri: [
      { gun: 'Pazartesi', acilis: '11:00', kapanis: '23:30' },
      { gun: 'Salı', acilis: '11:00', kapanis: '23:30' },
      { gun: 'Çarşamba', acilis: '11:00', kapanis: '23:30' },
      { gun: 'Perşembe', acilis: '11:00', kapanis: '23:30' },
      { gun: 'Cuma', acilis: '11:00', kapanis: '01:00' },
      { gun: 'Cumartesi', acilis: '11:00', kapanis: '01:00' },
      { gun: 'Pazar', acilis: '12:00', kapanis: '23:00' },
    ],
  },
  {
    ad: 'Sushi House',
    mutfakTuru: 'Japon',
    puan: 4.8,
    gorselUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600',
    konum: { enlem: 41.022, boylam: 29.01, adres: 'Nişantaşı Sk. No:5', sehir: 'İstanbul' },
    calismaSaatleri: [
      { gun: 'Salı', acilis: '12:00', kapanis: '22:30' },
      { gun: 'Çarşamba', acilis: '12:00', kapanis: '22:30' },
      { gun: 'Perşembe', acilis: '12:00', kapanis: '22:30' },
      { gun: 'Cuma', acilis: '12:00', kapanis: '23:30' },
      { gun: 'Cumartesi', acilis: '12:00', kapanis: '23:30' },
      { gun: 'Pazar', acilis: '13:00', kapanis: '22:00' },
    ],
  },
  {
    ad: 'Burger Bros',
    mutfakTuru: 'Amerikan',
    puan: 4.3,
    gorselUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    konum: { enlem: 41.008, boylam: 28.972, adres: 'Kadıköy Çarşı No:11', sehir: 'İstanbul' },
    calismaSaatleri: [
      { gun: 'Pazartesi', acilis: '11:00', kapanis: '00:00' },
      { gun: 'Salı', acilis: '11:00', kapanis: '00:00' },
      { gun: 'Çarşamba', acilis: '11:00', kapanis: '00:00' },
      { gun: 'Perşembe', acilis: '11:00', kapanis: '00:00' },
      { gun: 'Cuma', acilis: '11:00', kapanis: '02:00' },
      { gun: 'Cumartesi', acilis: '11:00', kapanis: '02:00' },
      { gun: 'Pazar', acilis: '12:00', kapanis: '23:00' },
    ],
  },
  {
    ad: 'Çin Lokantası Dragon',
    mutfakTuru: 'Çin',
    puan: 4.1,
    gorselUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600',
    konum: { enlem: 41.013, boylam: 28.965, adres: 'Şişli Blv. No:34', sehir: 'İstanbul' },
    calismaSaatleri: [
      { gun: 'Pazartesi', acilis: '11:30', kapanis: '22:30' },
      { gun: 'Salı', acilis: '11:30', kapanis: '22:30' },
      { gun: 'Çarşamba', acilis: '11:30', kapanis: '22:30' },
      { gun: 'Perşembe', acilis: '11:30', kapanis: '22:30' },
      { gun: 'Cuma', acilis: '11:30', kapanis: '23:30' },
      { gun: 'Cumartesi', acilis: '11:30', kapanis: '23:30' },
      { gun: 'Pazar', acilis: '12:00', kapanis: '22:00' },
    ],
  },
];

const menuler = {
  'Kebapçı Memo': [
    { ad: 'Adana Kebap', aciklama: 'Acılı kıyma kebabı, lavaş ekmek ile', fiyat: 180, kategori: 'Ana Yemek', etiketler: ['Acılı'], gorselUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
    { ad: 'Urfa Kebap', aciklama: 'Acısız kıyma kebabı', fiyat: 175, kategori: 'Ana Yemek', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
    { ad: 'Pide', aciklama: 'Kıymalı veya peynirli Türk pidesi', fiyat: 120, kategori: 'Ana Yemek', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { ad: 'Mercimek Çorbası', aciklama: 'Geleneksel Türk mercimek çorbası', fiyat: 60, kategori: 'Başlangıç', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { ad: 'Baklava', aciklama: 'Antep fıstıklı Türk baklavası', fiyat: 90, kategori: 'Tatlı', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400' },
    { ad: 'Ayran', aciklama: 'Soğuk Türk yoğurt içeceği', fiyat: 25, kategori: 'İçecek', etiketler: ['Vejeteryan'], gorselUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
  ],
  'Pizza Palace': [
    { ad: 'Karışık Pizza', aciklama: 'Sucuk, mantar, biber ve mozzarella', fiyat: 220, kategori: 'Ana Yemek', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { ad: 'Margarita Pizza', aciklama: 'Klasik domates sosu ve mozzarella', fiyat: 180, kategori: 'Ana Yemek', etiketler: ['Vejeteryan'], gorselUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
    { ad: 'Sezar Salata', aciklama: 'Romaine marul, krouton, parmesan', fiyat: 110, kategori: 'Başlangıç', etiketler: ['Vejeteryan'], gorselUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { ad: 'Tiramisu', aciklama: 'İtalyan klasiği tatlı', fiyat: 95, kategori: 'Tatlı', etiketler: ['Vejeteryan'], gorselUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
    { ad: 'Limonata', aciklama: 'Taze sıkılmış limon suyu', fiyat: 40, kategori: 'İçecek', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
  ],
  'Sushi House': [
    { ad: 'Salmon Roll (8 adet)', aciklama: 'Taze somon ve avokadolu rulo', fiyat: 280, kategori: 'Ana Yemek', etiketler: ['Glutensiz'], gorselUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400' },
    { ad: 'Tuna Nigiri (4 adet)', aciklama: 'Taze ton balığı üzerinde pirinç', fiyat: 200, kategori: 'Ana Yemek', etiketler: ['Glutensiz'], gorselUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400' },
    { ad: 'Miso Çorba', aciklama: 'Geleneksel Japon çorbası', fiyat: 75, kategori: 'Başlangıç', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { ad: 'Mochi Dondurma', aciklama: 'Japon pirinç keki içinde dondurma', fiyat: 85, kategori: 'Tatlı', etiketler: ['Glutensiz'], gorselUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
    { ad: 'Yeşil Çay', aciklama: 'Sıcak Japon yeşil çayı', fiyat: 30, kategori: 'İçecek', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  ],
  'Burger Bros': [
    { ad: 'Classic Smash Burger', aciklama: 'Çift et, cheddar, turşu, özel sos', fiyat: 195, kategori: 'Ana Yemek', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { ad: 'Chicken Burger', aciklama: 'Crispy tavuk, marul, domates', fiyat: 175, kategori: 'Ana Yemek', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' },
    { ad: 'Patates Kızartması', aciklama: 'Çıtır patates, özel baharat', fiyat: 75, kategori: 'Başlangıç', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400' },
    { ad: 'Milkshake', aciklama: 'Çikolata, çilek veya vanilyalı', fiyat: 80, kategori: 'İçecek', etiketler: ['Vejeteryan'], gorselUrl: 'https://images.unsplash.com/photo-1572490122747-3e9523c23b4a?w=400' },
  ],
  'Çin Lokantası Dragon': [
    { ad: 'Kung Pao Tavuk', aciklama: 'Baharatlı tavuk, fıstık ve sebze', fiyat: 165, kategori: 'Ana Yemek', etiketler: ['Acılı'], gorselUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400' },
    { ad: 'Wonton Çorbası', aciklama: 'Tavuklu wonton hamur, et suyu', fiyat: 80, kategori: 'Başlangıç', etiketler: [], gorselUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { ad: 'Yumurtalı Noodle', aciklama: 'Wok usulü sebzeli noodle', fiyat: 150, kategori: 'Ana Yemek', etiketler: ['Vejeteryan'], gorselUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
    { ad: 'Mango Tatlısı', aciklama: 'Soğuk mango puding', fiyat: 65, kategori: 'Tatlı', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
    { ad: 'Jazmin Çayı', aciklama: 'Sıcak jazmim çiçekli çay', fiyat: 25, kategori: 'İçecek', etiketler: ['Vegan'], gorselUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB bağlandı');

  // Temizle
  await Restoran.deleteMany({});
  await MenuItem.deleteMany({});
  console.log('Eski veriler silindi');

  // Restoranları ekle
  for (const restoranData of restoranlar) {
    const restoran = await Restoran.create(restoranData);
    console.log(`✅ Restoran eklendi: ${restoran.ad}`);

    // Restoranın menüsünü ekle
    const menuItems = menuler[restoranData.ad] || [];
    for (const item of menuItems) {
      await MenuItem.create({ ...item, restoran: restoran._id });
    }
    console.log(`   └─ ${menuItems.length} menü ürünü eklendi`);
  }

  console.log('\n🎉 Seed tamamlandı!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed hatası:', err.message);
  process.exit(1);
});

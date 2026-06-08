const express = require('express');
const router = express.Router();

// Örnek restoran veritabanı (10 adet)
const mockRestaurants = [
  { id: '1', ad: 'Kebapçı Celal', mutfakTuru: 'Türk', puan: 4.8, teslimatSuresi: 30, lat: 41.01, lng: 28.98, gorselUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '2', ad: 'Mario Pizza', mutfakTuru: 'İtalyan', puan: 4.5, teslimatSuresi: 40, lat: 41.015, lng: 28.985, gorselUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '3', ad: 'Burger Station', mutfakTuru: 'Fast Food', puan: 4.2, teslimatSuresi: 20, lat: 41.005, lng: 28.975, gorselUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '4', ad: 'Dragon Sushi', mutfakTuru: 'Çin', puan: 4.7, teslimatSuresi: 45, lat: 41.02, lng: 28.99, gorselUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '5', ad: 'Izgara Dünyası', mutfakTuru: 'Izgara', puan: 4.4, teslimatSuresi: 35, lat: 41.008, lng: 28.97, gorselUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '6', ad: 'Green Life', mutfakTuru: 'Vegan', puan: 4.6, teslimatSuresi: 25, lat: 41.012, lng: 28.982, gorselUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '7', ad: 'Tarihi Pideci', mutfakTuru: 'Türk', puan: 4.3, teslimatSuresi: 35, lat: 41.002, lng: 28.96, gorselUrl: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '8', ad: 'Pasta Bella', mutfakTuru: 'İtalyan', puan: 4.1, teslimatSuresi: 45, lat: 41.018, lng: 28.988, gorselUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=60', aktif: false },
  { id: '9', ad: 'Wok Master', mutfakTuru: 'Çin', puan: 4.0, teslimatSuresi: 50, lat: 41.025, lng: 28.995, gorselUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=60', aktif: true },
  { id: '10', ad: 'Vegan Bites', mutfakTuru: 'Vegan', puan: 4.9, teslimatSuresi: 20, lat: 41.007, lng: 28.977, gorselUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=60', aktif: true }
];

// Basit mesafe hesaplama (haversine yerine taslak yaklasim)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const dx = lat1 - lat2;
  const dy = lng1 - lng2;
  return Math.sqrt(dx * dx + dy * dy) * 111; // yaklaşık km
};

router.get('/api/restaurants', (req, res) => {
  try {
    const { userId, lat, lng, limit } = req.query;
    const userLat = parseFloat(lat) || 41.0082;
    const userLng = parseFloat(lng) || 28.9784;
    const parsedLimit = parseInt(limit, 10) || 10;

    // Örnek kullanıcı tercihleri (userId bazlı veritabanı okuması simülasyonu)
    const userPref = { sevilenMutfak: 'Türk' };

    let results = mockRestaurants.map(rest => {
      const distance = calculateDistance(userLat, userLng, rest.lat, rest.lng);
      
      // PersonalScore hesaplama
      let personalScore = 0;
      if (rest.mutfakTuru === userPref.sevilenMutfak) personalScore += 10; // Mutfak uyumu
      if (distance < 2) personalScore += 10;
      else if (distance < 5) personalScore += 5; // Mesafe
      
      personalScore += rest.puan * 2; // Puan ağırlığı
      
      if (rest.teslimatSuresi <= 30) personalScore += 5; // Teslimat süresi
      
      return {
        ...rest,
        distance: distance.toFixed(1),
        personalScore
      };
    });

    results.sort((a, b) => b.personalScore - a.personalScore);
    results = results.slice(0, parsedLimit);

    res.json(results);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});

module.exports = router;

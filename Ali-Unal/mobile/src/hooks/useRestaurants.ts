import { useState, useEffect } from 'react';
import * as Location from 'expo-location'; // Expo veya uyumlu location servisi
import RestaurantService, { Restaurant } from '../services/restaurantService';

export const useRestaurants = (userId?: string, limit: number = 10) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fallback konum (İstanbul)
      let lat = 41.0082;
      let lng = 28.9784;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          lat = location.coords.latitude;
          lng = location.coords.longitude;
        }
      } catch (locErr) {
        console.log('Konum izni alınamadı veya hata oluştu, fallback kullanılıyor.', locErr);
      }

      const data = await RestaurantService.getRestaurants({ userId, lat, lng, limit });
      setRestaurants(data);
    } catch (err: any) {
      setError(err.message || 'Restoranlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [userId, limit]);

  return { restaurants, loading, error, refetch: fetchRestaurants };
};

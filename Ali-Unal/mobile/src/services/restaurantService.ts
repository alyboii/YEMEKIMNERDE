import httpClient from './httpClient';

export interface RestaurantParams {
  userId?: string;
  lat: number;
  lng: number;
  limit?: number;
}

export interface Restaurant {
  id: string;
  ad: string;
  mutfakTuru: string;
  puan: number;
  teslimatSuresi: number;
  lat: number;
  lng: number;
  gorselUrl: string;
  aktif: boolean;
  distance: string;
  personalScore: number;
}

class RestaurantService {
  async getRestaurants(params: RestaurantParams): Promise<Restaurant[]> {
    try {
      const query = new URLSearchParams();
      if (params.userId) query.append('userId', params.userId);
      if (params.lat) query.append('lat', params.lat.toString());
      if (params.lng) query.append('lng', params.lng.toString());
      if (params.limit) query.append('limit', params.limit.toString());

      const response = await httpClient.get(`/api/restaurants?${query.toString()}`);
      return response.data || response; // Uygun API yapısına göre düzenlendi
    } catch (error) {
      throw new Error('Restoranlar getirilirken bir hata oluştu.');
    }
  }
}

export default new RestaurantService();

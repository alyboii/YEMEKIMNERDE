// ─────────────────────────────────────────────
// Recommendation Service — "Sana Özel" Öneri Motoru
// Skorlama:  skor = puan + (kullanıcının o mutfak türüne ilgisi)
// Tercihler KALICIDIR (AsyncStorage). Paket kurulu değilse bellek içine
// güvenli şekilde düşer (uygulama çökmez).
// Sıralama ayrıca sunucu tarafında da yapılabilir → restaurantService.getRecommendedRestaurants
// ─────────────────────────────────────────────

// AsyncStorage'ı güvenli yükle (kurulu değilse null kalır → bellek içi mod)
let AsyncStorage = null;
try {
  // eslint-disable-next-line global-require
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

const STORAGE_KEY = '@yemekimnerede_tercihler';

// ─── Tercih deposu ───
const prefs = {
  cuisineCounts: {}, // { 'Türk': 2, 'Japon': 1 }
  visited: [],       // ziyaret edilen restoran id'leri
};

let loaded = false;

// Skor ağırlıkları
const RATING_WEIGHT = 1.0;
const CUISINE_WEIGHT = 1.5;

// ─── Kalıcı depodan tercihleri yükle (uygulama açılışında bir kez) ───
export const loadPreferences = async () => {
  if (loaded) return;
  loaded = true;
  if (!AsyncStorage) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      prefs.cuisineCounts = saved.cuisineCounts || {};
      prefs.visited = saved.visited || [];
    }
  } catch (e) {
    // sessizce geç — bellek içi devam eder
  }
};

// ─── Tercihleri kalıcı depoya yaz ───
const persist = async () => {
  if (!AsyncStorage) return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    // sessizce geç
  }
};

/**
 * Kullanıcı bir restoranı görüntülediğinde çağrılır.
 */
export const recordRestaurantView = (restaurant) => {
  if (!restaurant) return;
  const tur = restaurant.category;
  if (tur) {
    prefs.cuisineCounts[tur] = (prefs.cuisineCounts[tur] || 0) + 1;
  }
  if (restaurant.id && !prefs.visited.includes(restaurant.id)) {
    prefs.visited.push(restaurant.id);
  }
  persist();
};

/** Sunucuya gönderilecek tercih objesi (mutfak türü → ilgi sayısı). */
export const getPreferences = () => ({ ...prefs.cuisineCounts });

/** Tek bir restoranın öneri skoru (istemci tarafı yedek hesap). */
export const scoreRestaurant = (restaurant) => {
  const puan = parseFloat(restaurant.rating) || 0;
  const ilgi = prefs.cuisineCounts[restaurant.category] || 0;
  return puan * RATING_WEIGHT + ilgi * CUISINE_WEIGHT;
};

/** Restoran listesini öneri skoruna göre sıralı (kopya) döndürür (istemci yedeği). */
export const getRecommended = (restaurants) => {
  return [...restaurants].sort((a, b) => scoreRestaurant(b) - scoreRestaurant(a));
};

/** Kullanıcının tercih geçmişi var mı? */
export const hasPreferences = () => prefs.visited.length > 0;

/** En çok ilgi gösterilen mutfak türü (başlık altında göstermek için). */
export const getTopCuisine = () => {
  const entries = Object.entries(prefs.cuisineCounts);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

export default {
  loadPreferences,
  recordRestaurantView,
  getPreferences,
  scoreRestaurant,
  getRecommended,
  hasPreferences,
  getTopCuisine,
};

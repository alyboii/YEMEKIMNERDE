// ─────────────────────────────────────────────
// Redis Cache Yapılandırması
// REDIS_URL varsa cache aktif; yoksa/erişilemezse istekler direkt DB'ye düşer
// (uygulama her durumda çalışır — Redis opsiyonel ama varsa hızlandırır).
// ─────────────────────────────────────────────

const { createClient } = require('redis');

let client = null;
let ready = false;

// Redis'e bağlanmayı dener (server açılışında bir kez çağrılır)
async function initRedis() {
  if (!process.env.REDIS_URL) {
    console.log('ℹ️  REDIS_URL yok — cache devre dışı (istekler direkt DB\'ye gider).');
    return;
  }
  try {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', () => { ready = false; });          // bağlantı koparsa cache'i sessizce kapat
    client.on('ready', () => {
      ready = true;
      console.log('✅ Redis bağlandı — cache AKTİF');
    });
    await client.connect();
  } catch (e) {
    console.log('⚠️  Redis bağlanamadı, cache devre dışı:', e.message);
    client = null;
    ready = false;
  }
}

// Cache'ten oku (yoksa null döner)
async function cacheGet(key) {
  if (!ready || !client) return null;
  try {
    const v = await client.get(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

// Cache'e yaz (varsayılan 60 sn TTL)
async function cacheSet(key, value, ttlSeconds = 60) {
  if (!ready || !client) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    // sessizce geç
  }
}

// Cache'ten sil (veri değişince çağrılır — bayatlamayı önler)
async function cacheDel(...keys) {
  if (!ready || !client) return;
  try {
    await client.del(keys);
  } catch {
    // sessizce geç
  }
}

// Test amaçlı: gerçek Redis olmadan cache mantığını test etmek için sahte client enjekte et
function _setClient(fake) {
  client = fake;
  ready = !!fake;
}

module.exports = { initRedis, cacheGet, cacheSet, cacheDel, _setClient };

// ─────────────────────────────────────────────
// Redis cache mantığı testleri (sahte client ile — gerçek Redis gerekmez)
// set → get → del → invalidation akışını doğrular.
// ─────────────────────────────────────────────

const test = require('node:test');
const assert = require('node:assert');
const cache = require('../config/redis');

// Bellek içi sahte Redis client'ı (gerçek node-redis API'sini taklit eder)
function fakeRedis() {
  const store = {};
  return {
    get: async (k) => (k in store ? store[k] : null),
    set: async (k, v) => { store[k] = v; },               // EX opsiyonu yok sayılır
    del: async (keys) => { (Array.isArray(keys) ? keys : [keys]).forEach((k) => delete store[k]); },
    _store: store,
  };
}

test('cache yok (client yok) → cacheGet null döner (DB fallback)', async () => {
  cache._setClient(null);
  assert.strictEqual(await cache.cacheGet('restaurants:all'), null);
});

test('cacheSet sonra cacheGet → aynı veriyi döndürür (HIT)', async () => {
  cache._setClient(fakeRedis());
  const data = [{ ad: 'Kebapçı', puan: 4.7 }];
  await cache.cacheSet('restaurants:all', data, 60);
  const cached = await cache.cacheGet('restaurants:all');
  assert.deepStrictEqual(cached, data);
});

test('cacheDel sonra cacheGet → null (invalidation çalışıyor)', async () => {
  cache._setClient(fakeRedis());
  await cache.cacheSet('restaurants:all', [{ ad: 'X' }], 60);
  await cache.cacheDel('restaurants:all');
  assert.strictEqual(await cache.cacheGet('restaurants:all'), null);
});

test('JSON serialize/deserialize bozulmadan korunur', async () => {
  cache._setClient(fakeRedis());
  const obj = { liste: [1, 2, 3], nested: { a: 'çğü', b: true } };
  await cache.cacheSet('k', obj, 30);
  assert.deepStrictEqual(await cache.cacheGet('k'), obj);
});

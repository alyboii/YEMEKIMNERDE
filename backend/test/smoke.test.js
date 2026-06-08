// ─────────────────────────────────────────────
// Smoke (duman) testleri — Node yerleşik test runner (ekstra paket gerektirmez)
// Çalıştır:  npm test   (yani: node --test)
// Amaç: CI'da "testler geçiyor" yeşil tikini sağlamak + temel sağlık kontrolü
// ─────────────────────────────────────────────

const test = require('node:test');
const assert = require('node:assert');

test('temel aritmetik çalışıyor', () => {
  assert.strictEqual(1 + 1, 2);
});

test('Restoran modeli hatasız yüklenebiliyor', () => {
  const Restoran = require('../models/Restaurant');
  assert.ok(Restoran, 'Restoran modeli tanımlı olmalı');
  assert.strictEqual(Restoran.modelName, 'Restoran');
});

test('Yorum modeli hatasız yüklenebiliyor', () => {
  const Yorum = require('../models/Yorum');
  assert.ok(Yorum, 'Yorum modeli tanımlı olmalı');
  assert.strictEqual(Yorum.modelName, 'Yorum');
});

test('restaurants route modülü yüklenebiliyor', () => {
  const router = require('../routes/restaurants');
  assert.ok(router, 'restaurants router export edilmiş olmalı');
});

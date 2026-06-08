/**
 * @format
 * Saf yardımcı fonksiyon birim testleri — native modül gerektirmez,
 * bu yüzden CI'da güvenle ve hızlıca geçer.
 */

import { capitalizeWords, getUserInitials } from '../src/utils/helpers';

describe('helpers', () => {
  test('capitalizeWords her kelimenin ilk harfini büyütür', () => {
    expect(capitalizeWords('john doe')).toBe('John Doe');
    expect(capitalizeWords('merhaba dunya')).toBe('Merhaba Dunya');
    expect(capitalizeWords('')).toBe('');
  });

  test('getUserInitials ad/soyad baş harflerini döndürür', () => {
    expect(getUserInitials({ ad: 'Ali', soyad: 'Veli' })).toBe('AV');
    expect(getUserInitials(null)).toBe('?');
  });
});

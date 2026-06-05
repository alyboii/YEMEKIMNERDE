// ─────────────────────────────────────────────
// Tipografi — YEMEKİMNEREDE Tasarım Sistemi
// Kaynak: Google Stitch — Plus Jakarta Sans + Inter
// ─────────────────────────────────────────────

import { Platform } from 'react-native';

const FONT_FAMILY = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
});

const TYPOGRAPHY = {
  // ─── Başlıklar (Plus Jakarta Sans eşdeğeri) ───
  h1: {
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  h2: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },

  // ─── Gövde Metinleri (Inter eşdeğeri) ───
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },

  // ─── Etiketler ───
  label: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 0.7,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // ─── Buton ───
  button: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  // ─── Diğer ───
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

export { FONT_FAMILY };
export default TYPOGRAPHY;

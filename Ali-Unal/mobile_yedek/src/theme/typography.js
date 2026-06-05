// ─────────────────────────────────────────────
// Tipografi — YEMEKİMNEREDE Tasarım Sistemi
// Platform varsayılan fontları kullanılır
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
  // ─── Başlıklar ───
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },

  // ─── Gövde Metinleri ───
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  // ─── Etiketler ───
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // ─── Buton ───
  button: {
    fontSize: 16,
    fontWeight: '600',
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
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
};

export { FONT_FAMILY };
export default TYPOGRAPHY;

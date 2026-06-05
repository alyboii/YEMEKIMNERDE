// ─────────────────────────────────────────────
// Spacing — 8dp Grid Sistemi
// Tüm padding/margin değerleri 8'in katları
// ─────────────────────────────────────────────

const BASE = 8;

const SPACING = {
  // ─── Temel Değerler ───
  xs: BASE * 0.5,   //  4
  sm: BASE,          //  8
  md: BASE * 2,      // 16
  lg: BASE * 3,      // 24
  xl: BASE * 4,      // 32
  xxl: BASE * 5,     // 40
  xxxl: BASE * 6,    // 48

  // ─── Bileşen İçi Padding ───
  inputPaddingH: BASE * 2,    // 16 — TextInput yatay padding
  inputPaddingV: BASE * 1.5,  // 12 — TextInput dikey padding
  cardPadding: BASE * 2,      // 16 — Kart iç padding
  screenPadding: BASE * 2.5,  // 20 — Ekran kenar boşluğu
  sectionGap: BASE * 3,       // 24 — Bölümler arası boşluk

  // ─── Border Radius ───
  radiusSm: BASE,         //  8
  radiusMd: BASE * 1.5,   // 12
  radiusLg: BASE * 2,     // 16
  radiusXl: BASE * 3,     // 24
  radiusFull: 9999,        // Tam yuvarlak

  // ─── Buton Yükseklikleri ───
  buttonHeight: BASE * 6,       // 48
  buttonHeightSmall: BASE * 5,  // 40
  inputHeight: BASE * 6,        // 48

  // ─── Touch Target (Erişilebilirlik) ───
  touchTarget: BASE * 5.5,  // 44 — Min dokunma alanı (iOS HIG)

  // ─── İkon Boyutları ───
  iconSm: BASE * 2,     // 16
  iconMd: BASE * 3,     // 24
  iconLg: BASE * 4,     // 32
  iconXl: BASE * 6,     // 48

  // ─── Avatar Boyutları ───
  avatarSm: BASE * 4,   // 32
  avatarMd: BASE * 6,   // 48
  avatarLg: BASE * 10,  // 80
};

// ─── Shadow Stilleri (Uber stili - gölgeler kaldırıldı/minimum yapıldı) ───
export const SHADOWS = {
  small: {
    elevation: 0,
    shadowColor: 'transparent',
  },
  medium: {
    elevation: 0,
    shadowColor: 'transparent',
  },
  large: {
    elevation: 0,
    shadowColor: 'transparent',
  },
};

export default SPACING;

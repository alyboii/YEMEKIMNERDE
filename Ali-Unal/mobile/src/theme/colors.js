// ─────────────────────────────────────────────
// Renk Paleti — YEMEKİMNEREDE Tasarım Sistemi
// Kaynak: Google Stitch — Uber-style Dark Mode
// ─────────────────────────────────────────────

const COLORS = {
  // ─── Primary (Neon Yeşil — Stitch Design Token) ───
  primary: '#00E676',
  primaryLight: '#75FF9E',
  primaryDark: '#00C853',
  primarySurface: 'rgba(0, 230, 118, 0.1)',
  primaryBorder: 'rgba(0, 230, 118, 0.3)',
  primaryGlow: 'rgba(0, 230, 118, 0.3)',

  // ─── Secondary ───
  secondary: '#C8C6C5',
  secondaryLight: '#E5E2E1',
  secondaryDark: '#4A4949',

  // ─── Başarı (Yeşil) ───
  success: '#00E676',
  successLight: '#69F0AE',
  successDark: '#00C853',
  successSurface: 'rgba(0, 230, 118, 0.1)',

  // ─── Hata ───
  error: '#FFB4AB',
  errorLight: '#FFDAD6',
  errorDark: '#93000A',
  errorSurface: 'rgba(255, 180, 171, 0.1)',

  // ─── Uyarı ───
  warning: '#E2A257',
  warningLight: '#FFE566',
  warningSurface: 'rgba(226, 162, 87, 0.1)',

  // ─── Bilgi ───
  info: '#32ADE6',
  infoLight: '#64D2FF',
  infoSurface: 'rgba(50, 173, 230, 0.1)',

  // ─── Yüzeyler (Stitch Level Sistemi) ───
  white: '#FFFFFF',
  black: '#000000',
  background: '#000000',         // Splash: pitch black
  surface: '#121212',            // Ana ekran arka planı
  card: '#1E1E1E',              // Kart arka planı (Level-2)
  surfaceContainer: '#1F1F1F',   // Input arka planı
  surfaceContainerHigh: '#2A2A2A',
  surfaceContainerHighest: '#353535',
  border: '#2C2C2C',
  divider: 'rgba(255, 255, 255, 0.05)',
  disabled: '#3A3A3A',
  placeholder: '#8E8E93',

  // ─── Metin ───
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#8E8E93',
  textInverse: '#000000',        // Yeşil buton üzerindeki siyah yazı
  textLink: '#00E676',
  onSurface: '#E2E2E2',

  // ─── Overlay / Shadow ───
  overlay: 'rgba(0, 0, 0, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.6)',

  // ─── Skeleton ───
  skeletonBase: '#1C1C1E',
  skeletonHighlight: '#2C2C2E',
};

export default COLORS;

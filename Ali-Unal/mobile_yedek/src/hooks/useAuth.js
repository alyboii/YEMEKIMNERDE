// ─────────────────────────────────────────────
// useAuth Hook — AuthContext Consumer
// Ekranlardan auth state'ine kolay erişim sağlar
// ─────────────────────────────────────────────

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * AuthContext'e erişim sağlayan custom hook.
 *
 * Kullanım:
 *   const { user, login, logout, isAuthenticated } = useAuth();
 *
 * Döndürdüğü değerler:
 *
 * State:
 *   @property {object|null}  user             - Kullanıcı objesi
 *   @property {string|null}  token            - JWT token
 *   @property {boolean}      isAuthenticated  - Giriş yapılmış mı?
 *   @property {boolean}      isLoading        - Yükleme durumu
 *   @property {string|null}  error            - Son hata mesajı
 *
 * Auth Actions:
 *   @function register        - Kayıt ol
 *   @function login           - Giriş yap
 *   @function logout          - Çıkış yap
 *
 * Profile Actions:
 *   @function refreshProfile  - Profili sunucudan yenile
 *   @function updateProfile   - Profil güncelle
 *   @function changePassword  - Şifre değiştir
 *   @function deleteAccount   - Hesabı sil
 *
 * Address Actions:
 *   @function refreshAddresses - Adresleri yenile
 *   @function deleteAddress    - Adres sil
 *
 * Utils:
 *   @function clearError      - Hata mesajını temizle
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth hook\'u sadece <AuthProvider> içinde kullanılabilir.\n' +
      'App.js dosyasında AuthProvider ile sarmalandığından emin olun.'
    );
  }

  return context;
};

export default useAuth;

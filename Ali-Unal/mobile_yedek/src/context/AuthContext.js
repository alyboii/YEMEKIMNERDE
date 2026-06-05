// ─────────────────────────────────────────────
// Auth Context — Global Kimlik Doğrulama State'i
// React Context + useReducer pattern
// ─────────────────────────────────────────────

import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { authReducer, initialAuthState, AUTH_ACTIONS } from './AuthReducer';
import AuthService from '../services/authService';
import UserService from '../services/userService';

// ─── Context Oluştur ───
export const AuthContext = createContext(null);

// ─── Provider Bileşeni ───
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // ════════════════════════════════════════════
  // Uygulama Açılışında Oturum Kontrolü
  // ════════════════════════════════════════════
  useEffect(() => {
    const bootstrapAuth = async () => {
      console.log('\n🚀 [AuthContext] Uygulama başlatılıyor — Oturum kontrol ediliyor...');

      try {
        const authData = await AuthService.checkAuthState();

        if (authData?.token && authData?.user) {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: authData,
          });
          console.log('🚀 [AuthContext] Mevcut oturum geri yüklendi');
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          console.log('🚀 [AuthContext] Aktif oturum bulunamadı');
        }
      } catch (error) {
        console.error('🚀 [AuthContext] Oturum kontrolü hatası:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    bootstrapAuth();
  }, []);

  // ════════════════════════════════════════════
  // Auth İşlemleri (Actions)
  // ════════════════════════════════════════════

  /**
   * Kullanıcı kaydı oluşturur.
   * Başarılı olursa otomatik giriş yapar.
   */
  const register = useCallback(async ({ ad, soyad, email, sifre, telefon }) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const data = await AuthService.register({ ad, soyad, email, sifre, telefon });

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: data,
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'Kayıt işlemi başarısız oldu';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Kullanıcı girişi yapar.
   */
  const login = useCallback(async ({ email, sifre }) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      const data = await AuthService.login({ email, sifre });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: data,
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'Giriş işlemi başarısız oldu';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Kullanıcı çıkış yapar.
   */
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      // Çıkış her durumda yapılmalı
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    }
  }, []);

  /**
   * Profil bilgilerini sunucudan yeniler.
   */
  const refreshProfile = useCallback(async () => {
    if (!state.user?._id) return { success: false };

    try {
      const userData = await UserService.getUser(state.user._id);
      const user = userData?.kullanici || userData;

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: user,
      });

      return { success: true, data: user };
    } catch (error) {
      const errorMessage = error.message || 'Profil yüklenemedi';
      return { success: false, error: errorMessage };
    }
  }, [state.user?._id]);

  /**
   * Profil bilgilerini günceller.
   */
  const updateProfile = useCallback(async (updateData) => {
    if (!state.user?._id) return { success: false };

    try {
      const data = await UserService.updateUser(state.user._id, updateData);
      const updatedUser = data?.kullanici || data;

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser,
      });

      return { success: true, data: updatedUser };
    } catch (error) {
      const errorMessage = error.message || 'Profil güncellenemedi';
      return { success: false, error: errorMessage };
    }
  }, [state.user?._id]);

  /**
   * Şifre değiştirir.
   */
  const changePassword = useCallback(async (mevcutSifre, yeniSifre) => {
    if (!state.user?._id) return { success: false };

    try {
      const data = await UserService.changePassword(state.user._id, mevcutSifre, yeniSifre);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'Şifre değiştirilemedi';
      return { success: false, error: errorMessage };
    }
  }, [state.user?._id]);

  /**
   * Hesabı kalıcı olarak siler.
   */
  const deleteAccount = useCallback(async () => {
    if (!state.user?._id) return { success: false };

    try {
      await UserService.deleteUser(state.user._id);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Hesap silinemedi';
      return { success: false, error: errorMessage };
    }
  }, [state.user?._id]);

  /**
   * Adres listesini yeniler.
   */
  const refreshAddresses = useCallback(async () => {
    if (!state.user?._id) return { success: false };

    try {
      const adresler = await UserService.getAddresses(state.user._id);

      dispatch({
        type: AUTH_ACTIONS.SET_ADDRESSES,
        payload: adresler,
      });

      return { success: true, data: adresler };
    } catch (error) {
      const errorMessage = error.message || 'Adresler yüklenemedi';
      return { success: false, error: errorMessage };
    }
  }, [state.user?._id]);

  /**
   * Bir adresi siler.
   */
  const deleteAddress = useCallback(async (adresId) => {
    if (!state.user?._id) return { success: false };

    // Optimistic update — UI'dan hemen kaldır
    dispatch({ type: AUTH_ACTIONS.REMOVE_ADDRESS, payload: adresId });

    try {
      await UserService.deleteAddress(state.user._id, adresId);
      return { success: true };
    } catch (error) {
      // Hata olursa adresleri yeniden yükle (rollback)
      await refreshAddresses();
      const errorMessage = error.message || 'Adres silinemedi';
      return { success: false, error: errorMessage };
    }
  }, [state.user?._id, refreshAddresses]);

  /**
   * Hata mesajını temizle.
   */
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // ════════════════════════════════════════════
  // Context Value (Memoize edilmiş)
  // ════════════════════════════════════════════
  const contextValue = useMemo(
    () => ({
      // State
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,

      // Auth Actions
      register,
      login,
      logout,

      // Profile Actions
      refreshProfile,
      updateProfile,
      changePassword,
      deleteAccount,

      // Address Actions
      refreshAddresses,
      deleteAddress,

      // Utils
      clearError,
    }),
    [
      state,
      register,
      login,
      logout,
      refreshProfile,
      updateProfile,
      changePassword,
      deleteAccount,
      refreshAddresses,
      deleteAddress,
      clearError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

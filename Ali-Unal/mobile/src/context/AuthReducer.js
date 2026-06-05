// ─────────────────────────────────────────────
// Auth Reducer — Durum Yönetimi Action'ları
// React useReducer ile kullanılır
// ─────────────────────────────────────────────

// ─── Action Tipleri ───
export const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION',
  SET_ADDRESSES: 'SET_ADDRESSES',
  REMOVE_ADDRESS: 'REMOVE_ADDRESS',
};

// ─── Başlangıç State'i ───
export const initialAuthState = {
  user: null,            // Kullanıcı objesi { _id, ad, soyad, email, telefon, adresler }
  token: null,           // JWT access token
  isAuthenticated: false, // Giriş yapılmış mı?
  isLoading: true,       // Uygulama açılışında session kontrol ediliyor
  error: null,           // Son hata mesajı
};

// ─── Reducer Fonksiyonu ───
export const authReducer = (state, action) => {
  switch (action.type) {
    // ─── Yükleme durumunu ayarla ───
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    // ─── Başarılı giriş ───
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.kullanici,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    // ─── Başarılı kayıt (giriş ile aynı davranış) ───
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.kullanici,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    // ─── Oturum geri yükle (app açılışı) ───
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    // ─── Çıkış yap ───
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialAuthState,
        isLoading: false,
      };

    // ─── Kullanıcı bilgilerini güncelle ───
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };

    // ─── Adres listesini set et ───
    case AUTH_ACTIONS.SET_ADDRESSES:
      return {
        ...state,
        user: {
          ...state.user,
          adresler: action.payload,
        },
      };

    // ─── Adres ekle ───
    case AUTH_ACTIONS.ADD_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          adresler: [...(state.user?.adresler || []), action.payload],
        },
      };

    // ─── Bir adresi listeden kaldır (optimistic update) ───
    case AUTH_ACTIONS.REMOVE_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          adresler: (state.user?.adresler || []).filter(
            (adres) => adres._id !== action.payload
          ),
        },
      };

    // ─── Hata set et ───
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    // ─── Hatayı temizle ───
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      console.warn(`⚠️ [AuthReducer] Bilinmeyen action tipi: ${action.type}`);
      return state;
  }
};

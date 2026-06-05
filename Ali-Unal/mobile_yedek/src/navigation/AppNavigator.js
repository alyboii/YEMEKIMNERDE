// ─────────────────────────────────────────────
// App Navigator — Navigasyon Yapılandırması
// Auth Stack (giriş/kayıt) ↔ Main Stack (profil/adres)
// ─────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuth from '../hooks/useAuth';
import LoadingIndicator from '../components/common/LoadingIndicator';

// Auth Ekranları
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Ekranları
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddressesScreen from '../screens/profile/AddressesScreen';

import COLORS from '../theme/colors';
import TYPOGRAPHY from '../theme/typography';

const Stack = createNativeStackNavigator();

// ─── Ortak Header Stili ───
const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleStyle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  headerTintColor: COLORS.primary,
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: COLORS.background,
  },
  animation: 'slide_from_right',
};

// ─── Auth Stack (Giriş yapılmamış) ───
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      ...defaultScreenOptions,
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: 'Giriş Yap' }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: 'Kayıt Ol' }}
    />
  </Stack.Navigator>
);

// ─── Main Stack (Giriş yapılmış) ───
const MainStack = () => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profilim',
        headerLeft: () => null, // Geri butonu yok (ana ekran)
      }}
    />
    <Stack.Screen
      name="Addresses"
      component={AddressesScreen}
      options={{ title: 'Adreslerim' }}
    />
  </Stack.Navigator>
);

// ─── Root Navigator ───
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Uygulama açılışında session kontrol ediliyor
  if (isLoading) {
    return <LoadingIndicator message="Uygulama yükleniyor..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;

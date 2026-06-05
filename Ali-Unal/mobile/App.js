// ─────────────────────────────────────────────
// App.js — Root Bileşeni
// Provider'ları sarmalama, navigasyon ve toast
// ─────────────────────────────────────────────

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from './src/components/common/Toast';

/**
 * Uygulama kök bileşeni.
 *
 * Katman sırası (dıştan içe):
 * 1. GestureHandlerRootView — Gesture desteği
 * 2. SafeAreaProvider — Safe area desteği
 * 3. AuthProvider — Global auth state
 * 4. AppNavigator — Navigasyon
 * 5. Toast — Global snackbar
 */
const App = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
          <Toast />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;

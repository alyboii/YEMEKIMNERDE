// ─────────────────────────────────────────────
// Toast / Snackbar — Geri Bildirim Bileşeni
// Başarı, hata, uyarı mesajları
// ─────────────────────────────────────────────

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

// ─── Global Toast Referansı ───
let toastRef = null;

/**
 * Toast.show() ile herhangi bir yerden çağrılabilir.
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  if (toastRef) {
    toastRef.show(message, type, duration);
  }
};

/**
 * Toast Provider bileşeni.
 * App.js'de en üst seviyeye eklenir.
 */
const Toast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  const show = useCallback((msg, msgType = 'info', duration = 3000) => {
    // Önceki timeout'u temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage(msg);
    setType(msgType);
    setVisible(true);

    // Giriş animasyonu
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Otomatik gizle
    timeoutRef.current = setTimeout(() => {
      hide();
    }, duration);
  }, [translateY, opacity]);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [translateY, opacity]);

  // Global ref'i kaydet
  useEffect(() => {
    toastRef = { show };
    return () => {
      toastRef = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show]);

  if (!visible) return null;

  const toastStyle = getToastStyle(type);

  return (
    <Animated.View
      style={[
        styles.container,
        toastStyle.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={hide}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>{toastStyle.icon}</Text>
        <Text style={[styles.message, toastStyle.text]} numberOfLines={2}>
          {message}
        </Text>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Toast Tipleri ───
const getToastStyle = (type) => {
  switch (type) {
    case 'success':
      return {
        container: { backgroundColor: COLORS.successDark },
        text: { color: COLORS.white },
        icon: '✅',
      };
    case 'error':
      return {
        container: { backgroundColor: COLORS.errorDark },
        text: { color: COLORS.white },
        icon: '❌',
      };
    case 'warning':
      return {
        container: { backgroundColor: COLORS.warning },
        text: { color: COLORS.white },
        icon: '⚠️',
      };
    case 'info':
    default:
      return {
        container: { backgroundColor: COLORS.secondary },
        text: { color: COLORS.white },
        icon: 'ℹ️',
      };
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 54, // StatusBar + safe area
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  icon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  closeIcon: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
});

export default Toast;

// ─────────────────────────────────────────────
// Loading Indicator — Merkezi Yükleme Göstergesi
// ─────────────────────────────────────────────

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

/**
 * @param {object} props
 * @param {string}  props.message  - Yükleme mesajı
 * @param {'small'|'large'} props.size
 * @param {boolean} props.overlay  - Tam ekran overlay
 * @param {string}  props.color    - Spinner rengi
 */
const LoadingIndicator = ({
  message = 'Yükleniyor...',
  size = 'large',
  overlay = false,
  color = COLORS.primary,
}) => {
  if (overlay) {
    return (
      <View style={styles.overlay}>
        <View style={styles.overlayContent}>
          <ActivityIndicator size={size} color={color} />
          {message && <Text style={styles.overlayMessage}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayContent: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusLg,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 160,
  },
  overlayMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default LoadingIndicator;

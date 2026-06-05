// ─────────────────────────────────────────────
// Skeleton Loader — İçerik Yükleme Placeholder
// Profil ve adres ekranları için
// ─────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import COLORS from '../../theme/colors';
import SPACING from '../../theme/spacing';

/**
 * Tek bir skeleton çubuğu.
 * @param {object} props
 * @param {number|string} props.width  - Genişlik
 * @param {number} props.height - Yükseklik
 * @param {number} props.radius - Border radius
 * @param {object} props.style  - Ek stil
 */
const SkeletonLine = ({ width = '100%', height = 16, radius, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.line,
        {
          width,
          height,
          borderRadius: radius || SPACING.radiusSm,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Profil ekranı skeleton'ı.
 */
export const ProfileSkeleton = () => (
  <View style={styles.profileContainer}>
    {/* Avatar */}
    <View style={styles.profileHeader}>
      <SkeletonLine
        width={SPACING.avatarLg}
        height={SPACING.avatarLg}
        radius={SPACING.avatarLg / 2}
      />
      <View style={styles.profileInfo}>
        <SkeletonLine width="60%" height={20} />
        <SkeletonLine width="80%" height={14} style={{ marginTop: SPACING.sm }} />
      </View>
    </View>

    {/* Form Alanları */}
    <View style={styles.formSkeleton}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.fieldSkeleton}>
          <SkeletonLine width="30%" height={14} />
          <SkeletonLine
            width="100%"
            height={SPACING.inputHeight}
            radius={SPACING.radiusMd}
            style={{ marginTop: SPACING.xs }}
          />
        </View>
      ))}
    </View>
  </View>
);

/**
 * Adres listesi skeleton'ı.
 */
export const AddressesSkeleton = () => (
  <View style={styles.addressContainer}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.addressCard}>
        <View style={styles.addressCardLeft}>
          <SkeletonLine width={40} height={40} radius={SPACING.radiusSm} />
        </View>
        <View style={styles.addressCardRight}>
          <SkeletonLine width="40%" height={16} />
          <SkeletonLine width="90%" height={14} style={{ marginTop: SPACING.xs }} />
          <SkeletonLine width="60%" height={14} style={{ marginTop: SPACING.xs }} />
        </View>
      </View>
    ))}
  </View>
);

// ─── Default Export ───
const SkeletonLoader = { ProfileSkeleton, AddressesSkeleton, SkeletonLine };

const styles = StyleSheet.create({
  line: {
    backgroundColor: COLORS.skeletonBase,
  },

  // Profile Skeleton
  profileContainer: {
    padding: SPACING.screenPadding,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  formSkeleton: {
    marginTop: SPACING.md,
  },
  fieldSkeleton: {
    marginBottom: SPACING.md,
  },

  // Address Skeleton
  addressContainer: {
    padding: SPACING.screenPadding,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusMd,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.md,
  },
  addressCardLeft: {
    marginRight: SPACING.md,
  },
  addressCardRight: {
    flex: 1,
  },
});

export { SkeletonLine };
export default SkeletonLoader;

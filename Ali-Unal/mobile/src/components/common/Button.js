// ─────────────────────────────────────────────
// Button Bileşeni — Primary / Secondary / Danger
// Loading durumu, disabled state desteği
// ─────────────────────────────────────────────

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';
import { SHADOWS } from '../../theme/spacing';

/**
 * @param {object} props
 * @param {string}   props.title      - Buton metni
 * @param {Function} props.onPress    - Tıklama olayı
 * @param {'primary'|'secondary'|'danger'|'outline'|'ghost'} props.variant
 * @param {boolean}  props.loading    - Yükleme durumu
 * @param {boolean}  props.disabled   - Devre dışı durumu
 * @param {boolean}  props.fullWidth  - Tam genişlik
 * @param {'default'|'small'} props.size
 * @param {string}   props.iconLeft   - Sol ikon (emoji/unicode)
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  size = 'default',
  iconLeft,
  style,
  ...rest
}) => {
  const isDisabled = disabled || loading;
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        isDisabled && variantStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyles.loaderColor}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {iconLeft && (
            <Text style={[styles.iconLeft, { color: variantStyles.textColor }]}>
              {iconLeft}
            </Text>
          )}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              { color: variantStyles.textColor },
              isDisabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Varyant Stilleri ───
const getVariantStyles = (variant) => {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: COLORS.primary,
          borderWidth: 0,
        },
        disabled: {
          backgroundColor: COLORS.primaryLight,
          opacity: 0.6,
        },
        textColor: COLORS.textInverse,
        loaderColor: COLORS.white,
      };

    case 'secondary':
      return {
        container: {
          backgroundColor: COLORS.secondaryLight,
          borderWidth: 0,
        },
        disabled: {
          backgroundColor: COLORS.disabled,
          opacity: 0.6,
        },
        textColor: COLORS.textInverse,
        loaderColor: COLORS.white,
      };

    case 'danger':
      return {
        container: {
          backgroundColor: COLORS.error,
          borderWidth: 0,
        },
        disabled: {
          backgroundColor: COLORS.errorLight,
          opacity: 0.6,
        },
        textColor: COLORS.textInverse,
        loaderColor: COLORS.white,
      };

    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: COLORS.primary,
        },
        disabled: {
          borderColor: COLORS.disabled,
          opacity: 0.6,
        },
        textColor: COLORS.primary,
        loaderColor: COLORS.primary,
      };

    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        disabled: {
          opacity: 0.4,
        },
        textColor: COLORS.primary,
        loaderColor: COLORS.primary,
      };

    default:
      return getVariantStyles('primary');
  }
};

// ─── Boyut Stilleri ───
const getSizeStyles = (size) => {
  switch (size) {
    case 'small':
      return {
        container: {
          height: SPACING.buttonHeightSmall,
          paddingHorizontal: SPACING.md,
        },
        text: TYPOGRAPHY.buttonSmall,
      };
    default:
      return {
        container: {
          height: SPACING.buttonHeight,
          paddingHorizontal: SPACING.lg,
        },
        text: TYPOGRAPHY.button,
      };
  }
};

const styles = StyleSheet.create({
  base: {
    borderRadius: SPACING.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
  iconLeft: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;

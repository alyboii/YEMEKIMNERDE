// ─────────────────────────────────────────────
// Input Bileşeni — Custom TextInput
// Hata durumu, ikon desteği, 8dp grid
// ─────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

/**
 * @param {object} props
 * @param {string} props.label        - Alan etiketi
 * @param {string} props.value        - Değer
 * @param {Function} props.onChangeText - Değer değişikliği
 * @param {Function} props.onBlur      - Focus kaybı
 * @param {string} props.error         - Hata mesajı
 * @param {string} props.placeholder   - Placeholder metin
 * @param {string} props.iconName      - Sol ikon adı (Material Icons)
 * @param {boolean} props.secureTextEntry - Şifre alanı mı?
 * @param {string} props.keyboardType  - Klavye tipi
 * @param {boolean} props.editable     - Düzenlenebilir mi?
 */
const Input = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  maxLength,
  returnKeyType,
  onSubmitEditing,
  inputRef,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const animatedBorder = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur && onBlur(e);
  };

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? COLORS.error : COLORS.border,
      error ? COLORS.error : COLORS.primary,
    ],
  });

  const hasError = !!error;

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={[
          styles.label,
          isFocused && styles.labelFocused,
          hasError && styles.labelError,
        ]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {/* Sol İkon */}
        {iconName && (
          <Text style={[
            styles.icon,
            isFocused && styles.iconFocused,
            hasError && styles.iconError,
          ]}>
            {iconName}
          </Text>
        )}

        {/* TextInput */}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            iconName && styles.inputWithIcon,
            !editable && styles.inputDisabled,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={COLORS.primary}
          {...rest}
        />

        {/* Şifre Görünürlük Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.eyeIcon}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Hata Mesajı */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  labelFocused: {
    color: COLORS.primary,
  },
  labelError: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SPACING.radiusMd,
    backgroundColor: COLORS.white,
    height: SPACING.inputHeight,
    paddingHorizontal: SPACING.inputPaddingH,
  },
  inputContainerFocused: {
    backgroundColor: COLORS.primarySurface,
  },
  inputContainerError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorSurface,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.divider,
    borderColor: COLORS.border,
  },
  icon: {
    fontSize: SPACING.iconMd,
    color: COLORS.textTertiary,
    marginRight: SPACING.sm,
  },
  iconFocused: {
    color: COLORS.primary,
  },
  iconError: {
    color: COLORS.error,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
    height: '100%',
    paddingVertical: 0,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  inputDisabled: {
    color: COLORS.textTertiary,
  },
  eyeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  errorIcon: {
    fontSize: 12,
    color: COLORS.error,
    marginRight: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    flex: 1,
  },
});

export default Input;

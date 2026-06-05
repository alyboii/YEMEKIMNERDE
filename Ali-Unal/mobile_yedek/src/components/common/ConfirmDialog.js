// ─────────────────────────────────────────────
// Confirm Dialog — Silme Onay Modalı
// Hesap silme, adres silme gibi tehlikeli işlemler için
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';
import { SHADOWS } from '../../theme/spacing';
import Button from './Button';

/**
 * @param {object} props
 * @param {boolean}  props.visible     - Modal görünürlüğü
 * @param {string}   props.title       - Başlık
 * @param {string}   props.message     - Açıklama mesajı
 * @param {string}   props.confirmText - Onay butonu metni
 * @param {string}   props.cancelText  - İptal butonu metni
 * @param {'danger'|'primary'} props.confirmVariant
 * @param {Function} props.onConfirm   - Onay callback
 * @param {Function} props.onCancel    - İptal callback
 * @param {boolean}  props.loading     - Yükleme durumu
 */
const ConfirmDialog = ({
  visible = false,
  title = 'Emin misiniz?',
  message = '',
  confirmText = 'Evet',
  cancelText = 'Vazgeç',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
  icon = '⚠️',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={!loading ? onCancel : undefined}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.dialog, SHADOWS.large]}
        >
          {/* İkon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          {/* Başlık */}
          <Text style={styles.title}>{title}</Text>

          {/* Mesaj */}
          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          {/* Butonlar */}
          <View style={styles.actions}>
            <View style={styles.buttonWrapper}>
              <Button
                title={cancelText}
                onPress={onCancel}
                variant="outline"
                disabled={loading}
                size="small"
              />
            </View>
            <View style={styles.buttonSpacer} />
            <View style={styles.buttonWrapper}>
              <Button
                title={confirmText}
                onPress={onConfirm}
                variant={confirmVariant}
                loading={loading}
                size="small"
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  dialog: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusLg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.errorSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
  },
  buttonSpacer: {
    width: SPACING.sm,
  },
});

export default ConfirmDialog;

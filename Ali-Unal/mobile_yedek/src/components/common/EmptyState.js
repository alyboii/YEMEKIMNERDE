// ─────────────────────────────────────────────
// Empty State — Boş Liste Durumu Görseli
// Adres yoksa, veri yoksa gösterilir
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';
import Button from './Button';

/**
 * @param {object} props
 * @param {string} props.icon        - Emoji ikon
 * @param {string} props.title       - Başlık
 * @param {string} props.description - Açıklama metni
 * @param {string} props.actionTitle - Buton metni (opsiyonel)
 * @param {Function} props.onAction  - Buton tıklama (opsiyonel)
 */
const EmptyState = ({
  icon = '📭',
  title = 'Henüz veri yok',
  description = 'Burada gösterilecek bir şey bulunamadı.',
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <View style={styles.actionContainer}>
          <Button
            title={actionTitle}
            onPress={onAction}
            variant="outline"
            size="small"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: SPACING.lg,
  },
});

export default EmptyState;

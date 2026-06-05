// ─────────────────────────────────────────────
// AddressCard — Tek Adres Kartı Bileşeni
// Silme butonu ile birlikte
// ─────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';
import { SHADOWS } from '../../theme/spacing';
import { formatAddress } from '../../utils/helpers';

/**
 * @param {object} props
 * @param {object}   props.address   - Adres objesi { _id, baslik, adres, sehir, ilce }
 * @param {Function} props.onDelete  - Silme callback
 * @param {boolean}  props.deleting  - Siliniyor mu?
 */
const AddressCard = ({ address, onDelete, deleting = false }) => {
  if (!address) return null;

  const addressText = formatAddress(address);

  return (
    <View style={[styles.card, SHADOWS.small, deleting && styles.cardDeleting]}>
      {/* Sol: İkon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {address.baslik?.toLowerCase().includes('ev') ? '🏠' :
           address.baslik?.toLowerCase().includes('iş') ? '🏢' : '📍'}
        </Text>
      </View>

      {/* Orta: Bilgi */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {address.baslik || 'Adres'}
        </Text>
        <Text style={styles.addressText} numberOfLines={2}>
          {addressText || address.adres || 'Adres bilgisi mevcut değil'}
        </Text>
        {address.sehir && (
          <View style={styles.cityBadge}>
            <Text style={styles.cityText}>{address.sehir}</Text>
          </View>
        )}
      </View>

      {/* Sağ: Sil Butonu */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete && onDelete(address._id)}
        disabled={deleting}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.6}
      >
        <Text style={[styles.deleteIcon, deleting && styles.deleteIconDisabled]}>
          🗑️
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusMd,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardDeleting: {
    opacity: 0.5,
  },
  iconContainer: {
    width: SPACING.iconXl,
    height: SPACING.iconXl,
    borderRadius: SPACING.radiusSm,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cityBadge: {
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySurface,
    borderRadius: SPACING.radiusSm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  cityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteIconDisabled: {
    opacity: 0.3,
  },
});

export default AddressCard;

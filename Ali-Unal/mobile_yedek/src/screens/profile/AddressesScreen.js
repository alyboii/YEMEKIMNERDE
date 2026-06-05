// ─────────────────────────────────────────────
// Adreslerim Ekranı
// GET    /v1/users/{kullaniciId}                     — Adresleri listele
// DELETE /v1/users/{kullaniciId}/addresses/{adresId}  — Adres sil
// ─────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import AddressCard from '../../components/address/AddressCard';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { AddressesSkeleton } from '../../components/common/SkeletonLoader';
import { showToast } from '../../components/common/Toast';
import useAuth from '../../hooks/useAuth';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

const AddressesScreen = ({ navigation }) => {
  const { user, refreshAddresses, deleteAddress } = useAuth();

  // ─── Local State ───
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Silinecek adres ID
  const [isDeleting, setIsDeleting] = useState(false);

  const adresler = user?.adresler || [];

  // ─── Adresleri Yükle ───
  const loadAddresses = useCallback(async () => {
    const result = await refreshAddresses();
    setIsLoading(false);

    if (!result.success) {
      showToast(result.error || 'Adresler yüklenemedi', 'error');
    }
  }, [refreshAddresses]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // ─── Pull-to-Refresh ───
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAddresses();
    setRefreshing(false);
  };

  // ─── Adres Silme Onayı ───
  const onDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const result = await deleteAddress(deleteTarget);
    setIsDeleting(false);
    setDeleteTarget(null);

    if (result.success) {
      showToast('Adres başarıyla silindi 🗑️', 'success');
    } else {
      showToast(result.error || 'Adres silinemedi', 'error');
    }
  };

  // ─── Adres Kartını Render Et ───
  const renderAddress = ({ item }) => (
    <AddressCard
      address={item}
      onDelete={(adresId) => setDeleteTarget(adresId)}
    />
  );

  // ─── Liste Başlığı ───
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>📍 Kayıtlı Adreslerim</Text>
      <Text style={styles.listCount}>
        {adresler.length} adres
      </Text>
    </View>
  );

  // ─── Loading State ───
  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <AddressesSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {adresler.length === 0 ? (
        // ─── Empty State ───
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="🏠"
            title="Henüz adres eklenmemiş"
            description="Sipariş verebilmek için bir teslimat adresi eklemeniz gerekmektedir."
          />
        </View>
      ) : (
        // ─── Adres Listesi ───
        <FlatList
          data={adresler}
          renderItem={renderAddress}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          // Performance optimizations
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      {/* ═══ Silme Onay Dialogu ═══ */}
      <ConfirmDialog
        visible={!!deleteTarget}
        icon="📍"
        title="Adresi Silmek İstediğine Emin Misin?"
        message="Bu adres kalıcı olarak silinecektir. Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="Vazgeç"
        confirmVariant="danger"
        onConfirm={onDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxl,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  listTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  listCount: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textTertiary,
    backgroundColor: COLORS.divider,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.radiusSm,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default AddressesScreen;

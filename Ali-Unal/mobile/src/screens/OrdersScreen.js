// ─────────────────────────────────────────────
// Siparişlerim Ekranı — Stitch Design (Uber Style)
// Yemekim Nerede - Neon Green Dark Mode
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import COLORS from '../theme/colors';
import TYPOGRAPHY from '../theme/typography';
import SPACING from '../theme/spacing';
import OrderService from '../services/orderService';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getOrders();
      // Tarihe göre yeniden eskiye sırala
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (error) {
      console.warn('Siparişler getirilirken hata:', error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      'Siparişi İptal Et',
      'Bu siparişi iptal etmek istediğinize emin misiniz? Ödeme tutarı kartınıza iade edilecektir.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: async () => {
            try {
              // Local state'i hızlıca güncelle
              setOrders((prev) => prev.filter((order) => order._id !== orderId));
              await OrderService.cancelOrder(orderId);
              Alert.alert('İptal Edildi', 'Siparişiniz başarıyla iptal edildi.');
            } catch (error) {
              Alert.alert('Hata', 'Sipariş iptal edilemedi.');
              fetchOrders();
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Sipariş durumu renklendirme
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'hazırlanıyor':
        return COLORS.warning;
      case 'yolda':
        return COLORS.info;
      case 'teslim edildi':
        return COLORS.success;
      case 'iptal edildi':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonIcon}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{orders.length} Sipariş</Text>
        </View>
      </View>

      {/* ─── Orders List / Empty State ─── */}
      {orders.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Henüz Sipariş Yok</Text>
          <Text style={styles.emptySubtitle}>
            Daha önce hiç sipariş vermediniz. Lezzetli menülerimizi incelemek için hemen başlayın!
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {orders.map((order) => {
            const dateStr = formatDate(order.createdAt || order.placedAt);
            const statusLower = order.status?.toLowerCase();
            const canCancel =
              statusLower === 'hazırlanıyor' ||
              statusLower === 'alındı' ||
              !statusLower; // Sadece yola çıkmamış aktif siparişler iptal edilebilir

            return (
              <View key={order._id} style={styles.orderCard}>
                {/* Kart Başlık Satırı */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderIdText} numberOfLines={1}>
                      Sipariş #{order._id?.substring(order._id.length - 8).toUpperCase() || 'BİLİNMİYOR'}
                    </Text>
                    <Text style={styles.dateText}>{dateStr}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15', borderColor: getStatusColor(order.status) + '30' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status || 'Hazırlanıyor'}
                    </Text>
                  </View>
                </View>

                {/* Sipariş Edilen Ürünler */}
                <View style={styles.itemsList}>
                  {order.items?.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={styles.itemQuantity}>{item.quantity || item.qty}x</Text>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name || item.urunAd}
                      </Text>
                      <Text style={styles.itemPrice}>₺{((item.price || item.fiyat) * (item.quantity || item.qty)).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                {/* Kart Alt Satırı: Toplam & İptal */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.totalLabel}>Toplam Tutar</Text>
                    <Text style={styles.totalValue}>
                      ₺{(order.totalAmount || order.total || 0).toFixed(2)}
                    </Text>
                  </View>

                  {canCancel && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancelOrder(order._id)}
                    >
                      <Text style={styles.cancelBtnText}>İptal Et</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingBottom: 48,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(18,18,18,0.95)',
  },
  backButton: {
    padding: SPACING.sm,
  },
  backButtonIcon: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  badgeContainer: {
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // Empty State
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: 999,
  },
  browseBtnText: {
    ...TYPOGRAPHY.h4,
    color: '#000000',
    fontWeight: '800',
  },

  // Order Cards
  orderCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderIdText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // Items List
  itemsList: {
    marginBottom: SPACING.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginRight: 8,
    minWidth: 20,
  },
  itemName: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
  },
  itemPrice: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.md,
  },

  // Footer Card
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorSurface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cancelBtnText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '800',
  },
});

export default OrdersScreen;

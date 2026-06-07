// ─────────────────────────────────────────────
// Sepet Ekranı — Stitch Design (Uber Style)
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
  Dimensions,
  RefreshControl,
} from 'react-native';
import COLORS from '../theme/colors';
import TYPOGRAPHY from '../theme/typography';
import SPACING from '../theme/spacing';
import CartService from '../services/cartService';
import OrderService from '../services/orderService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const fetchCart = async () => {
    try {
      const data = await CartService.getCart();
      setCartItems(data || []);
    } catch (error) {
      console.warn('Sepet getirilirken hata:', error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      fetchCart();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCart();
  };

  const handleUpdateQty = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      // Optimizasyon için önce local state'i güncelle
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQty } : item
        )
      );
      await CartService.updateCartItem(itemId, newQty);
    } catch (error) {
      Alert.alert('Hata', 'Miktar güncellenirken hata oluştu.');
      fetchCart(); // Hata durumunda gerçek veriyi tekrar çek
    }
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Ürünü Kaldır',
      'Bu ürünü sepetinizden çıkarmak istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            try {
              // Local state'i güncelle
              setCartItems((prev) => prev.filter((item) => item._id !== itemId));
              await CartService.removeFromCart(itemId);
            } catch (error) {
              Alert.alert('Hata', 'Ürün sepetten silinemedi.');
              fetchCart();
            }
          },
        },
      ]
    );
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const total = cartItems.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      );
      
      const itemsPayload = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // Sipariş oluştur
      await OrderService.createOrder({
        items: itemsPayload,
        totalAmount: total,
      });

      // Sepeti temizle (tüm ürünleri tek tek silerek)
      for (const item of cartItems) {
        await CartService.removeFromCart(item._id);
      }

      setCartItems([]);

      Alert.alert(
        'Siparişiniz Alındı! 🎉',
        'Siparişiniz başarıyla oluşturuldu. Hazırlanmaya başlanıyor.',
        [
          {
            text: 'Siparişlerime Git',
            onPress: () => navigation.navigate('Orders'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', error.message || 'Sipariş tamamlanırken hata oluştu.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Sepet özet hesaplamaları
  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  const deliveryFee = 0.0; // Ücretsiz teslimat
  const total = subtotal + deliveryFee;

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
        <Text style={styles.headerTitle}>Sepetim</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{cartItems.length} Ürün</Text>
        </View>
      </View>

      {/* ─── Cart Items / Empty State ─── */}
      {cartItems.length === 0 ? (
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
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Sepetiniz Boş</Text>
          <Text style={styles.emptySubtitle}>
            Sepetinizde ürün bulunmamaktadır. Lezzetli yemekleri incelemek için hemen göz atın!
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseBtnText}>Restoranlara Git</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.container}>
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
            {cartItems.map((item) => (
              <View key={item._id} style={styles.cartCard}>
                {/* Sol Taraf: Yemek İkonu */}
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarEmoji}>🍽️</Text>
                </View>

                {/* Orta Taraf: Ürün Detayları */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>₺{item.price.toFixed(2)}</Text>
                </View>

                {/* Sağ Taraf: Miktar Kontrol & Silme */}
                <View style={styles.actionContainer}>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => handleUpdateQty(item._id, item.quantity, -1)}
                    >
                      <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => handleUpdateQty(item._id, item.quantity, 1)}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleRemoveItem(item._id)}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* ─── Sipariş Özeti & Ödeme Altı ─── */}
          <View style={styles.summaryFooter}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam</Text>
              <Text style={styles.summaryValue}>₺{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Teslimat Ücreti</Text>
              <Text style={styles.summaryValueGreen}>Ücretsiz</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Toplam</Text>
              <Text style={styles.totalValue}>₺{total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, isPlacingOrder && { opacity: 0.7 }]}
              onPress={handleConfirmOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.confirmBtnText}>SİPARİŞİ TAMAMLA</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingBottom: 240, // Alt panel için boşluk
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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  browseBtnText: {
    ...TYPOGRAPHY.h4,
    color: '#000000',
    fontWeight: '800',
  },

  // Cart Cards
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 999,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  stepperValue: {
    width: 28,
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: SPACING.sm,
  },
  deleteIcon: {
    fontSize: 18,
  },

  // Summary Footer
  summaryFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18,18,18,0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.screenPadding,
    paddingBottom: 36, // Safe area space
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryValue: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  summaryValueGreen: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },
});

export default CartScreen;

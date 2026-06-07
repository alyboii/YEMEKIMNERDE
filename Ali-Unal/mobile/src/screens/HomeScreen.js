// ─────────────────────────────────────────────
// Ana Sayfa — Stitch Design (Uber Style)
// Yemekim Nerede - Neon Green Dark Mode
// Gerçek veri: GET /v1/restaurants (RestaurantService)
// ─────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import COLORS from '../theme/colors';
import TYPOGRAPHY from '../theme/typography';
import SPACING from '../theme/spacing';
import RestaurantService from '../services/restaurantService';
import { loadPreferences, getPreferences, getRecommended, hasPreferences, getTopCuisine } from '../services/recommendationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // ─── State ───
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  // Sunucudan gelen "Sana Özel" sıralaması
  const [serverReco, setServerReco] = useState([]);

  // ─── Veri Çekme ───
  const loadRestaurants = useCallback(async () => {
    try {
      setError(null);
      const data = await RestaurantService.getRestaurants();
      setRestaurants(data);
    } catch (e) {
      setError(e?.message || 'Restoranlar yüklenemedi. Bağlantını kontrol et.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRestaurants();
  };

  // Sunucu tarafı "Sana Özel" sıralamasını, kayıtlı tercihlerle getir
  const fetchReco = useCallback(async () => {
    try {
      const data = await RestaurantService.getRecommendedRestaurants(getPreferences());
      setServerReco(data);
    } catch (e) {
      setServerReco([]); // hata → istemci yedeğine düşülür
    }
  }, []);

  // Açılışta kalıcı tercihleri yükle
  useEffect(() => {
    loadPreferences();
  }, []);

  // Ekran her odaklandığında (örn. Detay'dan dönünce) öneriyi tazele
  useFocusEffect(
    useCallback(() => {
      fetchReco();
    }, [fetchReco])
  );

  // ─── Kategoriler (gerçek mutfak türlerinden üretilir) ───
  const categories = [
    'Hepsi',
    ...Array.from(new Set(restaurants.map((r) => r.category).filter(Boolean))),
  ];

  // ─── Seçili kategoriye göre filtrele ───
  const filtered =
    selectedCategory === 'Hepsi'
      ? restaurants
      : restaurants.filter((r) => r.category === selectedCategory);

  // Popüler = en yüksek puanlı ilk 5 (API zaten puana göre sıralı döndürüyor)
  const populer = filtered.slice(0, 5);

  // "Sana Özel" = sunucu önerisi (varsa), yoksa istemci yedeği. Kategoriye göre süzülür.
  const recoBase = serverReco.length ? serverReco : getRecommended(restaurants);
  const recommended = (
    selectedCategory === 'Hepsi'
      ? recoBase
      : recoBase.filter((r) => r.category === selectedCategory)
  ).slice(0, 5);
  const recoSubtitle = hasPreferences()
    ? `${getTopCuisine()} sevdiğini fark ettik · senin için seçtik`
    : 'En beğenilenlerle başla — gezdikçe kişiselleşir';

  // ─── Yatay restoran kartı (Sana Özel + Popüler bölümlerinde paylaşılır) ───
  const renderCard = (item, index) => {
    const active = index === 0;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.popularCard, active && styles.popularCardActive]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Detail', { id: item.id })}
      >
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingIcon}>⭐</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>

        <Image source={{ uri: item.image }} style={[styles.popularImage, active && styles.popularImageActive]} />

        <Text style={[styles.popularTitle, active && styles.popularTitleActive]} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.popularDesc} numberOfLines={2}>{item.desc}</Text>

        <View style={styles.popularFooter}>
          <Text style={styles.popularLocation} numberOfLines={1}>📍 {item.location}</Text>
          <View style={[styles.addBtn, active && styles.addBtnActive]}>
            <Text style={[styles.addBtnText, active && styles.addBtnTextActive]}>›</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ═══ Header ═══ */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.locationContainer}>
          <Text style={styles.locationLabel}>KONUM</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>İstanbul</Text>
            <Text style={styles.locationArrow}>▼</Text>
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.headerIcon}>🛍️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.headerIcon}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* ═══ Promo Banner ═══ */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoCodeRow}>
              <Text style={styles.promoCodeLabel}>KOD KULLAN</Text>
              <View style={styles.promoCodeBadge}>
                <Text style={styles.promoCodeText}>FIRST50</Text>
              </View>
            </View>
            <Text style={styles.promoTitle}>İlk Siparişine{'\n'}%50 İndirim!</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' }}
            style={styles.promoImage}
          />
        </View>

        {/* ═══ Category Pills ═══ */}
        {categories.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContainer}>
            {categories.map((cat) => {
              const isActive = cat === selectedCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ═══ Yükleniyor ═══ */}
        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.centerText}>Restoranlar yükleniyor...</Text>
          </View>
        )}

        {/* ═══ Hata ═══ */}
        {!loading && error && (
          <View style={styles.centerBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.centerText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadRestaurants}>
              <Text style={styles.retryBtnText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ═══ Boş ═══ */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.centerBox}>
            <Text style={styles.errorIcon}>🍽️</Text>
            <Text style={styles.centerText}>Bu kategoride restoran bulunamadı.</Text>
          </View>
        )}

        {/* ═══ İçerik ═══ */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {/* ─── Sana Özel (AI Öneri) ─── */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitle}>✨ Sana Özel</Text>
                <Text style={styles.sectionSubtitle} numberOfLines={1}>{recoSubtitle}</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll} contentContainerStyle={styles.popularContainer}>
              {recommended.map(renderCard)}
            </ScrollView>

            {/* ─── Popüler (Yatay Kartlar) ─── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popüler</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll} contentContainerStyle={styles.popularContainer}>
              {populer.map(renderCard)}
            </ScrollView>

            {/* ─── Tüm Restoranlar (Dikey Liste) ─── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tüm Restoranlar</Text>
              <Text style={styles.seeAllText}>{filtered.length} restoran</Text>
            </View>

            {filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.bestChoiceCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Detail', { id: item.id })}
              >
                <Image source={{ uri: item.image }} style={styles.bestChoiceImage} />
                <View style={styles.bestChoiceInfo}>
                  <Text style={styles.bestChoiceTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.bestChoiceDesc} numberOfLines={1}>{item.desc}</Text>

                  <View style={styles.bestChoiceFooter}>
                    <View style={styles.calorieBadge}>
                      <Text style={styles.calorieIcon}>⭐</Text>
                      <Text style={styles.calorieText}>{item.rating}</Text>
                    </View>
                    <Text style={styles.bestChoiceLocation} numberOfLines={1}>📍 {item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },

  // ─── Header ───
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(18,18,18,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  locationArrow: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },

  // ─── Promo Banner ───
  promoBanner: {
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promoCodeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1.5,
  },
  promoCodeBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promoCodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  promoTitle: {
    ...TYPOGRAPHY.h3,
    color: '#000000',
    fontWeight: '800',
  },
  promoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    transform: [{ rotate: '12deg' }],
  },

  // ─── Category Pills ───
  categoryScroll: {
    marginTop: SPACING.lg,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  categoryPillTextActive: {
    color: '#000000',
  },

  // ─── Durum Kutuları (Loading / Error / Empty) ───
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.md,
  },
  centerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 40,
  },
  retryBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 999,
  },
  retryBtnText: {
    ...TYPOGRAPHY.label,
    color: '#000000',
    fontWeight: '700',
  },

  // ─── Horizontal Popular Cards ───
  popularScroll: {
    marginTop: SPACING.sm,
  },
  popularContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.xxxl,
  },
  popularCard: {
    width: 160,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  popularCardActive: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderColor: 'rgba(0,230,118,0.3)',
    transform: [{ translateY: -10 }],
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    gap: 4,
  },
  ratingIcon: {
    fontSize: 10,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  popularImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    marginTop: -40,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.surfaceContainer,
  },
  popularImageActive: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: -50,
    borderColor: COLORS.surfaceContainerHigh,
  },
  popularTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  popularTitleActive: {
    color: COLORS.primary,
    fontSize: 16,
  },
  popularDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    height: 28,
  },
  popularFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: SPACING.sm,
  },
  popularLocation: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnActive: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  addBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  addBtnTextActive: {
    color: '#000',
    fontSize: 18,
  },

  // ─── Section Header ───
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitleCol: {
    flex: 1,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
  },
  seeAllText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },

  // ─── Vertical Restaurant Card ───
  bestChoiceCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bestChoiceInfo: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'center',
  },
  bestChoiceTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    marginBottom: 4,
    fontSize: 16,
  },
  bestChoiceDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  bestChoiceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  bestChoiceLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  calorieIcon: {
    fontSize: 10,
  },
  calorieText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bestChoiceImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
  },
});

export default HomeScreen;

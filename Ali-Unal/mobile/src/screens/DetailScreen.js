// ─────────────────────────────────────────────
// Restoran Detay Ekranı — Stitch Design (Uber Style)
// Yemekim Nerede - Neon Green Dark Mode
// Gerçek veri: GET /v1/restaurants/:id (restoran + menü)
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
  TextInput,
  Alert,
} from 'react-native';
import COLORS from '../theme/colors';
import TYPOGRAPHY from '../theme/typography';
import SPACING from '../theme/spacing';
import RestaurantService from '../services/restaurantService';
import { recordRestaurantView } from '../services/recommendationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Menü kategorilerinin gösterim sırası
const KATEGORI_SIRASI = ['Başlangıç', 'Ana Yemek', 'Tatlı', 'İçecek'];

// Gün kısaltmaları (çalışma saatleri için)
const GUN_KISA = {
  Pazartesi: 'Pzt', Salı: 'Sal', Çarşamba: 'Çar', Perşembe: 'Per',
  Cuma: 'Cum', Cumartesi: 'Cmt', Pazar: 'Paz',
};

const DetailScreen = ({ route, navigation }) => {
  const restoranId = route.params?.id;

  const [restoran, setRestoran] = useState(null);
  const [menu, setMenu] = useState([]);
  const [yorumlar, setYorumlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Yorum ekleme formu
  const [myPuan, setMyPuan] = useState(5);
  const [myYorum, setMyYorum] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ─── Veri Çekme ───
  const load = useCallback(async () => {
    if (!restoranId) {
      setError('Restoran bilgisi bulunamadı.');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const res = await RestaurantService.getRestaurantDetail(restoranId);
      setRestoran(res.restoran);
      setMenu(res.menu);
      setYorumlar(res.yorumlar || []);
      // "Sana Özel" önerisi için bu ziyareti (mutfak türünü) öğren
      recordRestaurantView(res.restoran);
    } catch (e) {
      setError(e?.message || 'Restoran detayı yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [restoranId]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── Yorum Gönder ───
  const submitReview = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await RestaurantService.addReview(restoranId, myPuan, myYorum.trim());
      setMyYorum('');
      setMyPuan(5);
      Alert.alert('Teşekkürler', 'Değerlendirmen eklendi!');
      await load(); // yorumları + güncel puanı tazele
    } catch (e) {
      Alert.alert('Hata', e?.message || 'Yorum eklenemedi. Giriş yapman gerekebilir.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Menüyü kategorilere göre grupla ve sırala ───
  const gruplar = menu.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});
  const siraliKategoriler = Object.keys(gruplar).sort((a, b) => {
    const ia = KATEGORI_SIRASI.indexOf(a);
    const ib = KATEGORI_SIRASI.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  // ════════ Yükleniyor ════════
  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.centerText}>Restoran yükleniyor...</Text>
      </View>
    );
  }

  // ════════ Hata ════════
  if (error || !restoran) {
    return (
      <View style={[styles.screen, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.centerText}>{error || 'Restoran bulunamadı.'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.retryBtnText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ════════ İçerik ════════
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ═══ Hero Görsel ═══ */}
        <View style={styles.imageContainer}>
          {restoran.image ? (
            <Image source={{ uri: restoran.image }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Text style={styles.heroPlaceholderIcon}>🍽️</Text>
            </View>
          )}
          <View style={styles.imageOverlay} />
        </View>

        {/* ═══ Üst Navigasyon ═══ */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Text style={styles.headerIcon}>❮</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Restoran</Text>
          <View style={styles.iconButton} />
        </View>

        {/* ═══ Restoran Bilgileri ═══ */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{restoran.title}</Text>

          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {restoran.address}{restoran.location ? `, ${restoran.location}` : ''}
            </Text>
          </View>

          {/* Meta rozetler */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⭐</Text>
              <Text style={styles.metaTextBold}>{restoran.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🍴</Text>
              <Text style={styles.metaText}>{restoran.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📋</Text>
              <Text style={styles.metaText}>{menu.length} ürün</Text>
            </View>
          </View>

          {/* Çalışma saatleri */}
          {restoran.calismaSaatleri && restoran.calismaSaatleri.length > 0 && (
            <View style={styles.hoursSection}>
              <Text style={styles.sectionLabel}>🕒 Çalışma Saatleri</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hoursRow}>
                {restoran.calismaSaatleri.map((s, i) => (
                  <View key={i} style={styles.hourChip}>
                    <Text style={styles.hourDay}>{GUN_KISA[s.gun] || s.gun}</Text>
                    <Text style={styles.hourTime}>{s.acilis}-{s.kapanis}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* ═══ Menü ═══ */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>Menü</Text>

          {menu.length === 0 && (
            <Text style={styles.emptyMenuText}>Bu restoran için henüz menü eklenmemiş.</Text>
          )}

          {siraliKategoriler.map((kategori) => (
            <View key={kategori} style={styles.categoryBlock}>
              <Text style={styles.categoryTitle}>{kategori}</Text>

              {gruplar[kategori].map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.menuImage} />
                  ) : (
                    <View style={[styles.menuImage, styles.menuImagePlaceholder]}>
                      <Text>🍽️</Text>
                    </View>
                  )}

                  <View style={styles.menuInfo}>
                    <Text style={styles.menuTitle} numberOfLines={1}>{item.title}</Text>
                    {!!item.desc && <Text style={styles.menuDesc} numberOfLines={2}>{item.desc}</Text>}

                    <View style={styles.menuFooter}>
                      <Text style={styles.menuPrice}>{item.priceLabel}</Text>
                      {item.tags.length > 0 && (
                        <View style={styles.tagRow}>
                          {item.tags.map((t) => (
                            <View key={t} style={styles.tag}>
                              <Text style={styles.tagText}>{t}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* ═══ Değerlendirmeler ═══ */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>Değerlendirmeler ({yorumlar.length})</Text>

          {/* Yorum ekleme formu */}
          <View style={styles.reviewForm}>
            <Text style={styles.reviewFormLabel}>Puanın:</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => setMyPuan(n)} activeOpacity={0.7}>
                  <Text style={[styles.star, n <= myPuan && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Bir yorum yaz (opsiyonel)..."
              placeholderTextColor={COLORS.textSecondary}
              value={myYorum}
              onChangeText={setMyYorum}
              multiline
            />
            <TouchableOpacity
              style={[styles.reviewSubmitBtn, submitting && { opacity: 0.6 }]}
              onPress={submitReview}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewSubmitText}>{submitting ? 'Gönderiliyor...' : 'Değerlendir'}</Text>
            </TouchableOpacity>
          </View>

          {/* Yorum listesi */}
          {yorumlar.length === 0 ? (
            <Text style={styles.emptyMenuText}>Henüz yorum yok. İlk yorumu sen yap!</Text>
          ) : (
            yorumlar.map((y) => (
              <View key={y.id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewAuthor}>{y.ad}</Text>
                  <Text style={styles.reviewStars}>{'★'.repeat(y.puan)}{'☆'.repeat(5 - y.puan)}</Text>
                </View>
                {!!y.yorum && <Text style={styles.reviewText}>{y.yorum}</Text>}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.screenPadding,
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
  scrollContent: {
    paddingBottom: 40,
  },

  // ─── Hero Görsel ───
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.7,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {
    fontSize: 60,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 120,
  },

  // ─── Header (Absolute) ───
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },

  // ─── Bilgiler ───
  detailsContainer: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: 6,
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
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaTextBold: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  metaText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },

  // ─── Çalışma Saatleri ───
  hoursSection: {
    marginTop: SPACING.lg,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  hoursRow: {
    gap: SPACING.sm,
    paddingRight: SPACING.screenPadding,
  },
  hourChip: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 64,
  },
  hourDay: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.primary,
    fontWeight: '700',
  },
  hourTime: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ─── Menü ───
  menuContainer: {
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.xl,
  },
  menuHeader: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  emptyMenuText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
  categoryBlock: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  menuImagePlaceholder: {
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  menuTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 15,
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  menuFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuPrice: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontSize: 15,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // ─── Değerlendirmeler ───
  reviewForm: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reviewFormLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  starRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.md,
  },
  star: {
    fontSize: 30,
    color: COLORS.surfaceContainerHigh,
  },
  starActive: {
    color: COLORS.primary,
  },
  reviewInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reviewSubmitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  reviewSubmitText: {
    ...TYPOGRAPHY.label,
    color: '#000000',
    fontWeight: '800',
  },
  reviewCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAuthor: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  reviewStars: {
    color: COLORS.primary,
    fontSize: 14,
  },
  reviewText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
});

export default DetailScreen;
